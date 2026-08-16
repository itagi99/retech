"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronUp, Truck, Package, MapPin, RotateCcw, CheckCircle2, Clock, XCircle, HelpCircle, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatPriceFixed } from "@/lib/utils";

const statusConfig: Record<string, { label: string; color: "default" | "success" | "warning" | "destructive"; icon: typeof Truck | typeof Package | typeof MapPin | typeof RotateCcw | typeof CheckCircle2 | typeof Clock | typeof XCircle | typeof HelpCircle; steps: string[] }> = {
  pending: { label: "Pending", color: "warning", icon: Clock, steps: ["pending", "confirmed", "processing", "shipped", "delivered"] },
  confirmed: { label: "Confirmed", color: "default", icon: CheckCircle2, steps: ["pending", "confirmed", "processing", "shipped", "delivered"] },
  processing: { label: "Processing", color: "default", icon: Package, steps: ["pending", "confirmed", "processing", "shipped", "delivered"] },
  shipped: { label: "Shipped", color: "default", icon: Truck, steps: ["pending", "confirmed", "processing", "shipped", "delivered"] },
  delivered: { label: "Delivered", color: "success", icon: CheckCircle2, steps: ["pending", "confirmed", "processing", "shipped", "delivered"] },
  cancelled: { label: "Cancelled", color: "destructive", icon: XCircle, steps: ["pending", "cancelled"] },
  refunded: { label: "Refunded", color: "destructive", icon: RotateCcw, steps: ["pending", "refunded"] },
};

const statusOrder = ["pending", "confirmed", "processing", "shipped", "delivered"];

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string | null;
  price: string;
  quantity: number;
  total: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  paymentId: string | null;
  subtotal: string;
  discount: string;
  shipping: string;
  tax: string;
  total: string;
  shippingAddress: Record<string, string>;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export default function AccountOrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filteredOrders = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const getConfig = (status: string) => statusConfig[status] || statusConfig.pending;

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(prev => prev === orderId ? null : orderId);
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
  });

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Orders</h1>
            <p className="text-sm text-muted-foreground mt-1">Track and manage your orders</p>
          </div>
        </div>
        <div className="text-center py-16 rounded-2xl border border-border bg-card">
          <Package className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
          <Link href="/products">
            <Button size="lg"><Truck className="h-4 w-4 mr-2" />Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage your orders</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-9 px-3 py-1 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Orders</option>
            <option value="delivered">Delivered</option>
            <option value="shipped">Shipped</option>
            <option value="processing">Processing</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const config = getConfig(order.status);
          const isExpanded = expandedOrder === order.id;
          const currentStepIndex = statusOrder.indexOf(order.status);
          const totalSteps = config.steps.length;

          return (
            <article key={order.id} className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/20 transition-colors">
              {/* Order Header */}
              <div className="p-4 sm:p-6 cursor-pointer" onClick={() => toggleExpand(order.id)}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${config.color === "success" ? "bg-green-100" : config.color === "warning" ? "bg-yellow-100" : config.color === "destructive" ? "bg-red-100" : "bg-muted"} flex-shrink-0`}>
                      <config.icon className={`h-6 w-6 ${config.color === "success" ? "text-green-600" : config.color === "warning" ? "text-yellow-600" : config.color === "destructive" ? "text-red-600" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-mono text-sm font-medium text-foreground">{order.orderNumber}</p>
                        <Badge variant={config.color} className="capitalize">{config.label}</Badge>
                        {order.paymentStatus === "paid" && (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle2 className="h-2.5 w-2.5" /> Paid
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Placed on {formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right sm:flex-shrink-0">
                    <span className="text-2xl font-bold text-foreground">{formatPriceFixed(Number(order.total))}</span>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ChevronDown className={cn("h-5 w-5 transition-transform", isExpanded && "rotate-180")} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Order Details */}
              {isExpanded && (
                <div className="border-t border-border p-6 animate-slide-in-down">
                  <div className="grid gap-6 md:grid-cols-3">
                    {/* Order Items */}
                    <div className="md:col-span-2 space-y-4">
                      <h3 className="font-semibold text-lg">Order Items</h3>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-border bg-muted/30">
                            <div className="relative h-20 w-20 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                              {item.productImage ? (
                                <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="80px" />
                              ) : (
                                <Package className="h-8 w-8 text-muted-foreground/40" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link href={`/products/${item.productId}`} className="font-medium text-sm line-clamp-1 hover:text-primary transition-colors">
                                {item.productName}
                              </Link>
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <span>Qty: {item.quantity}</span>
                                <span className="font-semibold text-foreground">{formatPriceFixed(Number(item.price) * item.quantity)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                        <h4 className="font-semibold">Order Summary</h4>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPriceFixed(Number(order.subtotal))}</span></div>
                          {Number(order.discount) > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPriceFixed(Number(order.discount))}</span></div>}
                          <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shipping === "0" ? "Free" : formatPriceFixed(Number(order.shipping))}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatPriceFixed(Number(order.tax))}</span></div>
                          <div className="border-t border-border pt-2 flex justify-between font-semibold text-base"><span>Total</span><span>{formatPriceFixed(Number(order.total))}</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Shipping & Tracking */}
                    <div className="space-y-6">
                      <div className="rounded-xl border border-border bg-card p-4">
                        <h4 className="font-semibold mb-4 flex items-center gap-2"><MapPin className="h-4 w-4" /> Shipping Address</h4>
                        <address className="text-sm text-muted-foreground not-italic space-y-1">
                          <p className="font-medium text-foreground">{order.shippingAddress.name}</p>
                          <p>{order.shippingAddress.address1}</p>
                          {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                          <p>{order.shippingAddress.country}</p>
                          <p>{order.shippingAddress.email}</p>
                          <p>{order.shippingAddress.phone}</p>
                        </address>
                      </div>

                      {order.trackingNumber && (
                        <div className="rounded-xl border border-border bg-card p-4">
                          <h4 className="font-semibold mb-3 flex items-center gap-2"><Truck className="h-4 w-4" /> Tracking</h4>
                          <div className="p-3 rounded-lg bg-muted font-mono text-sm text-center">{order.trackingNumber}</div>
                          <div className="mt-3 flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1"><ExternalLink className="h-4 w-4 mr-1" />Track</Button>
                          </div>
                        </div>
                      )}

                      {/* Status Timeline */}
                      <div className="rounded-xl border border-border bg-card p-4">
                        <h4 className="font-semibold mb-4">Status Timeline</h4>
                        <div className="space-y-4">
                          {config.steps.map((step, idx) => {
                            const isCompleted = statusOrder.indexOf(step) <= currentStepIndex;
                            const isCurrent = step === order.status;
                            const stepConfig = statusConfig[step] || { label: step, icon: HelpCircle, color: "default" as const };
                            return (
                              <div key={step} className="flex items-start gap-3">
                                <div className="flex flex-col items-center shrink-0">
                                  <div className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center border-2 text-xs font-semibold shrink-0",
                                    isCompleted
                                      ? "bg-primary border-primary text-primary-foreground"
                                      : "border-border text-muted-foreground bg-background"
                                  )}>
                                    {isCompleted ? <CheckCircle2 className="h-4.5 w-4.5" /> : stepConfig.icon !== HelpCircle ? <stepConfig.icon className="h-4.5 w-4.5" /> : (idx + 1)}
                                  </div>
                                  {idx < config.steps.length - 1 && <div className="h-full w-0.5 bg-border mt-1" />}
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                  <p className={cn("text-sm font-medium", isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground")}>
                                    {stepConfig.label}
                                  </p>
                                  {isCurrent && <p className="text-xs text-primary mt-0.5">Current status</p>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-3">
                    <Link href={`/account/orders/${order.id}`}>
                      <Button variant="outline"><RotateCcw className="h-4 w-4 mr-2" />View Full Details</Button>
                    </Link>
                    {order.status !== "delivered" && order.status !== "cancelled" && (
                      <Button variant="outline"><HelpCircle className="h-4 w-4 mr-2" />Need Help?</Button>
                    )}
                    {order.status === "delivered" && (
                      <Button variant="outline"><RotateCcw className="h-4 w-4 mr-2" />Return/Replace</Button>
                    )}
                    <Button variant="ghost" onClick={() => navigator.clipboard.writeText(order.orderNumber)}>
                      <Package className="h-4 w-4 mr-2" />Copy Order ID
                    </Button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-IN", {
  year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
});