import Link from "next/link";
import { ArrowRight, Shield, Truck, RotateCcw, Star, Play, Heart, ShoppingCart, Package, Monitor, Laptop, Gamepad2, Briefcase, Headphones, Quote } from "lucide-react";
import ProductCard from "@/components/products/product-card";
import { getProducts } from "@/lib/products";

const categories = [
  { name: "Laptops", icon: Laptop, href: "/products?category=laptops" },
  { name: "Gaming", icon: Gamepad2, href: "/products?category=gaming" },
  { name: "Business", icon: Briefcase, href: "/products?category=business" },
  { name: "Desktops", icon: Monitor, href: "/products?category=desktops" },
  { name: "Monitors", icon: Monitor, href: "/products?category=monitors" },
  { name: "Accessories", icon: Headphones, href: "/products?category=accessories" },
];

const features = [
  { icon: Shield, title: "Quality Tested", desc: "Every device undergoes rigorous testing" },
  { icon: RotateCcw, title: "Warranty", desc: "Comprehensive warranty on all products" },
  { icon: BatteryHealthIcon, title: "Battery Health", desc: "Battery health checked and reported" },
  { icon: Package, title: "Secure Packaging", desc: "Safe delivery with premium packaging" },
  { icon: Star, title: "Affordable Pricing", desc: "Best prices without compromising quality" },
];

function BatteryHealthIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="7" width="18" height="10" rx="2" strokeWidth="2" />
      <path d="M22 11v2" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 11v2" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 11v2" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const reviews = [
  { name: "Sarah Johnson", rating: 5, date: "2 days ago", comment: "Amazing quality refurbished laptop. Looks and feels brand new. Saved over $800!", avatar: "SJ" },
  { name: "Michael Chen", rating: 5, date: "1 week ago", comment: "Fast shipping and excellent customer service. The MacBook Pro arrived in perfect condition.", avatar: "MC" },
  { name: "Emily Rodriguez", rating: 4, date: "2 weeks ago", comment: "Great value for money. The gaming laptop performs exceptionally well for the price.", avatar: "ER" },
];

export default async function Home() {
  const allProducts = await getProducts();
  const featured = allProducts.filter((p) => p.isFeatured).slice(0, 4);
  const trending = allProducts.filter((p) => p.isTrending).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold">
                ReTech
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">Shop</Link>
                <Link href="/products?condition=refurbished" className="text-sm font-medium hover:text-primary transition-colors">Refurbished</Link>
                <Link href="/products?condition=new" className="text-sm font-medium hover:text-primary transition-colors">New</Link>
                <Link href="/products?category=gaming" className="text-sm font-medium hover:text-primary transition-colors">Gaming</Link>
                <Link href="/products?category=business" className="text-sm font-medium hover:text-primary transition-colors">Business</Link>
                <Link href="/products?category=desktops" className="text-sm font-medium hover:text-primary transition-colors">Desktops</Link>
                <Link href="/products?category=accessories" className="text-sm font-medium hover:text-primary transition-colors">Accessories</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="7" r="4" strokeWidth="2" />
                </svg>
              </button>
              <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">0</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-foreground to-foreground/90 text-background">
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:60px_60px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Premium Tech.
                <br />
                Smarter Prices.
              </h1>
              <p className="text-lg sm:text-xl text-white/70 max-w-lg">
                Discover certified refurbished and brand-new electronics with warranty. Tech That Works. Value That Lasts.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products?condition=refurbished" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/90">
                  Shop Refurbished <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/products?condition=new" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/10">
                  Shop New
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <Laptop className="h-32 w-32 text-white/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-border bg-card hover:border-primary/20 hover:shadow-lg transition-all">
                <cat.icon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link href="/products" className="inline-flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why ReTech */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why ReTech?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mx-auto">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refurbished vs New */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Refurbished vs New</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl border border-border bg-card">
              <h3 className="text-xl font-bold mb-4">Refurbished</h3>
              <ul className="space-y-3">
                {["Certified tested devices", "Up to 40% savings", "Full warranty included", "Like-new performance", "Eco-friendly choice"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-green-500" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/refurbished" className="mt-6 inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                Explore Refurbished <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="p-8 rounded-2xl border border-border bg-card">
              <h3 className="text-xl font-bold mb-4">Brand New</h3>
              <ul className="space-y-3">
                {["Latest models available", "Full manufacturer warranty", "Zero wear and tear", "Latest technology", "Complete accessories"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-blue-500" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/new" className="mt-6 inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                Shop New <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Trending Now</h2>
            <Link href="/products" className="inline-flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {trending.map((product) => (
              <div key={product.id} className="min-w-[280px] max-w-[280px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Showcase */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Watch & Explore</h2>
          <div className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden bg-foreground/5 border border-border">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer">
                  <Play className="h-8 w-8 ml-1" />
                </div>
                <p className="text-sm text-muted-foreground">Watch our product showcase</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.name} className="p-6 rounded-2xl border border-border bg-card">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">{review.comment}</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Secure Payments" },
              { icon: RotateCcw, title: "Easy Returns" },
              { icon: Truck, title: "Fast Delivery" },
              { icon: Star, title: "Quality Guaranteed" },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center gap-3 text-center">
                <item.icon className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="text-3xl font-bold">Stay Updated</h2>
            <p className="text-muted-foreground">Get the latest deals and product updates delivered to your inbox.</p>
            <form className="flex gap-3 mt-6">
              <input type="email" placeholder="Enter your email" className="flex-1 h-12 px-4 rounded-lg border border-border bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              <button type="button" className="h-12 px-6 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </form>
            <p className="text-xs text-muted-foreground">No spam, unsubscribe at any time.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">ReTech</h3>
              <p className="text-sm text-muted-foreground">Premium refurbished and new electronics. Tech That Works. Value That Lasts.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/products?condition=refurbished" className="hover:text-foreground transition-colors">Refurbished</Link></li>
                <li><Link href="/products?condition=new" className="hover:text-foreground transition-colors">New</Link></li>
                <li><Link href="/products?category=gaming" className="hover:text-foreground transition-colors">Gaming</Link></li>
                <li><Link href="/products?category=desktops" className="hover:text-foreground transition-colors">Desktops</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/account" className="hover:text-foreground transition-colors">Account</Link></li>
                <li><Link href="/cart" className="hover:text-foreground transition-colors">Cart</Link></li>
                <li><Link href="/checkout" className="hover:text-foreground transition-colors">Checkout</Link></li>
                <li><Link href="/refurbished" className="hover:text-foreground transition-colors">Our Process</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">YouTube</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ReTech. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}