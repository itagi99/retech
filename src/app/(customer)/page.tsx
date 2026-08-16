import Link from "next/link";
import { ArrowRight, Shield, Truck, RotateCcw, Star, Play, Heart, ShoppingCart, Package, Monitor, Laptop, Gamepad2, Briefcase, Headphones, Quote, Zap, Tag, TrendingUp, Timer, Percent, Search } from "lucide-react";
import ProductCard from "@/components/products/product-card";
import { getProducts } from "@/lib/products";
import { db } from "@/lib/db";
import { banners, categories as categoriesSchema, brands as brandsSchema } from "@drizzle/schema";
import { eq } from "drizzle-orm";

const categories = [
  { name: "Laptops", icon: Laptop, href: "/products?category=laptops", color: "bg-blue-500" },
  { name: "Gaming", icon: Gamepad2, href: "/products?category=gaming", color: "bg-purple-500" },
  { name: "Business", icon: Briefcase, href: "/products?category=business", color: "bg-green-500" },
  { name: "Desktops", icon: Monitor, href: "/products?category=desktops", color: "bg-orange-500" },
  { name: "Monitors", icon: Monitor, href: "/products?category=monitors", color: "bg-pink-500" },
  { name: "Accessories", icon: Headphones, href: "/products?category=accessories", color: "bg-indigo-500" },
  { name: "Tablets", icon: Package, href: "/products?category=tablets", color: "bg-teal-500" },
  { name: "Audio", icon: Headphones, href: "/products?category=audio", color: "bg-red-500" },
];

const flashSaleProducts = [
  { discount: "40%", endsIn: "2h 15m" },
  { discount: "35%", endsIn: "4h 30m" },
  { discount: "30%", endsIn: "6h 45m" },
];

const trustItems = [
  { icon: Shield, title: "Secure Payments", desc: "100% secure & encrypted" },
  { icon: RotateCcw, title: "7-Day Returns", desc: "Hassle-free returns" },
  { icon: Truck, title: "Free Delivery", desc: "On orders above ₹500" },
  { icon: Star, title: "Quality Guaranteed", desc: "Certified & tested" },
  { icon: Zap, title: "Instant Refund", desc: "Quick refund processing" },
  { icon: Tag, title: "Best Price", desc: "Price match guarantee" },
];

export default async function Home() {
  const allProducts = await getProducts();
  const featured = allProducts.filter((p) => p.isFeatured).slice(0, 8);
  const trending = allProducts.filter((p) => p.isTrending).slice(0, 10);
  const activeBanners = await db.select().from(banners).where(eq(banners.isActive, true)).orderBy(banners.sortOrder);
  const activeCategories = await db.select().from(categoriesSchema).where(eq(categoriesSchema.isActive, true)).orderBy(categoriesSchema.sortOrder).limit(12);
  const topBrands = await db.select().from(brandsSchema).orderBy(brandsSchema.name).limit(8);

  const flashSale = allProducts.filter((p) => p.discountPercent && p.discountPercent > 20).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Announcement Bar */}
      <div className="bg-primary text-primary-foreground py-1.5 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 whitespace-nowrap animate-marquee">
            {[
              "🎉 Mega Electronics Sale: Up to 50% off on Laptops & Gaming Gear!",
              "🚚 Free Delivery on orders above ₹500 | No minimum order!",
              "🔧 Certified Refurbished: 1-Year Warranty | 7-Day Easy Returns",
              "💳 No Cost EMI Available | Instant Discount on Bank Cards",
              "⭐ 4.9/5 Rating | 50,000+ Happy Customers Across India",
            ].flatMap((msg, i) => [msg, <span key={`sep-${i}`} className="mx-4">◆</span>])}
          </div>
        </div>
      </div>

      {/* Search Bar Strip */}
      <div className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-[30px] z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <Link href="/products" className="flex items-center gap-3 w-full max-w-2xl mx-auto sm:mx-0 p-2 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors">
            <Search className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Search for Laptops, Gaming, Accessories & more...</span>
          </Link>
        </div>
      </div>

      {/* Compact Hero + Quick Actions */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white py-12 lg:py-16">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
        <div className="absolute inset-0">
          <div className="hero-orb w-72 h-72 bg-purple-500/15 top-5 -left-15" />
          <div className="hero-orb w-60 h-60 bg-blue-500/15 bottom-5 right-5" style={{ animationDelay: "2s" }} />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm border border-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                Flash Sale Ends Soon — Up to 50% Off!
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
                Premium Tech.
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Smarter Prices.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-white/60 max-w-lg leading-relaxed">
                Certified refurbished & brand-new electronics with warranty. 50,000+ customers trust ReTech.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/products?condition=refurbished" className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-all hover:bg-white/90 hover:scale-[1.02]">
                  Refurbished <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/products?condition=new" className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold transition-all hover:bg-white/10 hover:border-white/30 backdrop-blur-sm">
                  New Arrivals
                </Link>
                <Link href="/products?category=gaming" className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold transition-all hover:bg-white/10 hover:border-white/30 backdrop-blur-sm">
                  Gaming
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="aspect-square max-w-sm mx-auto rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center animate-float">
                <Laptop className="h-24 w-24 text-white/30" />
              </div>
              <div className="absolute -bottom-4 -right-4 glass rounded-xl px-4 py-3 animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Star className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">4.9/5 Rating</p>
                    <p className="text-[11px] text-white/50">50,000+ Happy Customers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Timer */}
      <section className="py-4 border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Timer className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">Flash Sale Ends In</span>
              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-xs font-mono font-bold">02</span>
                <span className="text-primary font-mono">:</span>
                <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-xs font-mono font-bold">15</span>
                <span className="text-primary font-mono">:</span>
                <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-xs font-mono font-bold">00</span>
              </div>
            </div>
            <Link href="/products" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View All Deals <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Shop by Category</h2>
            <Link href="/products" className="text-sm font-medium text-primary hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-card hover:border-primary/20 hover:shadow-md transition-all">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cat.color} text-white group-hover:scale-110 transition-transform`}>
                  <cat.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-center leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale Products */}
      {flashSale.length > 0 && (
        <section className="py-6 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-bold">Flash Sale</h2>
                <Percent className="h-4 w-4 text-orange-500" />
              </div>
              <Link href="/products" className="text-sm font-medium text-primary hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {flashSale.map((product, i) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Featured Products</h2>
            <Link href="/products" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">View All <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </div>
      </section>

      {/* Brands Strip */}
      {topBrands.length > 0 && (
        <section className="py-6 border-y border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold mb-4">Top Brands</h2>
            <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
              {topBrands.map((brand) => (
                <Link key={brand.id} href={`/products?brand=${brand.slug}`} className="shrink-0 flex flex-col items-center gap-1.5 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="h-8 w-auto grayscale hover:grayscale-0 transition-all" />
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">{brand.name}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose ReTech - Compact */}
      <section className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-center mb-6">Why Choose ReTech?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {trustItems.map((item) => (
              <div key={item.title} className="p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors text-center">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-[11px] text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-6 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Trending Now</h2>
            </div>
            <Link href="/products" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">View All <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {trending.map((product) => (
              <div key={product.id} className="min-w-[160px] max-w-[160px] shrink-0">
                <ProductCard product={product} compact />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deal of the Day */}
      {activeBanners.length > 0 && (
        <section className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-3 md:grid-cols-3">
              {activeBanners.slice(0, 3).map((banner) => (
                <Link key={banner.id} href={banner.link || "/products"} className="group relative overflow-hidden rounded-xl h-36 md:h-44">
                  <img src={banner.image} alt={banner.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <h3 className="text-lg font-bold text-white">{banner.title}</h3>
                    {banner.subtitle && <p className="text-sm text-white/80">{banner.subtitle}</p>}
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-white self-start">Shop Now <ArrowRight className="h-3.5 w-3.5" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Showcase */}
      <section className="py-6 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-center mb-6">Watch & Explore</h2>
          <div className="relative aspect-video max-w-3xl mx-auto rounded-xl overflow-hidden bg-muted/50 border border-border">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer">
                  <Play className="h-8 w-8 ml-1" />
                </div>
                <p className="text-sm text-muted-foreground">Product Showcase & Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-center mb-6">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Sarah J.", rating: 5, date: "2 days ago", comment: "Amazing quality refurbished MacBook. Looks brand new. Saved ₹60,000!", avatar: "SJ" },
              { name: "Michael C.", rating: 5, date: "1 week ago", comment: "Fast delivery, excellent packaging. Gaming laptop performs flawlessly.", avatar: "MC" },
              { name: "Emily R.", rating: 4, date: "2 weeks ago", comment: "Great value for money. Business laptop perfect for work from home.", avatar: "ER" },
            ].map((review) => (
              <div key={review.name} className="p-4 rounded-xl border border-border bg-card">
                <Quote className="h-6 w-6 text-primary/20 mb-2" />
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{review.comment}</p>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">{review.avatar}</div>
                  <div>
                    <p className="text-sm font-medium">{review.name}</p>
                    <p className="text-[11px] text-muted-foreground">{review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-6 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center space-y-3">
            <h2 className="text-xl font-bold">Stay Updated</h2>
            <p className="text-sm text-muted-foreground">Get latest deals & product updates in your inbox</p>
            <form className="flex gap-2 mt-4">
              <input type="email" placeholder="Enter email" className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              <button type="button" className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">Subscribe</button>
            </form>
            <p className="text-[11px] text-muted-foreground">No spam, unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
            <div>
              <h3 className="font-bold mb-3">ReTech</h3>
              <p className="text-sm text-muted-foreground">Premium refurbished & new electronics. Tech That Works. Value That Lasts.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Shop</h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li><Link href="/products?condition=refurbished" className="hover:text-foreground transition-colors">Refurbished</Link></li>
                <li><Link href="/products?condition=new" className="hover:text-foreground transition-colors">New</Link></li>
                <li><Link href="/products?category=gaming" className="hover:text-foreground transition-colors">Gaming</Link></li>
                <li><Link href="/products?category=desktops" className="hover:text-foreground transition-colors">Desktops</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li><Link href="/account" className="hover:text-foreground transition-colors">My Account</Link></li>
                <li><Link href="/cart" className="hover:text-foreground transition-colors">Cart</Link></li>
                <li><Link href="/checkout" className="hover:text-foreground transition-colors">Checkout</Link></li>
                <li><Link href="/refurbished" className="hover:text-foreground transition-colors">Our Process</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Connect</h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">YouTube</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-border text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ReTech. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}