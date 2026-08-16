import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const params = await searchParams;
  const orderId = params.orderId || "";

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground">Thank you for your purchase. We've received your order and will begin processing it shortly.</p>

        {orderId && (
          <div className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-mono">
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
            Order ID: {orderId}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/products">
            <Button size="lg" className="w-full sm:w-auto">
              Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/account/orders">
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
              <Package className="h-4 w-4" /> View Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
