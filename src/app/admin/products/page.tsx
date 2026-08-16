export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProducts, getCategories, getBrands, deleteProduct } from "@/actions/admin/products";
import { CONDITIONS } from "@/lib/products";
import { formatPriceFixed } from "@/lib/utils";

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function ProductActions({ id, slug }: { id: string; slug: string }) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
        <Link href={`/products/${slug}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
        <Link href={`/admin/products/${id}`}>
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      <form action={async () => {
        "use server";
        await deleteProduct(id);
      }}>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

async function ProductsTable({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = Number(searchParams.page) || 1;
  const search = typeof searchParams.search === "string" ? searchParams.search : "";
  const category = typeof searchParams.category === "string" ? searchParams.category : "all";
  const condition = typeof searchParams.condition === "string" ? searchParams.condition : "all";
  const status = typeof searchParams.status === "string" ? searchParams.status : "all";

  const { products, totalPages } = await getProducts({
    search,
    category,
    condition,
    status,
    page,
    limit: 10,
  });

  return (
    <>
      {/* Desktop table */}
      <div className="rounded-lg border border-border bg-background hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      {product.thumbnail ? (
                        <img src={product.thumbnail} alt={product.name} className="h-10 w-10 rounded-lg object-cover" />
                      ) : (
                        <span className="text-xs text-muted-foreground">No img</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.brandId || "-"}</TableCell>
                  <TableCell className="capitalize">{product.categoryId}</TableCell>
                  <TableCell className="capitalize">{product.condition.replace("_", " ")}</TableCell>
                  <TableCell>{formatPriceFixed(Number(product.price))}</TableCell>
                  <TableCell>
                    <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"}`}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <ProductActions id={product.id} slug={product.slug} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-4">
        {products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No products found.</div>
        ) : (
          products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      {product.thumbnail ? (
                        <img src={product.thumbnail} alt={product.name} className="h-12 w-12 rounded-lg object-cover" />
                      ) : (
                        <span className="text-xs text-muted-foreground">No img</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.brandId || "-"}</p>
                    </div>
                  </div>
                  <ProductActions id={product.id} slug={product.slug} />
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="capitalize">{product.condition.replace("_", " ")}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="capitalize">{product.categoryId}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                    Stock: {product.stock}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{formatPriceFixed(Number(product.price))}</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"}`}>
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" disabled={page <= 1} asChild>
            <Link href={`?page=${page - 1}&search=${search}&category=${category}&condition=${condition}&status=${status}`}>
              Previous
            </Link>
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
            <Link href={`?page=${page + 1}&search=${search}&category=${category}&condition=${condition}&status=${status}`}>
              Next
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolved = await searchParams;
  const categories = await getCategories();
  const brands = await getBrands();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <form className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Search products..."
              defaultValue={typeof resolved.search === "string" ? resolved.search : ""}
              className="pl-9"
            />
          </div>
          <select name="category" defaultValue={typeof resolved.category === "string" ? resolved.category : "all"} className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select name="condition" defaultValue={typeof resolved.condition === "string" ? resolved.condition : "all"} className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="all">All Conditions</option>
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.name}</option>
            ))}
          </select>
          <select name="status" defaultValue={typeof resolved.status === "string" ? resolved.status : "all"} className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button type="submit" variant="secondary">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </form>

        <Suspense fallback={<div>Loading...</div>}>
          <ProductsTable searchParams={resolved} />
        </Suspense>
      </div>
    </div>
  );
}
