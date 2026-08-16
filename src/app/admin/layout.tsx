import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, FolderTree, Image, LogOut, Menu, X } from "lucide-react";
import { verifySession } from "@/lib/auth";

const ADMIN_COOKIE = "retech-admin-session";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/banners", label: "Banners", icon: Image },
];

async function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!token) {
    redirect("/admin-login");
  }

  const session = await verifySession(token);
  if (!session) {
    redirect("/admin-login");
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card transform -translate-x-full md:translate-x-0 transition-transform duration-200 ease-in-out" id="sidebar">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link href="/admin" className="text-xl font-bold tracking-tight">
              ReTech Admin
            </Link>
            <button className="md:hidden p-1 hover:bg-muted rounded-lg transition-colors" id="close-sidebar">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted text-foreground/70 hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session.name}</p>
                <p className="text-xs text-muted-foreground truncate">{session.email}</p>
              </div>
            </div>
            <form action={async () => {
              "use server";
              await fetch("/api/auth/logout", { method: "POST" });
            }}>
              <button
                type="submit"
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-destructive/10 text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors" id="open-sidebar">
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold hidden sm:block">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline-block">{session.email}</span>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                {session.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <div className="fixed inset-0 bg-black/50 z-40 hidden" id="overlay"></div>

      <script dangerouslySetInnerHTML={{ __html: `(function(){var s=document.getElementById('sidebar');var o=document.getElementById('overlay');var open=document.getElementById('open-sidebar');var close=document.getElementById('close-sidebar');function show(){s.classList.remove('-translate-x-full');o.classList.remove('hidden');}function hide(){s.classList.add('-translate-x-full');o.classList.add('hidden');}open.addEventListener('click',show);close.addEventListener('click',hide);o.addEventListener('click',hide);})()` }} />
    </div>
  );
}

export default AdminLayoutContent;
