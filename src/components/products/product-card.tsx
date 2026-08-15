"use client";

import { useState } from "react";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import type { Product } from "@/lib/products";
import { getConditionBadge } from "@/lib/products";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem, setIsOpen } = useCart();

  const badge = getConditionBadge(product.condition);
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.thumbnail || "/placeholder-product.svg",
      quantity: 1,
      slug: product.slug,
    });
    setIsOpen(true);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-xs text-muted-foreground/70 font-medium truncate max-w-[80%] mx-auto">
            {product.name}
          </span>
        </div>

        <span className={cn("absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", badge.color)}>
          {badge.label}
        </span>

        {hasDiscount && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
            -{product.discountPercent}%
          </span>
        )}

        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={cn("absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-all hover:scale-110", isWishlisted && "text-red-500")}
        >
          <Heart size={14} className={cn(isWishlisted && "fill-current")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-muted-foreground mb-1">{product.brand}</p>
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-2">
          {product.rating.toFixed(1)} ({product.reviewCount})
        </p>
        <div className="mt-auto flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">${product.price.toLocaleString()}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">${product.compareAtPrice!.toLocaleString()}</span>
          )}
        </div>
        <div className="mt-2 flex gap-2">
          <button onClick={handleAddToCart} disabled={!inStock} className={cn("flex-1 rounded-lg py-2 text-xs font-medium text-white transition-colors", inStock ? "bg-primary hover:bg-primary/90" : "bg-gray-500/50 cursor-not-allowed")}>
            <ShoppingCart size={14} className="inline mr-1" />
            {inStock ? "Add to Cart" : "Out of Stock"}
          </button>
          <button className="rounded-lg border border-border px-3 py-2 text-xs hover:bg-muted transition-colors">
            <Eye size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
