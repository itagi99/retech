export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getBanners, createBanner, updateBanner, deleteBanner } from "@/actions/admin/banners";

async function BannersTable() {
  const banners = await getBanners();

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subtitle</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Sort</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No banners found.
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell className="font-medium">{banner.title}</TableCell>
                  <TableCell className="text-muted-foreground">{banner.subtitle || "-"}</TableCell>
                  <TableCell>
                    {banner.image ? (
                      <img src={banner.image} alt={banner.title} className="h-10 w-20 rounded object-cover" />
                    ) : (
                      <span className="text-xs text-muted-foreground">No image</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {banner.link ? (
                      <a href={banner.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                        {banner.link.length > 30 ? banner.link.slice(0, 30) + "..." : banner.link}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{banner.sortOrder ?? 0}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${banner.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"}`}>
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Banner</DialogTitle>
                          </DialogHeader>
                          <form id={`banner-form-${banner.id}`} action={async (formData: FormData) => {
                            "use server";
                            await updateBanner(banner.id, {
                              title: String(formData.get("title")),
                              subtitle: String(formData.get("subtitle") || ""),
                              image: String(formData.get("image")),
                              link: String(formData.get("link") || ""),
                              sortOrder: Number(formData.get("sortOrder") || 0),
                              isActive: formData.get("isActive") === "on",
                            });
                          }}>
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label>Title</Label>
                                <Input name="title" required defaultValue={banner.title} />
                              </div>
                              <div className="space-y-2">
                                <Label>Subtitle</Label>
                                <Input name="subtitle" defaultValue={banner.subtitle || ""} />
                              </div>
                              <div className="space-y-2">
                                <Label>Image URL</Label>
                                <Input name="image" required defaultValue={banner.image} />
                              </div>
                              <div className="space-y-2">
                                <Label>Link URL</Label>
                                <Input name="link" defaultValue={banner.link || ""} />
                              </div>
                              <div className="space-y-2">
                                <Label>Sort Order</Label>
                                <Input name="sortOrder" type="number" defaultValue={(banner.sortOrder ?? 0).toString()} />
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" name="isActive" defaultChecked={banner.isActive} className="h-4 w-4 rounded border-border" />
                                <Label>Active</Label>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" form={`banner-form-${banner.id}`}>Update</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <form action={async () => {
                        "use server";
                        await deleteBanner(banner.id);
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

export default function BannersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Banners</h2>
          <p className="text-muted-foreground">Manage homepage banners</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Banner</DialogTitle>
            </DialogHeader>
            <form id="banner-form-new" action={async (formData: FormData) => {
              "use server";
              await createBanner({
                title: String(formData.get("title")),
                subtitle: String(formData.get("subtitle") || ""),
                image: String(formData.get("image")),
                link: String(formData.get("link") || ""),
                sortOrder: Number(formData.get("sortOrder") || 0),
                isActive: formData.get("isActive") === "on",
              });
            }}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input name="title" required />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input name="subtitle" />
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input name="image" required />
                </div>
                <div className="space-y-2">
                  <Label>Link URL</Label>
                  <Input name="link" />
                </div>
                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Input name="sortOrder" type="number" defaultValue="0" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="isActive" defaultChecked className="h-4 w-4 rounded border-border" />
                  <Label>Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" form="banner-form-new">Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <BannersTable />
      </Suspense>
    </div>
  );
}
