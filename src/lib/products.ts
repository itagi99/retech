import { eq } from "drizzle-orm";

export interface Product {
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
  includedItems?: string[];
  grade?: string;
  batteryHealth?: number;
  cosmeticCondition?: string;
}

export interface FilterState {
  search: string;
  category: string;
  brand: string;
  condition: string;
  priceRange: string;
  ram: string;
  storage: string;
  processor: string;
  screenSize: string;
  gpu: string;
  availability: string;
  sort: string;
  page: string;
}

export const CATEGORIES = [
  { name: "Laptops", slug: "laptops" },
  { name: "Gaming", slug: "gaming" },
  { name: "Business", slug: "business" },
  { name: "Desktops", slug: "desktops" },
  { name: "Monitors", slug: "monitors" },
  { name: "Accessories", slug: "accessories" },
] as const;

export const BRANDS = [
  "Dell", "HP", "Lenovo", "Apple", "ASUS", "Acer", "Samsung", "LG",
] as const;

export const CONDITIONS = [
  { name: "New", value: "new" },
  { name: "Refurbished", value: "refurbished" },
  { name: "Open Box", value: "open_box" },
  { name: "Used", value: "used" },
] as const;

export const PRICE_RANGES = [
  { name: "Under $500", value: "0-500" },
  { name: "$500 - $1000", value: "500-1000" },
  { name: "$1000 - $2000", value: "1000-2000" },
  { name: "$2000+", value: "2000-99999" },
] as const;

export const RAM_OPTIONS = ["4GB", "8GB", "16GB", "32GB", "64GB"] as const;
export const STORAGE_OPTIONS = ["128GB", "256GB", "512GB", "1TB", "2TB"] as const;
export const PROCESSOR_OPTIONS = [
  "Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9",
  "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9",
  "Apple M1", "Apple M2", "Apple M3",
] as const;
export const SCREEN_SIZES = ['13"', '14"', '15"', '16"', '17"', '24"', '27"'] as const;
export const GPU_OPTIONS = [
  "Integrated", "NVIDIA RTX", "NVIDIA GTX", "AMD Radeon", "Apple GPU",
] as const;

export const SORT_OPTIONS = [
  { name: "Featured", value: "featured" },
  { name: "Price: Low to High", value: "price_asc" },
  { name: "Price: High to Low", value: "price_desc" },
  { name: "Newest", value: "newest" },
  { name: "Highest Rated", value: "rating" },
  { name: "Best Selling", value: "bestselling" },
] as const;

export const ORDER_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
] as const;

const CONDITIONS_MAP: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  refurbished: {
    label: "Refurbished",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  open_box: {
    label: "Open Box",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  used: { label: "Used", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" },
};

export function getConditionBadge(condition: string) {
  return CONDITIONS_MAP[condition] || CONDITIONS_MAP.new;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1", name: 'MacBook Pro 16" M3 Max', slug: "macbook-pro-16-m3-max",
    price: 2499, compareAtPrice: 2999, discountPercent: 17, condition: "new",
    rating: 4.9, reviewCount: 128, stock: 15, warranty: "1 Year Apple Warranty",
    thumbnail: "", videoUrl: null, brand: "Apple", category: "laptops", categorySlug: "laptops", isFeatured: true, isTrending: false,
    specifications: { ram: "36GB", storage: "1TB", processor: "Apple M3 Max", screen: '16"', gpu: "Apple GPU" },
  },
  {
    id: "2", name: "Dell XPS 15 9530", slug: "dell-xps-15-9530",
    price: 1299, compareAtPrice: 1599, discountPercent: 19, condition: "refurbished",
    rating: 4.5, reviewCount: 84, stock: 8, warranty: "1 Year Dell Warranty",
    thumbnail: "", videoUrl: null, brand: "Dell", category: "laptops", categorySlug: "laptops", isFeatured: true, isTrending: false,
    specifications: { ram: "16GB", storage: "512GB", processor: "Intel Core i7", screen: '15.6"', gpu: "NVIDIA RTX" },
  },
  {
    id: "3", name: "HP Spectre x360 14", slug: "hp-spectre-x360-14",
    price: 1149, compareAtPrice: 1399, discountPercent: 18, condition: "new",
    rating: 4.3, reviewCount: 56, stock: 12, warranty: "1 Year HP Warranty",
    thumbnail: "", videoUrl: null, brand: "HP", category: "laptops", categorySlug: "laptops", isFeatured: false, isTrending: false,
    specifications: { ram: "16GB", storage: "512GB", processor: "Intel Core i7", screen: '14"', gpu: "Integrated" },
  },
  {
    id: "4", name: "Lenovo ThinkPad X1 Carbon Gen 11", slug: "lenovo-thinkpad-x1-carbon-gen-11",
    price: 1099, compareAtPrice: null, discountPercent: 0, condition: "open_box",
    rating: 4.7, reviewCount: 92, stock: 5, warranty: "6 Months Warranty",
    thumbnail: "", videoUrl: null, brand: "Lenovo", category: "business", categorySlug: "business", isFeatured: true, isTrending: false,
    specifications: { ram: "16GB", storage: "512GB", processor: "Intel Core i7", screen: '14"', gpu: "Integrated" },
  },
  {
    id: "5", name: "ASUS ROG Zephyrus G16", slug: "asus-rog-zephyrus-g16",
    price: 1899, compareAtPrice: 2199, discountPercent: 14, condition: "new",
    rating: 4.8, reviewCount: 143, stock: 7, warranty: "2 Year ASUS Warranty",
    thumbnail: "", videoUrl: null, brand: "ASUS", category: "gaming", categorySlug: "gaming", isFeatured: true, isTrending: true,
    specifications: { ram: "32GB", storage: "1TB", processor: "Intel Core i9", screen: '16"', gpu: "NVIDIA RTX" },
  },
  {
    id: "6", name: "Acer Predator Helios 16", slug: "acer-predator-helios-16",
    price: 1499, compareAtPrice: 1799, discountPercent: 17, condition: "new",
    rating: 4.4, reviewCount: 67, stock: 10, warranty: "1 Year Acer Warranty",
    thumbnail: "", videoUrl: null, brand: "Acer", category: "gaming", categorySlug: "gaming", isFeatured: false, isTrending: false,
    specifications: { ram: "16GB", storage: "1TB", processor: "Intel Core i7", screen: '16"', gpu: "NVIDIA RTX" },
  },
  {
    id: "7", name: "Samsung Odyssey G9", slug: "samsung-odyssey-g9",
    price: 1299, compareAtPrice: 1599, discountPercent: 19, condition: "new",
    rating: 4.6, reviewCount: 203, stock: 20, warranty: "1 Year Samsung Warranty",
    thumbnail: "", videoUrl: null, brand: "Samsung", category: "monitors", categorySlug: "monitors", isFeatured: true, isTrending: false,
    specifications: { ram: "N/A", storage: "N/A", processor: "N/A", screen: '49"', gpu: "N/A" },
  },
  {
    id: "8", name: "LG UltraFine 5K Display", slug: "lg-ultrafine-5k-display",
    price: 1495, compareAtPrice: 1699, discountPercent: 12, condition: "refurbished",
    rating: 4.4, reviewCount: 45, stock: 3, warranty: "1 Year LG Warranty",
    thumbnail: "", videoUrl: null, brand: "LG", category: "monitors", categorySlug: "monitors", isFeatured: false, isTrending: false,
    specifications: { ram: "N/A", storage: "N/A", processor: "N/A", screen: '27"', gpu: "N/A" },
  },
  {
    id: "9", name: 'Apple iMac 24" M3', slug: "apple-imac-24-m3",
    price: 1299, compareAtPrice: 1499, discountPercent: 13, condition: "new",
    rating: 4.7, reviewCount: 89, stock: 9, warranty: "1 Year Apple Warranty",
    thumbnail: "", videoUrl: null, brand: "Apple", category: "desktops", categorySlug: "desktops", isFeatured: true, isTrending: false,
    specifications: { ram: "8GB", storage: "256GB", processor: "Apple M3", screen: '24"', gpu: "Apple GPU" },
  },
  {
    id: "10", name: "Dell Inspiron 3020 Desktop", slug: "dell-inspiron-3020-desktop",
    price: 449, compareAtPrice: 599, discountPercent: 25, condition: "new",
    rating: 4.1, reviewCount: 34, stock: 25, warranty: "1 Year Dell Warranty",
    thumbnail: "", videoUrl: null, brand: "Dell", category: "desktops", categorySlug: "desktops", isFeatured: false, isTrending: false,
    specifications: { ram: "8GB", storage: "512GB", processor: "Intel Core i5", screen: "N/A", gpu: "Integrated" },
  },
  {
    id: "11", name: "HP Omen 45L Gaming Desktop", slug: "hp-omen-45l-gaming-desktop",
    price: 1699, compareAtPrice: 1999, discountPercent: 15, condition: "new",
    rating: 4.5, reviewCount: 71, stock: 6, warranty: "1 Year HP Warranty",
    thumbnail: "", videoUrl: null, brand: "HP", category: "gaming", categorySlug: "gaming", isFeatured: true, isTrending: true,
    specifications: { ram: "32GB", storage: "2TB", processor: "Intel Core i9", screen: "N/A", gpu: "NVIDIA RTX" },
  },
  {
    id: "12", name: "Lenovo Legion Pro 5i", slug: "lenovo-legion-pro-5i",
    price: 1399, compareAtPrice: 1699, discountPercent: 18, condition: "refurbished",
    rating: 4.6, reviewCount: 98, stock: 4, warranty: "1 Year Lenovo Warranty",
    thumbnail: "", videoUrl: null, brand: "Lenovo", category: "gaming", categorySlug: "gaming", isFeatured: false, isTrending: false,
    specifications: { ram: "16GB", storage: "1TB", processor: "Intel Core i7", screen: '16"', gpu: "NVIDIA RTX" },
  },
  {
    id: "13", name: 'Apple MacBook Air 15" M3', slug: "macbook-air-15-m3",
    price: 1099, compareAtPrice: 1299, discountPercent: 15, condition: "new",
    rating: 4.8, reviewCount: 156, stock: 18, warranty: "1 Year Apple Warranty",
    thumbnail: "", videoUrl: null, brand: "Apple", category: "laptops", categorySlug: "laptops", isFeatured: true, isTrending: false,
    specifications: { ram: "8GB", storage: "256GB", processor: "Apple M3", screen: '15.3"', gpu: "Apple GPU" },
  },
  {
    id: "14", name: "ASUS Zenbook 14 OLED", slug: "asus-zenbook-14-oled",
    price: 799, compareAtPrice: 999, discountPercent: 20, condition: "new",
    rating: 4.4, reviewCount: 52, stock: 14, warranty: "2 Year ASUS Warranty",
    thumbnail: "", videoUrl: null, brand: "ASUS", category: "laptops", categorySlug: "laptops", isFeatured: false, isTrending: false,
    specifications: { ram: "16GB", storage: "512GB", processor: "Intel Core i7", screen: '14"', gpu: "Integrated" },
  },
  {
    id: "15", name: 'Samsung 49" Odyssey G9 Neo', slug: "samsung-odyssey-g9-neo",
    price: 1499, compareAtPrice: 1999, discountPercent: 25, condition: "open_box",
    rating: 4.7, reviewCount: 112, stock: 2, warranty: "1 Year Samsung Warranty",
    thumbnail: "", videoUrl: null, brand: "Samsung", category: "monitors", categorySlug: "monitors", isFeatured: false, isTrending: false,
    specifications: { ram: "N/A", storage: "N/A", processor: "N/A", screen: '49"', gpu: "N/A" },
  },
  {
    id: "16", name: "Logitech MX Master 3S", slug: "logitech-mx-master-3s",
    price: 99, compareAtPrice: 129, discountPercent: 23, condition: "new",
    rating: 4.8, reviewCount: 324, stock: 50, warranty: "2 Year Logitech Warranty",
    thumbnail: "", videoUrl: null, brand: "LG", category: "accessories", categorySlug: "accessories", isFeatured: false, isTrending: false,
    specifications: { ram: "N/A", storage: "N/A", processor: "N/A", screen: "N/A", gpu: "N/A" },
  },
  {
    id: "17", name: "Dell UltraSharp U2724D", slug: "dell-ultrasharp-u2724d",
    price: 619, compareAtPrice: 749, discountPercent: 17, condition: "new",
    rating: 4.5, reviewCount: 78, stock: 16, warranty: "3 Year Dell Warranty",
    thumbnail: "", videoUrl: null, brand: "Dell", category: "monitors", categorySlug: "monitors", isFeatured: true, isTrending: false,
    specifications: { ram: "N/A", storage: "N/A", processor: "N/A", screen: '27"', gpu: "N/A" },
  },
  {
    id: "18", name: "HP Envy 16 Creator Laptop", slug: "hp-envy-16-creator-laptop",
    price: 1049, compareAtPrice: 1299, discountPercent: 19, condition: "refurbished",
    rating: 4.3, reviewCount: 41, stock: 7, warranty: "1 Year HP Warranty",
    thumbnail: "", videoUrl: null, brand: "HP", category: "laptops", categorySlug: "laptops", isFeatured: false, isTrending: false,
    specifications: { ram: "32GB", storage: "1TB", processor: "Intel Core i7", screen: '16"', gpu: "NVIDIA RTX" },
  },
  {
    id: "19", name: "Acer Swift Go 14", slug: "acer-swift-go-14",
    price: 599, compareAtPrice: 749, discountPercent: 20, condition: "new",
    rating: 4.2, reviewCount: 28, stock: 22, warranty: "1 Year Acer Warranty",
    thumbnail: "", videoUrl: null, brand: "Acer", category: "laptops", categorySlug: "laptops", isFeatured: false, isTrending: false,
    specifications: { ram: "16GB", storage: "512GB", processor: "Intel Core i5", screen: '14"', gpu: "Integrated" },
  },
  {
    id: "20", name: "LG gram 17 Lightweight Laptop", slug: "lg-gram-17-lightweight",
    price: 1199, compareAtPrice: 1499, discountPercent: 20, condition: "new",
    rating: 4.4, reviewCount: 36, stock: 8, warranty: "1 Year LG Warranty",
    thumbnail: "", videoUrl: null, brand: "LG", category: "laptops", categorySlug: "laptops", isFeatured: false, isTrending: false,
    specifications: { ram: "16GB", storage: "512GB", processor: "Intel Core i7", screen: '17"', gpu: "Integrated" },
  },
  {
    id: "21", name: "Apple Mac mini M2 Pro", slug: "mac-mini-m2-pro",
    price: 1299, compareAtPrice: 1499, discountPercent: 13, condition: "refurbished",
    rating: 4.8, reviewCount: 94, stock: 6, warranty: "1 Year Apple Warranty",
    thumbnail: "", videoUrl: null, brand: "Apple", category: "desktops", categorySlug: "desktops", isFeatured: true, isTrending: false,
    specifications: { ram: "16GB", storage: "512GB", processor: "Apple M2 Pro", screen: "N/A", gpu: "Apple GPU" },
  },
  {
    id: "22", name: "ASUS TUF Gaming A15", slug: "asus-tuf-gaming-a15",
    price: 899, compareAtPrice: 1099, discountPercent: 18, condition: "used",
    rating: 4.0, reviewCount: 63, stock: 3, warranty: "90 Days Warranty",
    thumbnail: "", videoUrl: null, brand: "ASUS", category: "gaming", categorySlug: "gaming", isFeatured: false, isTrending: false,
    specifications: { ram: "8GB", storage: "512GB", processor: "AMD Ryzen 5", screen: '15.6"', gpu: "NVIDIA GTX" },
  },
  {
    id: "23", name: "Lenovo IdeaCentre AIO 3", slug: "lenovo-ideacentre-aio-3",
    price: 649, compareAtPrice: 799, discountPercent: 19, condition: "open_box",
    rating: 4.1, reviewCount: 22, stock: 4, warranty: "1 Year Lenovo Warranty",
    thumbnail: "", videoUrl: null, brand: "Lenovo", category: "desktops", categorySlug: "desktops", isFeatured: false, isTrending: false,
    specifications: { ram: "8GB", storage: "256GB", processor: "Intel Core i3", screen: '24"', gpu: "Integrated" },
  },
  {
    id: "24", name: "Samsung T7 Shield 2TB SSD", slug: "samsung-t7-shield-2tb",
    price: 129, compareAtPrice: 179, discountPercent: 28, condition: "new",
    rating: 4.7, reviewCount: 445, stock: 100, warranty: "5 Year Samsung Warranty",
    thumbnail: "", videoUrl: null, brand: "Samsung", category: "accessories", categorySlug: "accessories", isFeatured: false, isTrending: false,
    specifications: { ram: "N/A", storage: "2TB", processor: "N/A", screen: "N/A", gpu: "N/A" },
  },
  {
    id: "25", name: "Dell P2722H 27\" Monitor", slug: "dell-p2722h-27-monitor",
    price: 329, compareAtPrice: 429, discountPercent: 23, condition: "refurbished",
    rating: 4.3, reviewCount: 55, stock: 11, warranty: "3 Year Dell Warranty",
    thumbnail: "", videoUrl: null, brand: "Dell", category: "monitors", categorySlug: "monitors", isFeatured: false, isTrending: false,
    specifications: { ram: "N/A", storage: "N/A", processor: "N/A", screen: '27"', gpu: "N/A" },
  },
];

export function filterProducts(products: Product[], filters: Partial<FilterState>): Product[] {
  let filtered = [...products];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (filters.category) {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  if (filters.brand) {
    filtered = filtered.filter((p) => p.brand === filters.brand);
  }

  if (filters.condition) {
    filtered = filtered.filter((p) => p.condition === filters.condition);
  }

  if (filters.priceRange) {
    const [min, max] = filters.priceRange.split("-").map(Number);
    filtered = filtered.filter((p) => p.price >= min && p.price <= max);
  }

  if (filters.ram) {
    filtered = filtered.filter((p) => p.specifications.ram === filters.ram);
  }

  if (filters.storage) {
    filtered = filtered.filter((p) => p.specifications.storage === filters.storage);
  }

  if (filters.processor) {
    filtered = filtered.filter((p) => p.specifications.processor === filters.processor);
  }

  if (filters.screenSize) {
    filtered = filtered.filter((p) => p.specifications.screen === filters.screenSize);
  }

  if (filters.gpu) {
    filtered = filtered.filter((p) => p.specifications.gpu === filters.gpu);
  }

  if (filters.availability === "in_stock") {
    filtered = filtered.filter((p) => p.stock > 0);
  } else if (filters.availability === "out_of_stock") {
    filtered = filtered.filter((p) => p.stock === 0);
  }

  const sort = filters.sort || "featured";

  if (sort === "price_asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sort === "newest") {
    filtered.sort((a, b) => b.id.localeCompare(a.id));
  } else if (sort === "bestselling") {
    filtered.sort((a, b) => b.reviewCount - a.reviewCount);
  } else {
    filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  return filtered;
}

export function paginateProducts<T>(items: T[], page: number, perPage: number): { items: T[]; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return { items: items.slice(start, start + perPage), totalPages };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const { db } = await import("@/lib/db");
    const { products: productsTable, categories, brands } = await import("@drizzle/schema");

    const rows = await db.select({
      id: productsTable.id,
      name: productsTable.name,
      slug: productsTable.slug,
      price: productsTable.price,
      compareAtPrice: productsTable.compareAtPrice,
      discountPercent: productsTable.discountPercent,
      condition: productsTable.condition,
      rating: productsTable.rating,
      reviewCount: productsTable.reviewCount,
      stock: productsTable.stock,
      warranty: productsTable.warranty,
      thumbnail: productsTable.thumbnail,
      videoUrl: productsTable.videoUrl,
      isFeatured: productsTable.isFeatured,
      isTrending: productsTable.isTrending,
      specifications: productsTable.specifications,
      grade: productsTable.grade,
      batteryHealth: productsTable.batteryHealth,
      cosmeticCondition: productsTable.cosmeticCondition,
      brandName: brands.name,
      categoryName: categories.name,
      categorySlug: categories.slug,
    }).from(productsTable)
      .leftJoin(brands, eq(productsTable.brandId, brands.id))
      .leftJoin(categories, eq(productsTable.categoryId, categories.id))
      .where(eq(productsTable.isActive, true));

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      price: Number(r.price),
      compareAtPrice: r.compareAtPrice ? Number(r.compareAtPrice) : null,
      discountPercent: r.discountPercent,
      condition: r.condition as Product["condition"],
      rating: Number(r.rating),
      reviewCount: r.reviewCount,
      stock: r.stock,
      warranty: r.warranty || "",
      thumbnail: r.thumbnail || "",
      videoUrl: r.videoUrl,
      brand: r.brandName || "",
      category: r.categoryName || "",
      categorySlug: r.categorySlug || "",
      isFeatured: r.isFeatured,
      isTrending: r.isTrending,
      specifications: (typeof r.specifications === "string" ? JSON.parse(r.specifications) : r.specifications || {}) as Record<string, string>,
      grade: r.grade || undefined,
      batteryHealth: r.batteryHealth || undefined,
      cosmeticCondition: r.cosmeticCondition || undefined,
    }));
  } catch {
    return MOCK_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { db } = await import("@/lib/db");
    const { products: productsTable, categories, brands } = await import("@drizzle/schema");

    const [row] = await db.select({
      id: productsTable.id,
      name: productsTable.name,
      slug: productsTable.slug,
      price: productsTable.price,
      compareAtPrice: productsTable.compareAtPrice,
      discountPercent: productsTable.discountPercent,
      condition: productsTable.condition,
      rating: productsTable.rating,
      reviewCount: productsTable.reviewCount,
      stock: productsTable.stock,
      warranty: productsTable.warranty,
      thumbnail: productsTable.thumbnail,
      videoUrl: productsTable.videoUrl,
      isFeatured: productsTable.isFeatured,
      isTrending: productsTable.isTrending,
      specifications: productsTable.specifications,
      grade: productsTable.grade,
      batteryHealth: productsTable.batteryHealth,
      cosmeticCondition: productsTable.cosmeticCondition,
      brandName: brands.name,
      categoryName: categories.name,
      categorySlug: categories.slug,
    }).from(productsTable)
      .leftJoin(brands, eq(productsTable.brandId, brands.id))
      .leftJoin(categories, eq(productsTable.categoryId, categories.id))
      .where(eq(productsTable.slug, slug))
      .limit(1);

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      price: Number(row.price),
      compareAtPrice: row.compareAtPrice ? Number(row.compareAtPrice) : null,
      discountPercent: row.discountPercent,
      condition: row.condition as Product["condition"],
      rating: Number(row.rating),
      reviewCount: row.reviewCount,
      stock: row.stock,
      warranty: row.warranty || "",
      thumbnail: row.thumbnail || "",
      videoUrl: row.videoUrl,
      brand: row.brandName || "",
      category: row.categoryName || "",
      categorySlug: row.categorySlug || "",
      isFeatured: row.isFeatured,
      isTrending: row.isTrending,
      specifications: (typeof row.specifications === "string" ? JSON.parse(row.specifications) : row.specifications || {}) as Record<string, string>,
      grade: row.grade || undefined,
      batteryHealth: row.batteryHealth || undefined,
      cosmeticCondition: row.cosmeticCondition || undefined,
    };
  } catch {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
}
