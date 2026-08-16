"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2, Share2, Loader2, Check, X, Filter, Grid, List } from "lucide-react";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/actions/wishlist";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    price: string;
    compareAtPrice: string | null;
    discountPercent: number;
    thumbnail: string | null;
    slug: string;
    stock: number;
    condition: string;
  };
}

export default function AccountWishlistClient({ initialItems }: { initialItems: WishlistItem[] }) {
  const [items, setItems] = useState<WishlistItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { addItem, setIsOpen } = useCart();

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleRemove = async (productId: string) => {
    setLoading(true);
    const result = await removeFromWishlist(productId);
    if (result.success) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      toast.success("Removed from wishlist");
    }
    setLoading(false);
  };

  const handleAddToCart = (item: WishlistItem["product"]) => {
    addItem({
      productId: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: item.thumbnail || "/placeholder-product.svg",
      quantity: 1,
      slug: item.slug,
    });
    setIsOpen(true);
    toast.success("Added to cart");
  };

  const handleShare = async (product: WishlistItem["product"]) => {
    const url = `${window.location.origin}/products/${product.slug}`;
    if (navigator.share) {
      await navigator.share({ title: product.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case "new": return { label: "New", color: "bg-green-100 text-green-700" };
      case "refurbished": return { label: "Refurbished", color: "bg-yellow-100 text-yellow-700" };
      case "open_box": return { label: "Open Box", color: "bg-blue-100 text-blue-700" };
      case "used": return { label: "Used", color: "bg-gray-100 text-gray-700" };
      default: return { label: condition, color: "bg-muted text-muted-foreground" };
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Wishlist</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-4" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Wishlist</h1>
          <p className="text-sm text-muted-foreground mt-1">{items.length} item{items.length !== 1 ? "s" : ""} saved</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "bg-primary text-primary-foreground" : ""}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setViewMode("list")} className={viewMode === "list" ? "bg-primary text-primary-foreground" : ""}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-border bg-card">
          <Heart className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-6">Save items you love for later</p>
          <Link href="/products">
            <Button size="lg"><Heart className="h-4 w-4 mr-2" />Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className={cn(
          "gap-4",
          viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "space-y-4"
        )}>
          {items.map((item) => {
            const product = item.product;
            const badge = getConditionBadge(product.condition);
            const hasDiscount = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price);
            const inStock = product.stock > 0;

            if (viewMode === "grid") {
              return (
                <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden group hover:shadow-lg transition-shadow">
                  <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-gradient-to-br from-blue-500/10 to-indigo-600/10">
                    {product.thumbnail ? (
                      <Image src={product.thumbnail} alt={product.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="300px" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-sm text-muted-foreground font-medium line-clamp-2 px-4 text-center">{product.name}</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    {hasDiscount && (
                      <div className="absolute top-3 right-3">
                        <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          -{product.discountPercent}%
                        </span>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 h-8 w-8 bg-white/90 dark:bg-black/80 shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemove(product.id); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Link>
                  <div className="p-4 space-y-3">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{formatPrice(Number(product.price))}</span>
                      {hasDiscount && (
                        <span className="text-sm text-muted-foreground line-through">{formatPrice(Number(product.compareAtPrice!))}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={!inStock}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(product)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden group hover:shadow-lg transition-shadow p-4">
                  <div className="flex gap-4">
                    <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] w-32 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/10 to-indigo-600/10">
                      {product.thumbnail ? (
                        <Image src={product.thumbnail} alt={product.name} fill className="object-cover" sizes="128px" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-xs text-muted-foreground font-medium line-clamp-2 px-2 text-center">{product.name}</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors pr-8">{product.name}</h3>
                        </Link>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button variant="ghost" size="icon" onClick={() => handleShare(product)} className="h-7 w-7">
                            <Share2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleRemove(product.id)} className="h-7 w-7 text-red-500 hover:text-red-600">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{formatPrice(Number(product.price))}</span>
                        {hasDiscount && (
                          <span className="text-sm text-muted-foreground line-through">{formatPrice(Number(product.compareAtPrice!))}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={badge.color}>{badge.label}</Badge>
                        <span className="text-xs text-muted-foreground">{inStock ? "In Stock" : "Out of Stock"}</span>
                      </div>
                      <Button
                        className="w-full"
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={!inStock}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}

      <div className="pt-6 border-t border-border flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""} in wishlist</p>
        <Link href="/products">
          <Button variant="outline"><Heart className="h-4 w-4 mr-2" />Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}

function getConditionBadge(condition: string) {
  switch (condition) {
    case "new": return { label: "New", color: "bg-green-100 text-green-700" };
    case "refurbished": return { label: "Refurbished", color: "bg-yellow-100 text-yellow-700" };
    case "open_box": return { label: "Open Box", color: "bg-blue-100 text-blue-700" };
    case "used": return { label: "Used", color: "bg-gray-100 text-gray-700" };
    default: return { label: condition, color: "bg-muted text-muted-foreground" };
  }
}