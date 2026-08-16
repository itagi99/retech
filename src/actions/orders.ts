"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { orders, orderItems, carts, cartItems, users } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { getCustomerSession } from "@/lib/customer-session";

export interface OrderWithItems {
  id: string;
  userId: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  paymentId: string | null;
  subtotal: string;
  discount: string;
  shipping: string;
  tax: string;
  total: string;
  shippingAddress: Record<string, string>;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    orderId: string;
    productId: string;
    productName: string;
    productImage: string | null;
    price: string;
    quantity: number;
    total: string;
  }[];
}

export async function createOrder(formData: FormData) {
  const session = await getCustomerSession();
  if (!session) {
    return { error: "Please log in to place an order" };
  }

  const shippingAddressJson = formData.get("shippingAddress") as string;
  const shippingMethod = formData.get("shippingMethod") as string;
  const subtotal = parseFloat(formData.get("subtotal") as string);
  const discount = parseFloat(formData.get("discount") as string) || 0;
  const shippingCost = parseFloat(formData.get("shipping") as string) || 0;
  const tax = parseFloat(formData.get("tax") as string) || 0;
  const total = parseFloat(formData.get("total") as string);
  const paymentMethod = formData.get("paymentMethod") as string;
  const paymentId = formData.get("paymentId") as string | null;
  const itemsJson = formData.get("items") as string;

  if (!shippingAddressJson || !subtotal || !total || !itemsJson) {
    return { error: "Missing required order information" };
  }

  const shippingAddress = JSON.parse(shippingAddressJson);
  const cartItemsData = JSON.parse(itemsJson) as { productId: string; name: string; image: string; price: number; quantity: number }[];

  const shippingCosts: Record<string, number> = {
    standard: 9.99,
    express: 19.99,
    overnight: 39.99,
  };

  const calculatedShipping = shippingCosts[shippingMethod] || 9.99;
  const calculatedTax = Math.round(subtotal * 0.08 * 100) / 100;
  const calculatedTotal = Math.round((subtotal + calculatedShipping + calculatedTax - discount) * 100) / 100;

  const orderNumber = `RT-${Date.now().toString(36).toUpperCase()}`;

  const [order] = await db.insert(orders).values({
    userId: session.userId,
    orderNumber,
    status: "pending",
    paymentStatus: paymentId ? "paid" : "pending",
    paymentMethod: paymentMethod || "card",
    paymentId: paymentId || null,
    subtotal: subtotal.toString(),
    discount: discount.toString(),
    shipping: calculatedShipping.toString(),
    tax: calculatedTax.toString(),
    total: calculatedTotal.toString(),
    shippingAddress,
    trackingNumber: null,
    notes: null,
  }).returning();

  await db.insert(orderItems).values(
    cartItemsData.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      productName: item.name,
      productImage: item.image,
      price: item.price.toString(),
      quantity: item.quantity,
      total: String(Math.round(item.price * item.quantity * 100) / 100),
    }))
  );

  const [userCart] = await db.select().from(carts).where(eq(carts.userId, session.userId)).limit(1);
  if (userCart) {
    await db.delete(cartItems).where(eq(cartItems.cartId, userCart.id));
  }

  revalidatePath("/");
  revalidatePath("/account");
  revalidatePath("/account/orders");
  redirect(`/checkout/success?orderId=${order.id}`);
}

export async function getUserOrders() {
  const session = await getCustomerSession();
  if (!session) {
    return [];
  }

  const userOrders = await db.select().from(orders).where(eq(orders.userId, session.userId)).orderBy(desc(orders.createdAt));

  const ordersWithItems = await Promise.all(userOrders.map(async (order) => {
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    return {
      ...order,
      shippingAddress: typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress,
      items
    };
  }));

  return ordersWithItems;
}

export async function getOrder(orderId: string) {
  const session = await getCustomerSession();
  if (!session) {
    return null;
  }

  const [order] = await db.select().from(orders).where(and(eq(orders.id, orderId), eq(orders.userId, session.userId))).limit(1);
  if (!order) return null;

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));

  return {
    ...order,
    shippingAddress: typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress,
    items
  } as OrderWithItems;
}
