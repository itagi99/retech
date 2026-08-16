"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, CreditCard, Truck, User, MapPin, CheckCircle2, Package } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatPrice, formatPriceFixed } from "@/lib/utils";

type Step = "information" | "shipping" | "method" | "payment" | "review";

const steps: { key: Step; label: string; icon: typeof User }[] = [
  { key: "information", label: "Information", icon: User },
  { key: "shipping", label: "Shipping", icon: MapPin },
  { key: "method", label: "Method", icon: Truck },
  { key: "payment", label: "Payment", icon: CreditCard },
  { key: "review", label: "Review", icon: Package },
];

const shippingMethods = [
  { id: "standard", name: "Standard Shipping", price: 9.99, days: "5-7 business days" },
  { id: "express", name: "Express Shipping", price: 19.99, days: "2-3 business days" },
  { id: "overnight", name: "Overnight Shipping", price: 39.99, days: "1 business day" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<Step>("information");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    shippingMethod: "standard",
    paymentMethod: "card",
  });

  const subtotal = totalPrice;
  const discount = 0;
  const shippingCost = shippingMethods.find((m) => m.id === formData.shippingMethod)?.price || 0;
  const tax = subtotal * 0.08;
  const total = subtotal - discount + shippingCost + tax;

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  if (items.length === 0) {
    return null;
  }

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const handleNext = () => {
    if (currentStep === "review") return;
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].key);
    }
  };

  const handleBack = () => {
    if (currentStep === "information") return;
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const payload = new FormData();
    payload.set("shippingAddress", JSON.stringify({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address1: formData.address1,
      address2: formData.address2,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      country: formData.country,
    }));
    payload.set("shippingMethod", formData.shippingMethod);
    payload.set("subtotal", subtotal.toString());
    payload.set("discount", discount.toString());
    payload.set("shipping", shippingCost.toString());
    payload.set("tax", tax.toString());
    payload.set("total", total.toString());
    payload.set("paymentMethod", formData.paymentMethod);
    payload.set("paymentId", "demo_payment_" + Date.now());
    payload.set("items", JSON.stringify(items.map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    }))));

    try {
      const response = await fetch("/actions/orders", {
        method: "POST",
        body: payload,
      });

      const result = await response.json();

      if (result.error) {
        alert(result.error);
        setIsSubmitting(false);
        return;
      }

      if (response.redirected) {
        router.push(response.url);
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center gap-2">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-semibold transition-colors",
                  index <= currentStepIndex ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"
                )}>
                  {index < currentStepIndex ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                </div>
                <span className={cn("hidden sm:block text-sm font-medium", index <= currentStepIndex ? "text-foreground" : "text-muted-foreground")}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            {currentStep === "information" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Customer Information</h2>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                  <Input value={formData.name} onChange={(e) => updateField("name", e.target.value)} placeholder="John Doe" required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <Input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="john@example.com" required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Phone</label>
                  <Input type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+1 234 567 8900" required />
                </div>
              </div>
            )}

            {currentStep === "shipping" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Shipping Address</h2>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Address Line 1</label>
                  <Input value={formData.address1} onChange={(e) => updateField("address1", e.target.value)} placeholder="123 Main Street" required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Address Line 2</label>
                  <Input value={formData.address2} onChange={(e) => updateField("address2", e.target.value)} placeholder="Apt 4B" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">City</label>
                    <Input value={formData.city} onChange={(e) => updateField("city", e.target.value)} placeholder="New York" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">State</label>
                    <Input value={formData.state} onChange={(e) => updateField("state", e.target.value)} placeholder="NY" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">ZIP Code</label>
                    <Input value={formData.zip} onChange={(e) => updateField("zip", e.target.value)} placeholder="10001" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Country</label>
                    <Input value={formData.country} onChange={(e) => updateField("country", e.target.value)} required />
                  </div>
                </div>
              </div>
            )}

            {currentStep === "method" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Shipping Method</h2>
                {shippingMethods.map((method) => (
                  <label key={method.id} className={cn("flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors", formData.shippingMethod === method.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30")}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shippingMethod" value={method.id} checked={formData.shippingMethod === method.id} onChange={() => updateField("shippingMethod", method.id)} className="h-4 w-4 accent-primary" />
                      <div>
                        <p className="font-medium text-sm">{method.name}</p>
                        <p className="text-xs text-muted-foreground">{method.days}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-sm">{formatPriceFixed(method.price)}</span>
                  </label>
                ))}
              </div>
            )}

            {currentStep === "payment" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Payment Method</h2>
                <p className="text-sm text-muted-foreground">This is a demo checkout. No real payment will be processed.</p>
                <label className={cn("flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors", formData.paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30")}>
                  <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === "card"} onChange={() => updateField("paymentMethod", "card")} className="h-4 w-4 accent-primary" />
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Credit / Debit Card</p>
                    <p className="text-xs text-muted-foreground">Demo mode - Razorpay/Stripe placeholder</p>
                  </div>
                </label>
              </div>
            )}

            {currentStep === "review" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Review Order</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Contact</h3>
                    <p className="text-sm">{formData.name} - {formData.email} - {formData.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Shipping Address</h3>
                    <p className="text-sm">{formData.address1}, {formData.address2 && `${formData.address2}, `}{formData.city}, {formData.state} {formData.zip}, {formData.country}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Shipping Method</h3>
                    <p className="text-sm">{shippingMethods.find((m) => m.id === formData.shippingMethod)?.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Payment</h3>
                    <p className="text-sm">Credit / Debit Card (Demo)</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === "information"}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {currentStep !== "review" ? (
                <Button onClick={handleNext}>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Place Order"}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4 sticky top-24">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-600/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <Package className="h-5 w-5 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPriceFixed(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{shippingCost === 0 ? "Free" : formatPriceFixed(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="font-medium">{formatPriceFixed(tax)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatPriceFixed(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
