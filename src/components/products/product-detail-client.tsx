"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Zap,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SpecsAccordion from "@/components/products/specs-accordion";
import { formatPrice } from "@/lib/utils";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  condition: string;
  grade: string | null;
  batteryHealth: number | null;
  cosmeticCondition: string | null;
  price: number;
  compareAtPrice: number | null;
  discountPercent: number;
  stock: number;
  rating: number;
  reviewCount: number;
  warranty: string | null;
  thumbnail: string | null;
  videoUrl: string | null;
  model3DUrl: string | null;
  specifications: Record<string, string> | null;
  categoryName: string;
  brandName: string;
  images: string[];
  createdAt: string;
}

function getConditionColor(condition: string) {
  switch (condition) {
    case "new":
      return "bg-success/10 text-success";
    case "refurbished":
      return "bg-warning/10 text-warning";
    case "open_box":
      return "bg-blue-500/10 text-blue-500";
    case "used":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

function getConditionLabel(condition: string) {
  switch (condition) {
    case "new": return "New";
    case "refurbished": return "Refurbished";
    case "open_box": return "Open Box";
    case "used": return "Used";
    default: return condition;
  }
}

function getStockStatus(stock: number): { label: string; color: string } {
  if (stock <= 0) return { label: "Out of Stock", color: "text-destructive" };
  if (stock <= 5) return { label: "Low Stock", color: "text-warning" };
  return { label: "In Stock", color: "text-success" };
}

function Stars({ rating, size = 20 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
              ? "fill-warning text-warning"
              : "text-muted-foreground"
          }
        />
      ))}
    </div>
  );
}

export default function ProductDetailClient({ product }: { product: ProductData }) {
  const { addItem } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const stockStatus = getStockStatus(product.stock);
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : product.discountPercent;

  const allImages = product.images.length > 0 ? product.images : [product.thumbnail || ""];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: allImages[0] || "",
      quantity,
      slug: product.slug,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/checkout";
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
          {product.categoryName && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">{product.categoryName}</span>
            </>
          )}
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Column - Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-2xl overflow-hidden border border-border bg-muted">
              {allImages[selectedImage] && allImages[selectedImage].startsWith("http") ? (
                <Image
                  src={allImages[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ShoppingCart className="h-16 w-16" />
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 ${
                      idx === selectedImage ? "border-primary" : "border-border hover:border-primary/50"
                    }`}
                  >
                    {img && img.startsWith("http") ? (
                      <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            <div>
              {product.brandName && (
                <p className="text-sm font-medium text-primary mb-1">{product.brandName}</p>
              )}
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">{product.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={getConditionColor(product.condition)}>
                  {getConditionLabel(product.condition)}
                </Badge>
                {product.condition === "refurbished" && product.grade && (
                  <Badge variant="secondary">Grade: {product.grade}</Badge>
                )}
              </div>
              {product.condition === "refurbished" && (
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {product.batteryHealth && (
                    <div className="flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-success" />
                      Battery Health: {product.batteryHealth}%
                    </div>
                  )}
                  {product.cosmeticCondition && (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      {product.cosmeticCondition}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <Stars rating={product.rating} />
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold">{formatPrice(product.price)}</span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                    {discount > 0 && <Badge variant="destructive">Save {discount}%</Badge>}
                  </>
                )}
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${stockStatus.color === "text-success" ? "bg-success" : stockStatus.color === "text-warning" ? "bg-warning" : "bg-destructive"}`} />
              <span className={`text-sm font-medium ${stockStatus.color}`}>{stockStatus.label}</span>
            </div>

            {/* Warranty */}
            {product.warranty && (
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm">
                  <span className="font-medium">Warranty: </span>
                  <span className="text-muted-foreground">{product.warranty}</span>
                </p>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center rounded-lg border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-muted transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-muted transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="flex-1 gap-2" onClick={handleAddToCart} disabled={product.stock <= 0}>
                <ShoppingCart className="h-5 w-5" />
                {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button size="lg" variant="secondary" className="flex-1" onClick={handleBuyNow} disabled={product.stock <= 0}>
                Buy Now
              </Button>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" size="icon" onClick={() => setWishlisted(!wishlisted)} className={wishlisted ? "text-destructive" : ""}>
                <Heart className="h-5 w-5" fill={wishlisted ? "currentColor" : "none"} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <Separator />

            {/* Delivery */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span>Free delivery on orders above {formatPrice(500)}. Standard delivery 3-5 business days.</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
                <span>7-day hassle-free returns for refurbished products. 30-day returns for new products.</span>
              </div>
            </div>

            <Separator />

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <SpecsAccordion specifications={product.specifications} />
            )}

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
