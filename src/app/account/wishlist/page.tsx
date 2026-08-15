"use client";

import { useState, useEffect } from "react";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/actions/wishlist";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

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
  };
}

export default function AccountWishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem, setIsOpen } = useCart();

  useEffect(() => {
    const fetchWishlist = async () => {
      const result = await getWishlist();
      if (Array.isArray(result)) {
        setItems(result);
      }
      setLoading(false);
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    const result = await removeFromWishlist(productId);
    if (result.success) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      toast.success("Removed from wishlist");
    }
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
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 animate-pulse">
              <div className="h-48 bg-muted rounded-lg mb-4" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Wishlist</h1>
        <p className="text-sm text-muted-foreground mt-1">Your saved items</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <Heart className="h-12 w-12 text-muted-foreground/50 mx-auto" />
          <p className="text-muted-foreground">Your wishlist is empty.</p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden group">
              <Link href={`/products/${item.product.slug}`} className="block relative aspect-square bg-gradient-to-br from-blue-500/10 to-indigo-600/10">
                {item.product.thumbnail ? (
                  <Image src={item.product.thumbnail} alt={item.product.name} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-sm text-muted-foreground font-medium line-clamp-2 px-4 text-center">{item.product.name}</span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 h-8 w-8 bg-white/90 dark:bg-black/80 shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                  onClick={() => handleRemove(item.productId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Link>
              <div className="p-4 space-y-3">
                <Link href={`/products/${item.product.slug}`}>
                  <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">{item.product.name}</h3>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">${item.product.price.toLocaleString()}</span>
                  {item.product.compareAtPrice && item.product.compareAtPrice > item.product.price && (
                    <span className="text-sm text-muted-foreground line-through">${item.product.compareAtPrice.toLocaleString()}</span>
                  )}
                </div>
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => handleAddToCart(item.product)}
                  disabled={item.product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {item.product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
