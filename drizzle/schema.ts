import {
  sqliteTable,
  text,
  integer,
  real,
  index,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const id = () => createId();

// Users / Customers
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => id()),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone"),
  image: text("image"),
  password: text("password"),
  emailVerified: text("email_verified"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Admin Users
export const adminUsers = sqliteTable("admin_users", {
  id: text("id").primaryKey().$defaultFn(() => id()),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "superadmin"] }).default("admin").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Categories
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey().$defaultFn(() => id()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  parentId: text("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Brands
export const brands = sqliteTable("brands", {
  id: text("id").primaryKey().$defaultFn(() => id()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  description: text("description"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Products
export const products = sqliteTable(
  "products",
  {
    id: text("id").primaryKey().$defaultFn(() => id()),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    shortDescription: text("short_description"),
    sku: text("sku").unique(),
    brandId: text("brand_id").references(() => brands.id),
    categoryId: text("category_id").references(() => categories.id).notNull(),
    condition: text("condition", { enum: ["new", "refurbished", "open_box", "used"] }).default("new").notNull(),
    grade: text("grade", { enum: ["A", "B", "C"] }),
    batteryHealth: integer("battery_health"),
    cosmeticCondition: text("cosmetic_condition"),
    testingStatus: text("testing_status"),
    price: text("price").notNull(),
    compareAtPrice: text("compare_at_price"),
    discountPercent: integer("discount_percent").default(0).notNull(),
    stock: integer("stock").default(0).notNull(),
    rating: text("rating").default("0"),
    reviewCount: integer("review_count").default(0).notNull(),
    warranty: text("warranty"),
    warrantyPeriod: text("warranty_period"),
    thumbnail: text("thumbnail"),
    videoUrl: text("video_url"),
    model3DUrl: text("model_3d_url"),
    isFeatured: integer("is_featured", { mode: "boolean" }).default(false).notNull(),
    isTrending: integer("is_trending", { mode: "boolean" }).default(false).notNull(),
    isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    specifications: text("specifications").$type<Record<string, string>>(),
    createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
    updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
  },
  (table) => ({
    slugIdx: index("products_slug_idx").on(table.slug),
    categoryIdx: index("products_category_idx").on(table.categoryId),
    brandIdx: index("products_brand_idx").on(table.brandId),
    featuredIdx: index("products_featured_idx").on(table.isFeatured),
    trendingIdx: index("products_trending_idx").on(table.isTrending),
  })
);

// Product Images
export const productImages = sqliteTable("product_images", {
  id: text("id").primaryKey().$defaultFn(() => id()),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  url: text("url").notNull(),
  alt: text("alt").notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Product Videos
export const productVideos = sqliteTable("product_videos", {
  id: text("id").primaryKey().$defaultFn(() => id()),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  url: text("url").notNull(),
  posterUrl: text("poster_url"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Product 3D Models
export const productModels = sqliteTable("product_models", {
  id: text("id").primaryKey().$defaultFn(() => id()),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  url: text("url").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Cart
export const carts = sqliteTable("carts", {
  id: text("id").primaryKey().$defaultFn(() => id()),
  userId: text("user_id").references(() => users.id),
  sessionId: text("session_id"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Cart Items
export const cartItems = sqliteTable("cart_items", {
  id: text("id").primaryKey().$defaultFn(() => id()),
  cartId: text("cart_id").references(() => carts.id, { onDelete: "cascade" }).notNull(),
  productId: text("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Wishlists
export const wishlists = sqliteTable("wishlists", {
  id: text("id").primaryKey().$defaultFn(() => id()),
  userId: text("user_id").references(() => users.id).notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Wishlist Items
export const wishlistItems = sqliteTable("wishlist_items", {
  id: text("id").primaryKey().$defaultFn(() => id()),
  wishlistId: text("wishlist_id").references(() => wishlists.id, { onDelete: "cascade" }).notNull(),
  productId: text("product_id").references(() => products.id).notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Addresses
export const addresses = sqliteTable("addresses", {
  id: text("id").primaryKey().$defaultFn(() => id()),
  userId: text("user_id").references(() => users.id).notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address1: text("address1").notNull(),
  address2: text("address2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").default("India").notNull(),
  isDefault: integer("is_default", { mode: "boolean" }).default(false).notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Orders
export const orders = sqliteTable(
  "orders",
  {
    id: text("id").primaryKey().$defaultFn(() => id()),
    userId: text("user_id").references(() => users.id),
    orderNumber: text("order_number").notNull().unique(),
    status: text("status", {
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"],
    }).default("pending").notNull(),
    paymentStatus: text("payment_status", {
      enum: ["pending", "paid", "failed", "refunded"],
    }).default("pending").notNull(),
    paymentMethod: text("payment_method"),
    paymentId: text("payment_id"),
    subtotal: text("subtotal").notNull(),
    discount: text("discount").default("0"),
    shipping: text("shipping").default("0"),
    tax: text("tax").default("0"),
    total: text("total").notNull(),
    shippingAddress: text("shipping_address").$type<Record<string, string>>().notNull(),
    trackingNumber: text("tracking_number"),
    notes: text("notes"),
    createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
    updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
  },
  (table) => ({
    userIdx: index("orders_user_idx").on(table.userId),
    statusIdx: index("orders_status_idx").on(table.status),
    orderNumberIdx: index("orders_order_number_idx").on(table.orderNumber),
  })
);

// Order Items
export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey().$defaultFn(() => id()),
  orderId: text("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  productId: text("product_id").references(() => products.id).notNull(),
  productName: text("product_name").notNull(),
  productImage: text("product_image"),
  price: text("price").notNull(),
  quantity: integer("quantity").notNull(),
  total: text("total").notNull(),
});

// Reviews
export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey().$defaultFn(() => id()),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  userId: text("user_id").references(() => users.id),
  userName: text("user_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false).notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Coupons
export const coupons = sqliteTable("coupons", {
  id: text("id").primaryKey().$defaultFn(() => id()),
  code: text("code").notNull().unique(),
  description: text("description"),
  discountType: text("discount_type", { enum: ["percentage", "fixed"] }).notNull(),
  discountValue: text("discount_value").notNull(),
  minPurchase: text("min_purchase"),
  maxDiscount: text("max_discount"),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").default(0).notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  startsAt: text("starts_at"),
  expiresAt: text("expires_at"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Banners
export const banners = sqliteTable("banners", {
  id: text("id").primaryKey().$defaultFn(() => id()),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  image: text("image").notNull(),
  link: text("link"),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Site Settings
export const siteSettings = sqliteTable("site_settings", {
  id: text("id").primaryKey().$defaultFn(() => id()),
  key: text("key").notNull().unique(),
  value: text("value").$type<Record<string, string>>(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  orders: many(orders),
  cart: many(carts),
  wishlist: many(wishlists),
  reviews: many(reviews),
}));

export const adminUsersRelations = relations(adminUsers, () => ({}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  products: many(products),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  images: many(productImages),
  videos: many(productVideos),
  models: many(productModels),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  reviews: many(reviews),
  wishlistItems: many(wishlistItems),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productVideosRelations = relations(productVideos, ({ one }) => ({
  product: one(products, {
    fields: [productVideos.productId],
    references: [products.id],
  }),
}));

export const productModelsRelations = relations(productModels, ({ one }) => ({
  product: one(products, {
    fields: [productModels.productId],
    references: [products.id],
  }),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const wishlistsRelations = relations(wishlists, ({ one, many }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
  items: many(wishlistItems),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  wishlist: one(wishlists, {
    fields: [wishlistItems.wishlistId],
    references: [wishlists.id],
  }),
  product: one(products, {
    fields: [wishlistItems.productId],
    references: [products.id],
  }),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));
