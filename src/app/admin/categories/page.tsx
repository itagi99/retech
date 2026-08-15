import { Suspense } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-advanced";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/actions/admin/products";

async function CategoriesTable() {
  const categories = await getCategories();

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="font-mono text-xs">{category.slug}</TableCell>
                  <TableCell>{category.sortOrder ?? 0}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${category.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"}`}>
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" disabled={index === 0}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" disabled={index === categories.length - 1}>
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                          </DialogHeader>
                          <form id={`category-form-${category.id}`} action={async (formData: FormData) => {
                            "use server";
                            const data = {
                              name: String(formData.get("name")),
                              slug: String(formData.get("slug")),
                              description: String(formData.get("description") || ""),
                              image: String(formData.get("image") || ""),
                              sortOrder: Number(formData.get("sortOrder") || 0),
                              isActive: formData.get("isActive") === "on",
                              parentId: "",
                            };
                            await updateCategory(category.id, data);
                          }}>
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor={`name-${category.id}`}>Name</Label>
                                <Input id={`name-${category.id}`} name="name" required defaultValue={category.name} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`slug-${category.id}`}>Slug</Label>
                                <Input id={`slug-${category.id}`} name="slug" required defaultValue={category.slug} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`description-${category.id}`}>Description</Label>
                                <Textarea id={`description-${category.id}`} name="description" defaultValue={category.description || ""} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`image-${category.id}`}>Image URL</Label>
                                <Input id={`image-${category.id}`} name="image" defaultValue={category.image || ""} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`sortOrder-${category.id}`}>Sort Order</Label>
                                 <Input id={`sortOrder-${category.id}`} name="sortOrder" type="number" defaultValue={(category.sortOrder ?? 0).toString()} />
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id={`isActive-${category.id}`} name="isActive" defaultChecked={category.isActive} className="h-4 w-4 rounded border-border" />
                                <Label htmlFor={`isActive-${category.id}`}>Active</Label>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" form={`category-form-${category.id}`}>Update</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <form action={async () => {
                        "use server";
                        await deleteCategory(category.id);
                      }}>
                        <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <form id="category-form-new" action={async (formData: FormData) => {
              "use server";
              const data = {
                name: String(formData.get("name")),
                slug: String(formData.get("slug")),
                description: String(formData.get("description") || ""),
                image: String(formData.get("image") || ""),
                sortOrder: Number(formData.get("sortOrder") || 0),
                isActive: formData.get("isActive") === "on",
                parentId: "",
              };
              await createCategory(data);
            }}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name-new">Name</Label>
                  <Input id="name-new" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug-new">Slug</Label>
                  <Input id="slug-new" name="slug" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description-new">Description</Label>
                  <Textarea id="description-new" name="description" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-new">Image URL</Label>
                  <Input id="image-new" name="image" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sortOrder-new">Sort Order</Label>
                  <Input id="sortOrder-new" name="sortOrder" type="number" defaultValue="0" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isActive-new" name="isActive" defaultChecked className="h-4 w-4 rounded border-border" />
                  <Label htmlFor="isActive-new">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" form="category-form-new">Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <CategoriesTable />
      </Suspense>
    </div>
  );
}
