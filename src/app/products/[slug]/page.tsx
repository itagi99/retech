import { notFound } from "next/navigation";
import { getProductBySlug } from "@/actions/product";
import ProductDetailClient from "@/components/products/product-detail-client";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
