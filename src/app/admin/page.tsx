import { Package, ShoppingCart, Users, FolderTree, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts, getCategories } from "@/actions/admin/products";
import { getOrders, getCustomers } from "@/actions/admin/orders";

async function DashboardStats() {
  const [productsRes, ordersRes, customersRes, categoriesRes] = await Promise.all([
    getProducts({ limit: 1, page: 1 }),
    getOrders({ limit: 1, page: 1 }),
    getCustomers({ limit: 1, page: 1 }),
    getCategories(),
  ]);

  const stats = [
    { title: "Total Products", value: productsRes.total.toString(), icon: Package, href: "/admin/products" },
    { title: "Total Orders", value: ordersRes.total.toString(), icon: ShoppingCart, href: "/admin/orders" },
    { title: "Total Customers", value: customersRes.total.toString(), icon: Users, href: "/admin/customers" },
    { title: "Categories", value: categoriesRes.length.toString(), icon: FolderTree, href: "/admin/categories" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <a key={stat.title} href={stat.href} className="block">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                View details
              </p>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your store performance</p>
      </div>
      <DashboardStats />
    </div>
  );
}
