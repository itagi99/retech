import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-session";
import AccountSidebar from "@/components/account/account-sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/lib/db";
import { orders } from "@drizzle/schema";
import { eq, count } from "drizzle-orm";
import { User, ShoppingBag, Heart, MapPin, Settings, Shield, Bell, CreditCard, LogOut, Truck, Package, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPriceFixed } from "@/lib/utils";
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

async function getUserStats(userId: string) {
  const [orderCount] = await db.select({ count: count() }).from(orders).where(eq(orders.userId, userId));
  return {
    orderCount: orderCount?.count || 0,
  };
}

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getCustomerSession();
  if (!session) {
    redirect("/login");
  }

  const stats = await getUserStats(session.userId);
  const initials = session.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* User Header */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                {initials}
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{session.name}</h1>
                <p className="text-sm text-muted-foreground">{session.email}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Active Member
                  </span>
                  <span>Joined {new Date().getFullYear()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:ml-auto">
              <Link href="/account/security" className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
                <Shield className="h-4 w-4 mr-2 inline" /> Security
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border">
            <Link href="/account/orders" className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-center">
              <ShoppingBag className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
              <p className="text-2xl font-bold text-foreground">{stats.orderCount}</p>
              <p className="text-xs text-muted-foreground">Orders</p>
            </Link>
            <Link href="/account/wishlist" className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-center">
              <Heart className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground">Saved</p>
            </Link>
            <Link href="/account/addresses" className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-center">
              <MapPin className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground">Addresses</p>
            </Link>
            <Link href="/account/payments" className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-center">
              <CreditCard className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground">Cards</p>
            </Link>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-6">
          <AccountSidebar />
          <main className="flex-1 min-w-0 lg:max-w-3xl">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}