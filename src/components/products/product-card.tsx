"use client";

import { useState, useRef, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Eye, Star, Play, Shield, Package } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import type { Product } from "@/lib/products";
import { getConditionBadge } from "@/lib/products";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={12}
            className={cn(
              i < fullStars
                ? "fill-yellow-400 text-yellow-400"
                : i === fullStars && hasHalf
                  ? "fill-yellow-400/50 text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground font-medium">{rating.toFixed(1)}</span>
      <span className="text-xs text-muted-foreground">({reviewCount})</span>
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { addItem, setIsOpen } = useCart();

  const badge = getConditionBadge(product.condition);
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const inStock = product.stock > 0;

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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

  const handleQuickView = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const gradientIndex = parseInt(product.id, 10) % 12;

  return (
    <motion.div
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowVideo(false);
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        {showVideo && product.videoUrl ? (
          <video
            ref={videoRef}
            src={product.videoUrl}
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center bg-gradient-to-br",
              `bg-gradient-to-br ${[
                "from-blue-500/20 to-indigo-600/20",
                "from-purple-500/20 to-pink-600/20",
                "from-green-500/20 to-teal-600/20",
                "from-orange-500/20 to-red-600/20",
                "from-cyan-500/20 to-blue-600/20",
                "from-pink-500/20 to-rose-600/20",
                "from-amber-500/20 to-orange-600/20",
                "from-emerald-500/20 to-cyan-600/20",
                "from-violet-500/20 to-purple-600/20",
                "from-red-500/20 to-pink-600/20",
                "from-indigo-500/20 to-blue-600/20",
                "from-teal-500/20 to-green-600/20",
              ][gradientIndex]}`
            )}
          >
            <div className="text-center p-4">
              <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-xs text-muted-foreground/70 font-medium truncate max-w-[80%] mx-auto">
                {product.name}
              </p>
            </div>
          </div>
        )}

        {/* Condition Badge */}
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            badge.color
          )}
        >
          {badge.label}
        </span>

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
            -{product.discountPercent}%
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className={cn(
            "absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 dark:bg-black/80 shadow-sm backdrop-blur-sm transition-all hover:scale-110",
            isWishlisted && "text-red-500"
          )}
        >
          <Heart
            size={14}
            className={cn(isWishlisted && "fill-current")}
          />
        </button>

        {/* Video Play Button */}
        {product.videoUrl && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowVideo(!showVideo);
            }}
            className="absolute left-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white shadow-sm backdrop-blur-sm transition-all hover:scale-110"
          >
            {showVideo ? (
              <span className="text-xs font-bold">STOP</span>
            ) : (
              <Play size={12} fill="white" />
            )}
          </button>
        )}

        {/* Quick Actions Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8"
            >
              <button
                onClick={handleQuickView}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/20 py-2 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                <Eye size={14} />
                Quick View
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium text-white transition-colors",
                  inStock
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-gray-500/50 cursor-not-allowed"
                )}
              >
                <ShoppingCart size={14} />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">{product.brand}</span>
          {!inStock && (
            <span className="text-xs font-medium text-red-500">Out of Stock</span>
          )}
        </div>

        <h3 className="mb-1 line-clamp-2 text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <StarRating rating={product.rating} reviewCount={product.reviewCount} />

        <div className="mt-auto pt-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              ${product.price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.compareAtPrice!.toLocaleString()}
              </span>
            )}
          </div>

          <div className="mt-1.5 flex items-center gap-2">
            {product.warranty && (
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                <Shield size={10} />
                {product.warranty}
              </span>
            )}
            {inStock && (
              <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-600 dark:bg-green-900/20 dark:text-green-400">
                <Package size={10} />
                In Stock
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
