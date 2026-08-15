import Link from "next/link";
import { PackageX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductsNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <PackageX className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        No Products Found
      </h2>
      <p className="text-muted-foreground max-w-md mb-8">
        We couldn&apos;t find any products matching your current filters. Try adjusting your criteria or browse our full catalog.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild variant="default">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            View All Products
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
