"use client";

import { useState, useEffect } from "react";
import { Grid3X3, Filter, X, SlidersHorizontal } from "lucide-react";
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

function FilterBottomSheet({ isOpen, onClose, filters, totalResults }: {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  totalResults: number;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-2xl max-h-[85vh] flex flex-col animate-slide-in-up">
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background z-10">
          <h2 className="text-lg font-semibold">Filters ({totalResults} results)</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <FilterSidebar filters={filters} totalResults={totalResults} />
        </div>
        <div className="p-4 border-t border-border sticky bottom-0 bg-background">
          <button className="w-full rounded-lg bg-primary px-4 py-3 text-white font-medium" onClick={onClose}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage({ searchParams, initialProducts }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }>, initialProducts: Product[] }) {
  const [resolvedSearchParams, setResolvedSearchParams] = useState<{ [key: string]: string | string[] | undefined }>({});
  const [mounted, setMounted] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

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
  const hasActiveFilters = Object.values(filters).some((v) => v && v !== "");

  return (
    <div className="min-h-screen">
      <FilterBottomSheet isOpen={filterSheetOpen} onClose={() => setFilterSheetOpen(false)} filters={filters} totalResults={totalResults} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">All Products</h1>
          <p className="text-sm text-muted-foreground">Browse our collection of premium laptops, desktops, monitors & accessories</p>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Grid3X3 size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{totalResults}</span> product{totalResults !== 1 ? "s" : ""} found
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilterSheetOpen(true)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium transition-colors",
                hasActiveFilters ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"
              )}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs">{Object.values(filters).filter(v => v && v !== "").length}</span>}
            </button>

            <div className="relative flex-1 sm:w-[200px]">
              <select
                value={filters.sort}
                onChange={(e) => {
                  const url = new URL(window.location.href);
                  url.searchParams.set("sort", e.target.value);
                  url.searchParams.delete("page");
                  window.location.href = url.toString();
                }}
                className="w-full h-9 appearance-none rounded-lg border border-border bg-background pl-3 pr-8 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterSidebar filters={filters} totalResults={totalResults} />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allProducts.map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>

            {allProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}