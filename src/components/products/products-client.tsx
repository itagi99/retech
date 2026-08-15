"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/products/product-card";
import FilterSidebar from "@/components/products/filter-sidebar";
import { SORT_OPTIONS } from "@/lib/products";
import { cn } from "@/lib/utils";
import { ChevronDown, Grid3X3 } from "lucide-react";

function SortSelectClient({ value }: { value: string }) {
  const [routerReady, setRouterReady] = useState(false);
  const router = require("next/navigation").useRouter();
  const pathname = require("next/navigation").usePathname();
  const searchParams = require("next/navigation").useSearchParams();

  useEffect(() => {
    setRouterReady(true);
  }, []);

  if (!routerReady) {
    return <div className="h-9 w-40 rounded-lg border border-border bg-muted" />;
  }

  const createUrl = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.delete("page");
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => {
          router.push(createUrl(e.target.value));
        }}
        className="h-9 appearance-none rounded-lg border border-border bg-background pl-3 pr-8 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
    </div>
  );
}

interface ProductsClientProps {
  initialProducts: any[];
  totalResults: number;
  filters: any;
}

export default function ProductsClient({ initialProducts, totalResults, filters }: ProductsClientProps) {
  const [products] = useState(initialProducts);

  return (
    <div className="flex gap-6">
      <FilterSidebar filters={filters} totalResults={totalResults} />
      <div className="flex-1 min-w-0">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Grid3X3 size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{totalResults}</span> product{totalResults !== 1 ? "s" : ""} found
            </span>
          </div>
          <SortSelectClient value={filters.sort} />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
