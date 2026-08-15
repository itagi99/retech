export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { getOrders } from "@/actions/admin/orders";

const ORDER_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

const PAYMENT_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    processing: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    shipped: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    refunded: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    refunded: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

async function OrdersTable({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = Number(searchParams.page) || 1;
  const status = typeof searchParams.status === "string" ? searchParams.status : "all";
  const paymentStatus = typeof searchParams.paymentStatus === "string" ? searchParams.paymentStatus : "all";
  const search = typeof searchParams.search === "string" ? searchParams.search : "";
  const dateFrom = typeof searchParams.dateFrom === "string" ? searchParams.dateFrom : "";
  const dateTo = typeof searchParams.dateTo === "string" ? searchParams.dateTo : "";

  const { orders, totalPages } = await getOrders({
    search,
    status,
    paymentStatus,
    dateFrom,
    dateTo,
    page,
    limit: 10,
  });

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.userId || "Guest"}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell><StatusBadge status={order.status} /></TableCell>
                    <TableCell><PaymentBadge status={order.paymentStatus} /></TableCell>
                    <TableCell>${Number(order.total).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/orders/${order.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" disabled={page <= 1} asChild>
            <Link href={`?page=${page - 1}&status=${status}&paymentStatus=${paymentStatus}&search=${search}&dateFrom=${dateFrom}&dateTo=${dateTo}`}>
              Previous
            </Link>
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
            <Link href={`?page=${page + 1}&status=${status}&paymentStatus=${paymentStatus}&search=${search}&dateFrom=${dateFrom}&dateTo=${dateTo}`}>
              Next
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolved = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>
      </div>

      <form className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Search order number..."
              defaultValue={typeof resolved.search === "string" ? resolved.search : ""}
              className="pl-9"
            />
          </div>
          <select name="status" defaultValue={typeof resolved.status === "string" ? resolved.status : "all"} className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="all">All Status</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select name="paymentStatus" defaultValue={typeof resolved.paymentStatus === "string" ? resolved.paymentStatus : "all"} className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="all">All Payments</option>
            {PAYMENT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <div className="space-y-1">
              <Label htmlFor="dateFrom" className="text-xs">From</Label>
              <Input id="dateFrom" name="dateFrom" type="date" defaultValue={typeof resolved.dateFrom === "string" ? resolved.dateFrom : ""} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="dateTo" className="text-xs">To</Label>
              <Input id="dateTo" name="dateTo" type="date" defaultValue={typeof resolved.dateTo === "string" ? resolved.dateTo : ""} />
            </div>
          </div>
          <Button type="submit" variant="secondary">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </form>

      <Suspense fallback={<div>Loading...</div>}>
        <OrdersTable searchParams={resolved} />
      </Suspense>
    </div>
  );
}
