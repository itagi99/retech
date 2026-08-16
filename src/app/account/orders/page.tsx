import Link from "next/link";
import { getUserOrders } from "@/actions/orders";
import AccountSidebar from "@/components/account/account-sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPriceFixed } from "@/lib/utils";

const statusColors: Record<string, "default" | "success" | "warning" | "destructive"> = {
  pending: "warning",
  confirmed: "default",
  processing: "default",
  shipped: "default",
  delivered: "success",
  cancelled: "destructive",
  refunded: "destructive",
};

export default async function AccountOrdersPage() {
  const orders = await getUserOrders();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">View and track your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <p className="text-muted-foreground">You haven't placed any orders yet.</p>
          <Link href="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`} className="block">
              <div className="rounded-xl border border-border bg-card p-4 sm:p-6 hover:border-primary/20 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <p className="font-mono text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusColors[order.status] || "default"} className="capitalize">
                      {order.status}
                    </Badge>
                    <span className="font-semibold text-sm sm:text-base">{formatPriceFixed(Number(order.total))}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
