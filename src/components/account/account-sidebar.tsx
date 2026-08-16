"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ShoppingBag, Heart, MapPin, LogOut, Settings, Shield, Bell, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutCustomer } from "@/actions/logout";

const navItems = [
  { href: "/account", label: "Profile", icon: User, exact: true },
  { href: "/account/orders", label: "Orders", icon: ShoppingBag },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/security", label: "Security", icon: Shield },
  { href: "/account/notifications", label: "Notifications", icon: Bell },
  { href: "/account/payments", label: "Payments", icon: CreditCard },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/30">
          <p className="text-sm font-semibold text-foreground">My Account</p>
        </div>
        <nav className="p-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-2">
          <button
            type="button"
            onClick={() => logoutCustomer()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4.5 w-4.5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}