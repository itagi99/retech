"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ShoppingBag, Heart, MapPin, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/account", label: "Profile", icon: User, exact: true },
  { href: "/account/orders", label: "Orders", icon: ShoppingBag },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <p className="text-sm font-medium text-muted-foreground">My Account</p>
        </div>
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <form action="/actions/logout">
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </nav>
      </div>
    </aside>
  );
}
