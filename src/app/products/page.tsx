import { getProducts } from "@/lib/products";
import ProductsClient from "./products-client";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const products = await getProducts();
  return <ProductsClient searchParams={searchParams} initialProducts={products} />;
}
