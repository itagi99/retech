"use server";

import { db } from "@/lib/db";
import { products, categories, brands, productImages } from "@drizzle/schema";
import { eq, desc, or, sql, ilike, and } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  sku: z.string().optional(),
  brandId: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  condition: z.enum(["new", "refurbished", "open_box", "used"]).default("new"),
  grade: z.enum(["A", "B", "C"]).optional(),
  batteryHealth: z.coerce.number().min(0).max(100).optional(),
  cosmeticCondition: z.string().optional(),
  testingStatus: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  compareAtPrice: z.coerce.number().min(0).optional(),
  discountPercent: z.coerce.number().min(0).max(100).default(0),
  stock: z.coerce.number().min(0).default(0),
  warranty: z.string().optional(),
  warrantyPeriod: z.string().optional(),
  thumbnail: z.string().optional(),
  videoUrl: z.string().optional(),
  model3DUrl: z.string().optional(),
  isFeatured: z.coerce.boolean().default(false),
  isTrending: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  specifications: z.record(z.string(), z.string()).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export async function getProducts(filters?: {
  search?: string;
  category?: string;
  brand?: string;
  condition?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const conditions = [];
  const limit = filters?.limit || 10;
  const page = filters?.page || 1;
  const offset = (page - 1) * limit;

  if (filters?.search) {
    const search = `%${filters.search}%`;
    conditions.push(
      or(
        ilike(products.name, search),
        ilike(products.sku, search)
      )
    );
  }
  if (filters?.category && filters.category !== "all") {
    conditions.push(eq(products.categoryId, filters.category));
  }
  if (filters?.brand && filters.brand !== "all") {
    conditions.push(eq(products.brandId, filters.brand));
  }
  if (filters?.condition && filters.condition !== "all") {
    conditions.push(eq(products.condition, filters.condition as any));
  }
  if (filters?.status === "active") {
    conditions.push(eq(products.isActive, true));
  } else if (filters?.status === "inactive") {
    conditions.push(eq(products.isActive, false));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [data, [{ count }]] = await Promise.all([
    db.select().from(products).where(where).orderBy(desc(products.createdAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(products).where(where),
  ]);

  return { products: data, total: count, totalPages: Math.ceil(count / limit) };
}

export async function getProduct(id: string) {
  const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return product || null;
}

export async function createProduct(data: ProductFormData) {
  const validated = productSchema.parse(data);
  const [product] = await db.insert(products).values(validated as any).returning();
  revalidatePath("/admin/products");
  return { success: true, product };
}

export async function updateProduct(id: string, data: ProductFormData) {
  const validated = productSchema.parse(data);
  const [product] = await db.update(products).set(validated as any).where(eq(products.id, id)).returning();
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  return { success: true, product };
}

export async function deleteProduct(id: string) {
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/products");
  return { success: true };
}

export async function getCategories() {
  return db.select().from(categories).orderBy(categories.sortOrder, categories.name);
}

export async function getBrands() {
  return db.select().from(brands).orderBy(brands.name);
}

export async function getCategory(id: string) {
  const [category] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return category || null;
}

export async function createCategory(data: { name: string; slug: string; description?: string; image?: string; parentId?: string; sortOrder?: number; isActive?: boolean }) {
  const [category] = await db.insert(categories).values(data).returning();
  revalidatePath("/admin/categories");
  return { success: true, category };
}

export async function updateCategory(id: string, data: { name: string; slug: string; description?: string; image?: string; parentId?: string; sortOrder?: number; isActive?: boolean }) {
  const [category] = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
  revalidatePath("/admin/categories");
  return { success: true, category };
}

export async function deleteCategory(id: string) {
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function getBrand(id: string) {
  const [brand] = await db.select().from(brands).where(eq(brands.id, id)).limit(1);
  return brand || null;
}

export async function createBrand(data: { name: string; slug: string; logo?: string; description?: string }) {
  const [brand] = await db.insert(brands).values(data).returning();
  revalidatePath("/admin/products");
  return { success: true, brand };
}

export async function updateBrand(id: string, data: { name: string; slug: string; logo?: string; description?: string }) {
  const [brand] = await db.update(brands).set(data).where(eq(brands.id, id)).returning();
  revalidatePath("/admin/products");
  return { success: true, brand };
}

export async function deleteBrand(id: string) {
  await db.delete(brands).where(eq(brands.id, id));
  revalidatePath("/admin/products");
  return { success: true };
}
