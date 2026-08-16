"use client";

import { useState } from "react";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Zap,
  Truck,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProductGallery from "@/components/products/product-gallery";
import SpecsAccordion from "@/components/products/specs-accordion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  condition: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  condition: "New" | "Refurbished" | "Open Box" | "Used";
  grade?: string;
  batteryHealth?: number;
  cosmeticCondition?: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
  warranty: string;
  description: string;
  images: string[];
  videoUrl?: string;
  model3DUrl?: string;
  specifications: Record<string, string>;
  includedItems: string[];
  deliveryInfo: string;
  returnPolicy: string;
  reviews: Review[];
  relatedProducts: RelatedProduct[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_PRODUCTS: Record<string, Product> = {
  "macbook-pro-16-m3-max": {
    id: "1",
    name: "MacBook Pro 16\" M3 Max",
    slug: "macbook-pro-16-m3-max",
    brand: "Apple",
    brandSlug: "apple",
    category: "Laptops",
    categorySlug: "laptops",
    condition: "Refurbished",
    grade: "Grade A",
    batteryHealth: 96,
    cosmeticCondition: "Excellent - No visible scratches",
    price: 2199,
    originalPrice: 2999,
    discount: 27,
    rating: 4.8,
    reviewCount: 124,
    stockStatus: "In Stock",
    warranty: "1 Year Apple Certified Refurbished Warranty",
    description:
      "The MacBook Pro 16-inch with M3 Max chip delivers unprecedented performance for professional workflows. Featuring a stunning Liquid Retina XDR display, up to 128GB of unified memory, and up to 8TB of storage, it's the most powerful MacBook Pro ever.",
    images: [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    ],
    videoUrl: undefined,
    model3DUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    specifications: {
      Processor: "Apple M3 Max (16-core CPU, 40-core GPU)",
      RAM: "36GB Unified Memory",
      Storage: "1TB SSD",
      GPU: "40-core GPU",
      Screen: "16.2\" Liquid Retina XDR (3456 x 2234)",
      OS: "macOS Sonoma",
      Weight: "2.14 kg",
      Battery: "Up to 22 hours",
      Ports: "3x Thunderbolt 4, HDMI, SDXC, MagSafe 3",
      Keyboard: "Magic Keyboard with Touch ID",
    },
    includedItems: [
      "MacBook Pro 16\"",
      "140W USB-C Power Adapter",
      "USB-C Charge Cable (2m)",
      "Documentation",
    ],
    deliveryInfo: "Free next-day delivery on orders placed before 2PM. Standard delivery 3-5 business days.",
    returnPolicy:
      "30-day hassle-free returns. If you're not satisfied, return it within 30 days for a full refund. Refurbished products are covered by our 1-year warranty.",
    reviews: [
      {
        id: "r1",
        name: "Sarah Johnson",
        avatar: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        rating: 5,
        date: "2024-12-15",
        comment:
          "Absolutely incredible machine. The performance is unreal for video editing and 3D work. Battery life is fantastic and the display is stunning. Worth every penny!",
        verified: true,
      },
      {
        id: "r2",
        name: "Michael Chen",
        avatar: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        rating: 4,
        date: "2024-12-10",
        comment:
          "Great laptop, runs everything I throw at it. The refurbished condition is indistinguishable from new. Only wish it was a bit lighter for travel.",
        verified: true,
      },
      {
        id: "r3",
        name: "Emily Rodriguez",
        avatar: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        rating: 5,
        date: "2024-11-28",
        comment:
          "Best laptop I've ever owned. The M3 Max chip is a beast for development work. Multiple monitors, Docker containers, IDMs - it handles it all without breaking a sweat.",
        verified: true,
      },
    ],
    relatedProducts: [
      {
        id: "2",
        name: "MacBook Pro 14\" M3 Pro",
        slug: "macbook-pro-14-m3-pro",
        price: 1799,
        originalPrice: 2199,
        image: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        rating: 4.7,
        reviewCount: 89,
        condition: "New",
      },
      {
        id: "3",
        name: "Dell XPS 15",
        slug: "dell-xps-15",
        price: 1299,
        originalPrice: 1599,
        image: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
        rating: 4.5,
        reviewCount: 156,
        condition: "Refurbished",
      },
      {
        id: "4",
        name: "ThinkPad X1 Carbon Gen 11",
        slug: "thinkpad-x1-carbon",
        price: 1099,
        originalPrice: 1399,
        image: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
        rating: 4.6,
        reviewCount: 203,
        condition: "Open Box",
      },
      {
        id: "5",
        name: "HP Spectre x360 16",
        slug: "hp-spectre-x360-16",
        price: 1449,
        originalPrice: 1799,
        image: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
        rating: 4.4,
        reviewCount: 67,
        condition: "Used",
      },
    ],
  },
  "macbook-pro-14-m3-pro": {
    id: "2",
    name: "MacBook Pro 14\" M3 Pro",
    slug: "macbook-pro-14-m3-pro",
    brand: "Apple",
    brandSlug: "apple",
    category: "Laptops",
    categorySlug: "laptops",
    condition: "New",
    price: 1799,
    originalPrice: 2199,
    discount: 18,
    rating: 4.7,
    reviewCount: 89,
    stockStatus: "In Stock",
    warranty: "1 Year Apple Warranty",
    description: "Powerful and portable MacBook Pro with M3 Pro chip.",
    images: [
      "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    ],
    specifications: {
      Processor: "Apple M3 Pro (12-core CPU, 18-core GPU)",
      RAM: "18GB Unified Memory",
      Storage: "512GB SSD",
      Screen: "14.2\" Liquid Retina XDR",
      OS: "macOS Sonoma",
      Weight: "1.61 kg",
    },
    includedItems: ["MacBook Pro 14\"", "70W USB-C Power Adapter", "USB-C Cable", "Documentation"],
    deliveryInfo: "Free next-day delivery on orders placed before 2PM.",
    returnPolicy: "30-day hassle-free returns.",
    reviews: [],
    relatedProducts: [],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getConditionColor(condition: string) {
  switch (condition) {
    case "New":
      return "bg-success/10 text-success";
    case "Refurbished":
      return "bg-warning/10 text-warning";
    case "Open Box":
      return "bg-blue-500/10 text-blue-500";
    case "Used":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

function getStockColor(status: string) {
  switch (status) {
    case "In Stock":
      return "text-success";
    case "Low Stock":
      return "text-warning";
    case "Out of Stock":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
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

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-xl border border-border p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-full bg-cover bg-center"
            style={{ backgroundImage: `url(${review.avatar})` }}
          />
          <div>
            <p className="font-medium">{review.name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(review.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        {review.verified && (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Verified
          </Badge>
        )}
      </div>
      <div className="mt-3">
        <Stars rating={review.rating} size={16} />
      </div>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        {review.comment}
      </p>
    </div>
  );
}

function RelatedProductCard({ product }: { product: RelatedProduct }) {
  return (
    <a
      href={`/products/${product.slug}`}
      className="group rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div
        className="aspect-square w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${product.image})` }}
      />
      <div className="p-4">
        <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Stars rating={product.rating} size={14} />
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
          <Badge
            variant="outline"
            className={`ml-auto text-xs ${getConditionColor(product.condition)}`}
          >
            {product.condition}
          </Badge>
        </div>
      </div>
    </a>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const product = MOCK_PRODUCTS[slug] || MOCK_PRODUCTS["macbook-pro-16-m3-max"];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      slug: product.slug,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // In a real app, navigate to checkout
    alert("Proceeding to checkout...");
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
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <a
            href={`/category/${product.categorySlug}`}
            className="hover:text-foreground transition-colors"
          >
            {product.category}
          </a>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Column - Media Gallery */}
          <ProductGallery
            images={product.images}
            videoUrl={product.videoUrl}
            model3DUrl={product.model3DUrl}
          />

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <a
                  href={`/brand/${product.brandSlug}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {product.brand}
                </a>
              </div>
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                {product.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={getConditionColor(product.condition)}
                >
                  {product.condition}
                </Badge>
                {product.condition === "Refurbished" && product.grade && (
                  <Badge variant="secondary">Grade: {product.grade}</Badge>
                )}
              </div>
              {product.condition === "Refurbished" && (
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
              <span className="text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <Badge variant="destructive">
                  Save {product.discount}%
                </Badge>
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  product.stockStatus === "In Stock"
                    ? "bg-success"
                    : product.stockStatus === "Low Stock"
                    ? "bg-warning"
                    : "bg-destructive"
                }`}
              />
              <span className={`text-sm font-medium ${getStockColor(product.stockStatus)}`}>
                {product.stockStatus}
              </span>
            </div>

            {/* Warranty */}
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm">
                <span className="font-medium">Warranty: </span>
                <span className="text-muted-foreground">{product.warranty}</span>
              </p>
            </div>

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
              <Button
                size="lg"
                className="flex-1 gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="flex-1"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setWishlisted(!wishlisted)}
                className={wishlisted ? "text-destructive" : ""}
              >
                <Heart
                  className="h-5 w-5"
                  fill={wishlisted ? "currentColor" : "none"}
                />
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
                <span>{product.deliveryInfo}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
                <span>{product.returnPolicy}</span>
              </div>
            </div>

            <Separator />

            {/* What's Included */}
            <div>
              <h3 className="font-semibold mb-3">What&apos;s Included</h3>
              <ul className="space-y-2">
                {product.includedItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <SpecsAccordion specifications={product.specifications} />

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {product.relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {product.relatedProducts.map((rp) => (
                <RelatedProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        {product.reviews.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold">Reviews</h2>
              <div className="flex items-center gap-2">
                <Stars rating={product.rating} />
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {product.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
