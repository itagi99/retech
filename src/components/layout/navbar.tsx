"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Heart, User, Search, Menu, X } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/products", label: "Shop" },
    { href: "/products?condition=refurbished", label: "Refurbished" },
    { href: "/products?condition=new", label: "New" },
    { href: "/products?category=gaming", label: "Gaming" },
    { href: "/products?category=business", label: "Business" },
    { href: "/products?category=desktops", label: "Desktops" },
    { href: "/products?category=accessories", label: "Accessories" },
  ];

  const isActive = (href: string) => {
    if (href === "/products") return pathname === "/products";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight">
              ReTech
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105",
                    isActive(link.href) ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className={cn(
                "p-2 hover:bg-muted rounded-lg transition-all duration-300 hover:scale-110",
                pathname === "/products" ? "text-primary" : ""
              )}
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link
              href="/account/wishlist"
              className={cn(
                "p-2 hover:bg-muted rounded-lg transition-all duration-300 hover:scale-110",
                pathname.startsWith("/account/wishlist") ? "text-primary" : ""
              )}
            >
              <Heart className="h-5 w-5" />
            </Link>
            <Link
              href="/account"
              className={cn(
                "p-2 hover:bg-muted rounded-lg transition-all duration-300 hover:scale-110",
                pathname.startsWith("/account") ? "text-primary" : ""
              )}
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              href="/cart"
              className={cn(
                "relative p-2 hover:bg-muted rounded-lg transition-all duration-300 hover:scale-110",
                pathname === "/cart" ? "text-primary" : ""
              )}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive(link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}