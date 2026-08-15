"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingBag, Save, ArrowRight, Tag, Truck, Percent } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const [savedItems, setSavedItems] = useState<typeof items>([]);
  const [couponCode, setCouponCode] = useState("");

  const subtotal = totalPrice;
  const discount = 0;
  const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 49.99) : 0;
  const tax = subtotal * 0.08;
  const grandTotal = subtotal - discount + shipping + tax;

  const handleSaveForLater = (item: typeof items[0]) => {
    setSavedItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
    removeItem(item.id);
  };

  const handleMoveToCart = (item: typeof items[0]) => {
    setSavedItems((prev) => prev.filter((i) => i.id !== item.id));
    updateQuantity(item.id, item.quantity);
  };

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6 text-center">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/products">
          <Button size="lg">
            Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {items.length > 0 && (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border bg-card">
                  <div className="relative w-full sm:w-24 h-48 sm:h-24 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-600/10 flex items-center justify-center overflow-hidden shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <ShoppingBag className="h-8 w-8 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={`/products/${item.slug}`} className="font-semibold text-sm sm:text-base hover:text-primary transition-colors line-clamp-2">
                          {item.name}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">${item.price.toLocaleString()}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground" onClick={() => handleSaveForLater(item)}>
                        <Save className="h-3 w-3" /> Save for later
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {savedItems.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-border">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Save className="h-4 w-4" /> Saved for later
              </h2>
              {savedItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border bg-muted/30">
                  <div className="relative w-full sm:w-24 h-48 sm:h-24 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-600/10 flex items-center justify-center overflow-hidden shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <ShoppingBag className="h-8 w-8 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug}`} className="font-semibold text-sm hover:text-primary transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">${item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => handleMoveToCart(item)}>
                        Move to Cart
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setSavedItems((prev) => prev.filter((i) => i.id !== item.id))}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1"><Percent className="h-3 w-3" /> Discount</span>
                <span className="font-medium text-green-600">-${discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1"><Truck className="h-3 w-3" /> Shipping</span>
                <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1"><Tag className="h-3 w-3" /> Tax (8%)</span>
                <span className="font-medium">${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between text-base font-semibold">
                <span>Grand Total</span>
                <span>${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="text-sm font-medium mb-2 block">Coupon Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon"
                  className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button variant="outline" size="sm" className="shrink-0">Apply</Button>
              </div>
            </div>

            <Link href="/checkout" className="block">
              <Button className="w-full" size="lg" disabled={items.length === 0}>
                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/products" className={cn("block text-center text-sm font-medium hover:text-primary transition-colors", items.length === 0 && "pointer-events-none opacity-50")}>
              Continue Shopping
            </Link>
          </div>

          {subtotal > 0 && subtotal < 500 && (
            <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              Add <span className="font-semibold text-foreground">${(500 - subtotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> more for free shipping!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
