import { Suspense } from "react";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-advanced";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProduct, updateProduct, getCategories, getBrands } from "@/actions/admin/products";
import { CONDITIONS } from "@/lib/products";
import SpecificationsInput from "@/components/admin/specifications-input";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const categories = await getCategories();
  const brands = await getBrands();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Edit Product</h2>
          <p className="text-muted-foreground">Update product details</p>
        </div>
      </div>

      <form action={async (formData: FormData) => {
        "use server";
        const specsData = formData.get("specifications");
        let specifications: Record<string, string> = {};
        if (specsData && typeof specsData === "string") {
          try {
            specifications = JSON.parse(specsData);
          } catch {
            specifications = {};
          }
        }

        const data = {
          name: String(formData.get("name") || ""),
          slug: String(formData.get("slug") || ""),
          description: String(formData.get("description") || ""),
          shortDescription: String(formData.get("shortDescription") || ""),
          sku: String(formData.get("sku") || ""),
          brandId: String(formData.get("brandId") || ""),
          categoryId: String(formData.get("categoryId") || ""),
          condition: String(formData.get("condition") || "new") as any,
          grade: String(formData.get("grade") || "") as any,
          batteryHealth: formData.get("batteryHealth") ? parseInt(String(formData.get("batteryHealth")), 10) : undefined,
          cosmeticCondition: String(formData.get("cosmeticCondition") || ""),
          testingStatus: String(formData.get("testingStatus") || ""),
          price: parseFloat(String(formData.get("price") || "0")),
          compareAtPrice: formData.get("compareAtPrice") ? parseFloat(String(formData.get("compareAtPrice"))) : undefined,
          discountPercent: parseInt(String(formData.get("discountPercent") || "0"), 10),
          stock: parseInt(String(formData.get("stock") || "0"), 10),
          warranty: String(formData.get("warranty") || ""),
          warrantyPeriod: String(formData.get("warrantyPeriod") || ""),
          thumbnail: String(formData.get("thumbnail") || ""),
          videoUrl: String(formData.get("videoUrl") || ""),
          model3DUrl: String(formData.get("model3DUrl") || ""),
          isFeatured: formData.get("isFeatured") === "on",
          isTrending: formData.get("isTrending") === "on",
          isActive: formData.get("isActive") === "on",
          metaTitle: String(formData.get("metaTitle") || ""),
          metaDescription: String(formData.get("metaDescription") || ""),
          specifications,
        };

        const result = await updateProduct(id, data);
        if (result.success) {
          redirect("/admin/products");
        }
      }}>
        <input type="hidden" name="id" value={product.id} />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input id="name" name="name" required defaultValue={product.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input id="slug" name="slug" required defaultValue={product.slug} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" name="sku" defaultValue={product.sku || ""} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category *</Label>
                  <Select name="categoryId" required defaultValue={product.categoryId}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brandId">Brand</Label>
                  <Select name="brandId" defaultValue={product.brandId || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea id="shortDescription" name="shortDescription" rows={2} defaultValue={product.shortDescription || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={4} defaultValue={product.description || ""} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input id="price" name="price" type="number" step="0.01" required defaultValue={product.price.toString()} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compareAtPrice">Compare At Price</Label>
                  <Input id="compareAtPrice" name="compareAtPrice" type="number" step="0.01" defaultValue={product.compareAtPrice?.toString() || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountPercent">Discount %</Label>
                  <Input id="discountPercent" name="discountPercent" type="number" min="0" max="100" defaultValue={product.discountPercent.toString()} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" name="stock" type="number" defaultValue={product.stock.toString()} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Condition & Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select name="condition" defaultValue={product.condition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITIONS.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Select name="grade" defaultValue={product.grade || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A", "B", "C"].map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batteryHealth">Battery Health (%)</Label>
                  <Input id="batteryHealth" name="batteryHealth" type="number" min="0" max="100" defaultValue={product.batteryHealth?.toString() || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cosmeticCondition">Cosmetic Condition</Label>
                  <Input id="cosmeticCondition" name="cosmeticCondition" defaultValue={product.cosmeticCondition || ""} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="testingStatus">Testing Status</Label>
                <Input id="testingStatus" name="testingStatus" defaultValue={product.testingStatus || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warranty">Warranty</Label>
                <Input id="warranty" name="warranty" defaultValue={product.warranty || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warrantyPeriod">Warranty Period</Label>
                <Input id="warrantyPeriod" name="warrantyPeriod" defaultValue={product.warrantyPeriod || ""} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label>Product Image</Label>
                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-2 text-muted-foreground" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    <p className="text-xs text-muted-foreground">Click to upload product image</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input id="thumbnail" name="thumbnail" defaultValue={product.thumbnail || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input id="videoUrl" name="videoUrl" defaultValue={product.videoUrl || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model3DUrl">3D Model URL</Label>
                <Input id="model3DUrl" name="model3DUrl" defaultValue={product.model3DUrl || ""} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <SpecificationsInput defaultValue={product.specifications ?? undefined} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO & Status</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input id="metaTitle" name="metaTitle" defaultValue={product.metaTitle || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea id="metaDescription" name="metaDescription" rows={2} defaultValue={product.metaDescription || ""} />
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isFeatured" name="isFeatured" defaultChecked={product.isFeatured} className="h-4 w-4 rounded border-border" />
                  <Label htmlFor="isFeatured">Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isTrending" name="isTrending" defaultChecked={product.isTrending} className="h-4 w-4 rounded border-border" />
                  <Label htmlFor="isTrending">Trending</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isActive" name="isActive" defaultChecked={product.isActive} className="h-4 w-4 rounded border-border" />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin/products">Cancel</Link>
            </Button>
            <Button type="submit">Update Product</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
