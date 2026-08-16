"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { formatPriceFixed } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Cart ({totalItems})
          </h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <Button onClick={() => setIsOpen(false)} variant="outline">Continue Shopping</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
                  <div className="relative w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image && item.image.startsWith("http") ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                    ) : (
                      <ShoppingBag className="h-6 w-6 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug}`} onClick={() => setIsOpen(false)} className="text-sm font-medium line-clamp-1 hover:text-primary transition-colors">
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatPriceFixed(item.price)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-6 w-6 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-6 w-6 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatPriceFixed(totalPrice)}</span>
            </div>
            <Link href="/checkout" onClick={() => setIsOpen(false)} className="block">
              <Button className="w-full" size="lg">
                Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/cart" onClick={() => setIsOpen(false)} className="block text-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
