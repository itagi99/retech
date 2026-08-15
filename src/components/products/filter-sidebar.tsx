"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CATEGORIES,
  BRANDS,
  CONDITIONS,
  PRICE_RANGES,
  RAM_OPTIONS,
  STORAGE_OPTIONS,
  PROCESSOR_OPTIONS,
  SCREEN_SIZES,
  GPU_OPTIONS,
  type FilterState,
} from "@/lib/products";

interface FilterSidebarProps {
  filters: FilterState;
  totalResults: number;
}

function FilterGroup({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-1 text-sm font-semibold text-foreground"
      >
        {title}
        <ChevronDown
          size={16}
          className={cn("transition-transform text-muted-foreground", isOpen && "rotate-180")}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SelectOption({
  value,
  label,
  selectedValue,
  onSelect,
}: {
  value: string;
  label: string;
  selectedValue: string;
  onSelect: (value: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(selectedValue === value ? "" : value)}
      className={cn(
        "w-full rounded-lg px-3 py-2 text-left text-xs transition-colors",
        selectedValue === value
          ? "bg-primary text-primary-foreground"
          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

export default function FilterSidebar({ filters, totalResults }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => v && v !== "featured" && v !== "1"
  );

  const sidebarContent = (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <FilterGroup title="Search">
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </FilterGroup>

      {/* Category */}
      <FilterGroup title="Category">
        <div className="grid grid-cols-2 gap-1.5">
          {CATEGORIES.map((cat) => (
            <SelectOption
              key={cat.slug}
              value={cat.slug}
              label={cat.name}
              selectedValue={filters.category}
              onSelect={(v) => updateFilter("category", v)}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Brand */}
      <FilterGroup title="Brand">
        <div className="grid grid-cols-2 gap-1.5">
          {BRANDS.map((brand) => (
            <SelectOption
              key={brand}
              value={brand}
              label={brand}
              selectedValue={filters.brand}
              onSelect={(v) => updateFilter("brand", v)}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Condition */}
      <FilterGroup title="Condition">
        <div className="space-y-1.5">
          {CONDITIONS.map((cond) => (
            <SelectOption
              key={cond.value}
              value={cond.value}
              label={cond.name}
              selectedValue={filters.condition}
              onSelect={(v) => updateFilter("condition", v)}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Price Range */}
      <FilterGroup title="Price Range">
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => (
            <SelectOption
              key={range.value}
              value={range.value}
              label={range.name}
              selectedValue={filters.priceRange}
              onSelect={(v) => updateFilter("priceRange", v)}
            />
          ))}
        </div>
      </FilterGroup>

      {/* RAM */}
      <FilterGroup title="RAM">
        <div className="grid grid-cols-3 gap-1.5">
          {RAM_OPTIONS.map((ram) => (
            <SelectOption
              key={ram}
              value={ram}
              label={ram}
              selectedValue={filters.ram}
              onSelect={(v) => updateFilter("ram", v)}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Storage */}
      <FilterGroup title="Storage">
        <div className="grid grid-cols-3 gap-1.5">
          {STORAGE_OPTIONS.map((storage) => (
            <SelectOption
              key={storage}
              value={storage}
              label={storage}
              selectedValue={filters.storage}
              onSelect={(v) => updateFilter("storage", v)}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Processor */}
      <FilterGroup title="Processor">
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {PROCESSOR_OPTIONS.map((proc) => (
            <SelectOption
              key={proc}
              value={proc}
              label={proc}
              selectedValue={filters.processor}
              onSelect={(v) => updateFilter("processor", v)}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Screen Size */}
      <FilterGroup title="Screen Size">
        <div className="grid grid-cols-4 gap-1.5">
          {SCREEN_SIZES.map((size) => (
            <SelectOption
              key={size}
              value={size}
              label={size}
              selectedValue={filters.screenSize}
              onSelect={(v) => updateFilter("screenSize", v)}
            />
          ))}
        </div>
      </FilterGroup>

      {/* GPU */}
      <FilterGroup title="GPU">
        <div className="space-y-1.5">
          {GPU_OPTIONS.map((gpu) => (
            <SelectOption
              key={gpu}
              value={gpu}
              label={gpu}
              selectedValue={filters.gpu}
              onSelect={(v) => updateFilter("gpu", v)}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Availability */}
      <FilterGroup title="Availability">
        <div className="space-y-1.5">
          <SelectOption
            value="in_stock"
            label="In Stock"
            selectedValue={filters.availability}
            onSelect={(v) => updateFilter("availability", v)}
          />
          <SelectOption
            value="out_of_stock"
            label="Out of Stock"
            selectedValue={filters.availability}
            onSelect={(v) => updateFilter("availability", v)}
          />
        </div>
      </FilterGroup>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-4 rounded-xl border border-border bg-card p-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile Filter Button & Drawer */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileOpen(true)}
          className="mb-4"
        >
          <SlidersHorizontal size={16} className="mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1.5 rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">
              Active
            </span>
          )}
        </Button>

        <AnimatePresence>
          {isMobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50"
                onClick={() => setIsMobileOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] overflow-y-auto bg-background border-r border-border p-4 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Filters</h3>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="rounded-lg p-2 hover:bg-muted transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
                  {sidebarContent}
                </div>
                <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm pt-4 pb-2 mt-4">
                  <p className="text-xs text-muted-foreground mb-2">
                    {totalResults} product{totalResults !== 1 ? "s" : ""} found
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Show Results
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
