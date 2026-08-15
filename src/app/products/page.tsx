export const dynamic = 'force-dynamic';

import { Grid3X3 } from "lucide-react";
import ProductCard from "@/components/products/product-card";
import FilterSidebar from "@/components/products/filter-sidebar";
import SortSelectClient from "@/components/products/sort-select";
import { getProducts, type FilterState } from "@/lib/products";

const ITEMS_PER_PAGE = 12;

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function buildFilters(searchParams: { [key: string]: string | string[] | undefined }): FilterState {
  const getVal = (key: string) => {
    const val = searchParams[key];
    if (Array.isArray(val)) return val[0] || "";
    return val || "";
  };

  return {
    search: getVal("search"),
    category: getVal("category"),
    brand: getVal("brand"),
    condition: getVal("condition"),
    priceRange: getVal("priceRange"),
    ram: getVal("ram"),
    storage: getVal("storage"),
    processor: getVal("processor"),
    screenSize: getVal("screenSize"),
    gpu: getVal("gpu"),
    availability: getVal("availability"),
    sort: getVal("sort"),
    page: getVal("page"),
  };
}

function paginateItems<T>(items: T[], page: number, perPage: number): { items: T[]; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return { items: items.slice(start, start + perPage), totalPages };
}

function PageButton({
  href,
  children,
  disabled,
  active,
}: {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
}) {
  if (disabled) {
    return (
      <span className="flex h-9 min-w-[2.5rem] items-center justify-center rounded-lg border border-border bg-muted px-3 text-xs font-medium text-muted-foreground cursor-not-allowed">
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      className={cn(
        "flex h-9 min-w-[2.5rem] items-center justify-center rounded-lg border px-3 text-xs font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "border-border bg-background hover:bg-muted text-foreground"
      )}
    >
      {children}
    </a>
  );
}

type ProductType = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  discountPercent: number;
  condition: "new" | "refurbished" | "open_box" | "used";
  rating: number;
  reviewCount: number;
  stock: number;
  warranty: string;
  thumbnail: string;
  videoUrl: string | null;
  brand: string;
  category: string;
  categorySlug: string;
  isFeatured: boolean;
  isTrending: boolean;
  specifications: Record<string, string>;
};

function ProductsContent({ filters, allProducts }: { filters: FilterState; allProducts: ProductType[] }) {
  const filtered = allProducts.filter((p) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !p.name.toLowerCase().includes(q) &&
        !p.brand.toLowerCase().includes(q) &&
        !p.category.toLowerCase().includes(q)
      )
        return false;
    }
    if (filters.category && p.category !== filters.category) return false;
    if (filters.brand && p.brand !== filters.brand) return false;
    if (filters.condition && p.condition !== filters.condition) return false;
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      if (p.price < min || p.price > max) return false;
    }
    if (filters.ram && p.specifications.ram !== filters.ram) return false;
    if (filters.storage && p.specifications.storage !== filters.storage) return false;
    if (filters.processor && p.specifications.processor !== filters.processor) return false;
    if (filters.screenSize && p.specifications.screen !== filters.screenSize) return false;
    if (filters.gpu && p.specifications.gpu !== filters.gpu) return false;
    if (filters.availability === "in_stock" && p.stock === 0) return false;
    if (filters.availability === "out_of_stock" && p.stock > 0) return false;
    return true;
  });

  const sort = filters.sort || "featured";

  if (sort === "price_asc") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") filtered.sort((a, b) => b.price - a.price);
  else if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
  else if (sort === "newest") filtered.sort((a, b) => b.id.localeCompare(a.id));
  else if (sort === "bestselling") filtered.sort((a, b) => b.reviewCount - a.reviewCount);
  else filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));

  const page = parseInt(filters.page || "1", 10);
  const { items, totalPages } = paginateItems(filtered, page, ITEMS_PER_PAGE);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Grid3X3 className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No products found</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          We couldn&apos;t find any products matching your current filters. Try adjusting your criteria or browse our full catalog.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <PageButton
            href={`/products?${new URLSearchParams({ ...filters, page: String(page - 1) }).toString()}`}
            disabled={page <= 1}
          >
            Previous
          </PageButton>
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === page;
              const showPage =
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= page - 1 && pageNum <= page + 1);

              if (!showPage) {
                if (pageNum === page - 2 || pageNum === page + 2) {
                  return (
                    <span
                      key={`ellipsis-${pageNum}`}
                      className="px-2 text-muted-foreground text-xs"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <PageButton
                  key={pageNum}
                  href={`/products?${new URLSearchParams({ ...filters, page: String(pageNum) }).toString()}`}
                  active={isActive}
                >
                  {pageNum}
                </PageButton>
              );
            })}
          </div>
          <PageButton
            href={`/products?${new URLSearchParams({ ...filters, page: String(page + 1) }).toString()}`}
            disabled={page >= totalPages}
          >
            Next
          </PageButton>
        </div>
      )}
    </>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = buildFilters(resolvedSearchParams);

  const allProducts = await getProducts();
  const totalResults = allProducts.length;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            All Products
          </h1>
          <p className="text-sm text-muted-foreground">
            Browse our collection of premium laptops, desktops, monitors & accessories
          </p>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Grid3X3 size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{totalResults}</span> product{totalResults !== 1 ? "s" : ""} found
            </span>
          </div>
          <SortSelectClient value={filters.sort} />
        </div>

        <div className="flex gap-6">
          <FilterSidebar filters={filters} totalResults={totalResults} />
          <div className="flex-1 min-w-0">
            <ProductsContent filters={filters} allProducts={allProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}
