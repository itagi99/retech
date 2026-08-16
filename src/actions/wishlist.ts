"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { db, isDbAvailable } from "@/lib/db";
import { wishlists, wishlistItems, products } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { getCustomerSession } from "@/lib/customer-session";

function dbError(message: string) {
  console.warn(message);
  return { error: "Database is not configured. Please set up Turso environment variables." };
}

export async function getWishlist() {
  const session = await getCustomerSession();
  if (!session) return [];

  if (!isDbAvailable()) {
    return [];
  }

  const [wishlist] = await db.select().from(wishlists).where(eq(wishlists.userId, session.userId)).limit(1);
  if (!wishlist) return [];

  const items = await db.select({
    id: wishlistItems.id,
    productId: wishlistItems.productId,
    createdAt: wishlistItems.createdAt,
    product: products,
  }).from(wishlistItems).where(eq(wishlistItems.wishlistId, wishlist.id)).innerJoin(products, eq(wishlistItems.productId, products.id));

  return items;
}

export async function addToWishlist(productId: string) {
  const session = await getCustomerSession();
  if (!session) return { error: "Please log in to add to wishlist" };

  if (!isDbAvailable()) {
    return dbError("addToWishlist: database not available");
  }

  const [wishlist] = await db.select().from(wishlists).where(eq(wishlists.userId, session.userId)).limit(1);
  if (!wishlist) return { error: "Wishlist not found" };

  const [existing] = await db.select().from(wishlistItems).where(and(eq(wishlistItems.wishlistId, wishlist.id), eq(wishlistItems.productId, productId))).limit(1);
  if (existing) {
    return { success: true, alreadyAdded: true };
  }

  await db.insert(wishlistItems).values({ wishlistId: wishlist.id, productId });
  revalidatePath("/");
  revalidatePath("/account");
  return { success: true };
}

export async function removeFromWishlist(productId: string) {
  const session = await getCustomerSession();
  if (!session) return { error: "Please log in" };

  if (!isDbAvailable()) {
    return dbError("removeFromWishlist: database not available");
  }

  const [wishlist] = await db.select().from(wishlists).where(eq(wishlists.userId, session.userId)).limit(1);
  if (!wishlist) return { error: "Wishlist not found" };

  await db.delete(wishlistItems).where(and(eq(wishlistItems.wishlistId, wishlist.id), eq(wishlistItems.productId, productId)));
  revalidatePath("/");
  revalidatePath("/account");
  return { success: true };
}
