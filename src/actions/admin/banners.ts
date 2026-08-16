"use server";

import { db } from "@/lib/db";
import { banners } from "@drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getBanners() {
  return db.select().from(banners).orderBy(banners.sortOrder, desc(banners.createdAt));
}

export async function getBanner(id: string) {
  const [banner] = await db.select().from(banners).where(eq(banners.id, id)).limit(1);
  return banner || null;
}

export async function createBanner(data: { title: string; subtitle?: string; image: string; link?: string; sortOrder?: number; isActive?: boolean }) {
  const [banner] = await db.insert(banners).values(data).returning();
  revalidatePath("/admin/banners");
  return { success: true, banner };
}

export async function updateBanner(id: string, data: { title: string; subtitle?: string; image: string; link?: string; sortOrder?: number; isActive?: boolean }) {
  const [banner] = await db.update(banners).set(data).where(eq(banners.id, id)).returning();
  revalidatePath("/admin/banners");
  return { success: true, banner };
}

export async function deleteBanner(id: string) {
  await db.delete(banners).where(eq(banners.id, id));
  revalidatePath("/admin/banners");
  return { success: true };
}
