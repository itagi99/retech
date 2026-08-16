"use server";

import { db } from "@/lib/db";
import { products, productImages, categories, brands } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function getProductBySlug(slug: string) {
  const [product] = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      shortDescription: products.shortDescription,
      condition: products.condition,
      grade: products.grade,
      batteryHealth: products.batteryHealth,
      cosmeticCondition: products.cosmeticCondition,
      price: products.price,
      compareAtPrice: products.compareAtPrice,
      discountPercent: products.discountPercent,
      stock: products.stock,
      rating: products.rating,
      reviewCount: products.reviewCount,
      warranty: products.warranty,
      thumbnail: products.thumbnail,
      videoUrl: products.videoUrl,
      model3DUrl: products.model3DUrl,
      specifications: products.specifications,
      isFeatured: products.isFeatured,
      categoryId: products.categoryId,
      brandId: products.brandId,
      createdAt: products.createdAt,
    })
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (!product) return null;

  const images = await db
    .select({ url: productImages.url, alt: productImages.alt })
    .from(productImages)
    .where(eq(productImages.productId, product.id))
    .orderBy(productImages.sortOrder);

  // Fallback to thumbnail if no product images
  const imageUrls = images.length > 0 ? images.map((i) => i.url) : (product.thumbnail ? [product.thumbnail] : []);

  let categoryName = "";
  let brandName = "";
  if (product.categoryId) {
    const [cat] = await db.select().from(categories).where(eq(categories.id, product.categoryId)).limit(1);
    categoryName = cat?.name || "";
  }
  if (product.brandId) {
    const [brand] = await db.select().from(brands).where(eq(brands.id, product.brandId)).limit(1);
    brandName = brand?.name || "";
  }

  return {
    ...product,
    images: images.map((i) => i.url),
    categoryName,
    brandName,
    price: parseFloat(product.price),
    compareAtPrice: product.compareAtPrice ? parseFloat(product.compareAtPrice) : null,
    rating: parseFloat(product.rating || "0"),
  };
}

export async function getProductForCart(slug: string) {
  const product = await getProductBySlug(slug);
  if (!product) return null;
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    image: product.images[0] || product.thumbnail || "",
    stock: product.stock,
  };
}
