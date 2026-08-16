"use client";

import { useState, useEffect } from "react";
import { Grid3X3 } from "lucide-react";
import ProductCard from "@/components/products/product-card";
import FilterSidebar from "@/components/products/filter-sidebar";
import { type Product, type FilterState, filterProducts } from "@/lib/products";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { name: "Featured", value: "featured" },
  { name: "Price: Low to High", value: "price_asc" },
  { name: "Price: High to Low", value: "price_desc" },
  { name: "Newest", value: "newest" },
  { name: "Highest Rated", value: "rating" },
  { name: "Best Selling", value: "bestselling" },
];

function buildFilters(searchParams: URLSearchParams): FilterState {
  return {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    condition: searchParams.get("condition") || "",
    priceRange: searchParams.get("priceRange") || "",
    ram: searchParams.get("ram") || "",
    storage: searchParams.get("storage") || "",
    processor: searchParams.get("processor") || "",
    screenSize: searchParams.get("screenSize") || "",
    gpu: searchParams.get("gpu") || "",
    availability: searchParams.get("availability") || "",
    sort: searchParams.get("sort") || "",
    page: searchParams.get("page") || "",
  };
}

export default function ProductsPage({ searchParams, initialProducts }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }>, initialProducts: Product[] }) {
  const [resolvedSearchParams, setResolvedSearchParams] = useState<{ [key: string]: string | string[] | undefined }>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchParams && typeof searchParams.then === "function") {
      searchParams.then(setResolvedSearchParams);
    }
  }, [searchParams]);

  if (!mounted) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">All Products</h1>
          <p className="text-sm text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  const filters = buildFilters(new URLSearchParams(resolvedSearchParams as any));
  const allProducts = filterProducts(initialProducts, filters);
  const totalResults = allProducts.length;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">All Products</h1>
          <p className="text-sm text-muted-foreground">Browse our collection of premium laptops, desktops, monitors & accessories</p>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Grid3X3 size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{totalResults}</span> product{totalResults !== 1 ? "s" : ""} found
            </span>
          </div>
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => {
                const url = new URL(window.location.href);
                url.searchParams.set("sort", e.target.value);
                url.searchParams.delete("page");
                window.location.href = url.toString();
              }}
              className="h-9 appearance-none rounded-lg border border-border bg-background pl-3 pr-8 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="flex gap-6">
          <FilterSidebar filters={filters} totalResults={totalResults} />
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
