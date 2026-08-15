export const dynamic = 'force-dynamic';

import { getOrder } from "@/actions/orders";
import AccountSidebar from "@/components/account/account-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

const statusColors: Record<string, "default" | "success" | "warning" | "destructive"> = {
  pending: "warning",
  confirmed: "default",
  processing: "default",
  shipped: "default",
  delivered: "success",
  cancelled: "destructive",
  refunded: "destructive",
};

const timelineSteps = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  const currentStatusIndex = timelineSteps.indexOf(order.status);
  const shippingAddress = order.shippingAddress as Record<string, string>;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Badge variant={statusColors[order.status] || "default"} className="capitalize text-sm">
          {order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-600/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-xs text-muted-foreground">IMG</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm">${Number(item.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Status Timeline</h2>
            <div className="flex items-center gap-2">
              {timelineSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-2 flex-1">
                  <div className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full border-2 text-xs font-semibold shrink-0",
                    index <= currentStatusIndex ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"
                  )}>
                    {index + 1}
                  </div>
                  <span className={cn("text-xs capitalize hidden sm:block", index <= currentStatusIndex ? "text-foreground font-medium" : "text-muted-foreground")}>
                    {step}
                  </span>
                  {index < timelineSteps.length - 1 && <div className="h-[2px] flex-1 bg-border" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold">Shipping Address</h2>
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">{shippingAddress.name}</p>
              <p>{shippingAddress.address1}</p>
              {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</p>
              <p>{shippingAddress.country}</p>
              <p>{shippingAddress.email}</p>
              <p>{shippingAddress.phone}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${Number(order.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium">${Number(order.discount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">${Number(order.shipping).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">${Number(order.tax).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>${Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {order.trackingNumber && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-2">Tracking</h2>
              <p className="text-sm font-mono bg-muted px-3 py-2 rounded-lg">{order.trackingNumber}</p>
            </div>
          )}

          <Link href="/account/orders">
            <Button variant="outline" className="w-full">Back to Orders</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
