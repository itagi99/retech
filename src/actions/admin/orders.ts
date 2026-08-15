"use server";

import { db } from "@/lib/db";
import { orders, orderItems, users } from "@drizzle/schema";
import { eq, desc, sql, ilike, and, gte, lte, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getOrders(filters?: {
  search?: string;
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}) {
  const limit = filters?.limit || 10;
  const page = filters?.page || 1;
  const offset = (page - 1) * limit;

  const conditions = [];

  if (filters?.search) {
    const search = `%${filters.search}%`;
    conditions.push(
      or(
        ilike(orders.orderNumber, search),
        sql`EXISTS (SELECT 1 FROM ${users} WHERE ${users.id} = ${orders.userId} AND ${ilike(users.name, search)})`
      )
    );
  }
  if (filters?.status && filters.status !== "all") {
    conditions.push(eq(orders.status, filters.status as any));
  }
  if (filters?.paymentStatus && filters.paymentStatus !== "all") {
    conditions.push(eq(orders.paymentStatus, filters.paymentStatus as any));
  }
  if (filters?.dateFrom) {
    conditions.push(gte(orders.createdAt, filters.dateFrom as any));
  }
  if (filters?.dateTo) {
    conditions.push(lte(orders.createdAt, filters.dateTo as any));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [data, [{ count }]] = await Promise.all([
    db.select().from(orders).where(where).orderBy(desc(orders.createdAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(orders).where(where),
  ]);

  return { orders: data, total: count, totalPages: Math.ceil(count / limit) };
}

export async function getOrder(id: string) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) return null;

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  const user = order.userId ? await db.select().from(users).where(eq(users.id, order.userId)).limit(1) : [];
  const userData = user[0] || null;

  return { ...order, items, user: userData };
}

export async function updateOrderStatus(id: string, status: string) {
  const [order] = await db
    .update(orders)
    .set({ status: status as any, updatedAt: new Date().toISOString() })
    .where(eq(orders.id, id))
    .returning();
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return { success: true, order };
}

export async function updateTrackingNumber(id: string, trackingNumber: string) {
  const [order] = await db
    .update(orders)
    .set({ trackingNumber, updatedAt: new Date().toISOString() })
    .where(eq(orders.id, id))
    .returning();
  revalidatePath(`/admin/orders/${id}`);
  return { success: true, order };
}

export async function getCustomers(filters?: { search?: string; page?: number; limit?: number }) {
  const limit = filters?.limit || 10;
  const page = filters?.page || 1;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (filters?.search) {
    const search = `%${filters.search}%`;
    conditions.push(
      or(
        ilike(users.name, search),
        ilike(users.email, search)
      )
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [data, [{ count }]] = await Promise.all([
    db.select().from(users).where(where).orderBy(desc(users.createdAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(users).where(where),
  ]);

  const customers = await Promise.all(
    data.map(async (user) => {
      const userOrders = await db.select().from(orders).where(eq(orders.userId, user.id));
      const totalSpent = userOrders.reduce((sum, o) => sum + Number(o.total), 0);
      return {
        ...user,
        ordersCount: userOrders.length,
        totalSpent,
      };
    })
  );

  return { customers: customers, total: count, totalPages: Math.ceil(count / limit) };
}

export async function getCustomer(id: string) {
  const [customer] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!customer) return null;

  const userOrders = await db.select().from(orders).where(eq(orders.userId, id)).orderBy(desc(orders.createdAt));

  return { ...customer, orders: userOrders };
}
