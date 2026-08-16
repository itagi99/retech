"use client";

import { useState } from "react";
import { CreditCard, Plus, Trash2, Loader2, Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  type: "card" | "upi" | "wallet";
  last4: string;
  brand: string;
  expiry: string;
  isDefault: boolean;
}

export default function AccountPaymentsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([
    { id: "1", type: "card", last4: "4242", brand: "Visa", expiry: "12/27", isDefault: true },
    { id: "2", type: "card", last4: "5555", brand: "Mastercard", expiry: "08/26", isDefault: false },
    { id: "3", type: "upi", last4: "okhdfc", brand: "UPI", expiry: "", isDefault: false },
  ]);
  const [addingMethod, setAddingMethod] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  const handleAddMethod = async (type: "card" | "upi") => {
    setAddingMethod(true);
    await new Promise(r => setTimeout(r, 1000));
    setAddingMethod(false);
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type,
      last4: type === "card" ? "1234" : "newupi",
      brand: type === "card" ? "Visa" : "UPI",
      expiry: type === "card" ? "12/28" : "",
      isDefault: methods.length === 0,
    };
    setMethods(prev => [...prev, newMethod]);
    toast.success(`${type === "card" ? "Card" : "UPI"} added successfully`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this payment method?")) return;
    setDeletingId(id);
    await new Promise(r => setTimeout(r, 500));
    setMethods(prev => prev.filter(m => m.id !== id));
    setDeletingId(null);
    toast.success("Payment method removed");
  };

  const handleSetDefault = async (id: string) => {
    setSettingDefaultId(id);
    await new Promise(r => setTimeout(r, 400));
    setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
    setSettingDefaultId(null);
    toast.success("Default payment method updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payment Methods</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your saved payment methods</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleAddMethod("upi")} className="gap-2" disabled={addingMethod}>
            <Plus className="h-4 w-4" /> Add UPI
          </Button>
          <Button onClick={() => handleAddMethod("card")} className="gap-2" disabled={addingMethod}>
            <Plus className="h-4 w-4" /> Add Card
          </Button>
        </div>
      </div>

      {/* Saved Methods */}
      <div className="rounded-xl border border-border bg-card">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Saved Methods ({methods.length})</h2>
        </div>
        <div className="divide-y divide-border">
          {methods.map((method) => (
            <div key={method.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                  method.type === "card" ? "bg-blue-100 text-blue-600" :
                  method.type === "upi" ? "bg-green-100 text-green-600" :
                  "bg-purple-100 text-purple-600"
                }`}>
                  {method.type === "card" && <CreditCard className="h-6 w-6" />}
                  {method.type === "upi" && <Shield className="h-6 w-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium capitalize">{method.brand}</h3>
                    {method.isDefault && <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">Default</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {method.type === "card" ? `•••• ${method.last4} • Exp ${method.expiry}` : `UPI: ${method.last4}@${method.brand}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!method.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetDefault(method.id)}
                    disabled={settingDefaultId === method.id}
                    className="gap-1"
                  >
                    {settingDefaultId === method.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Set Default"}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(method.id)}
                  disabled={deletingId === method.id}
                >
                  {deletingId === method.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Note */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium">Secure Payments</h3>
            <p className="text-sm text-muted-foreground">Your payment details are encrypted and stored securely. We never store full card numbers.</p>
          </div>
        </div>
      </div>

      {/* Add New Card Modal Placeholder */}
      {addingMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-background rounded-2xl p-6 w-full max-w-md animate-slide-in-up">
            <h2 className="text-xl font-bold mb-4">Add Payment Method</h2>
            <p className="text-muted-foreground mb-6">In a real app, this would open a secure payment form (Stripe/Razorpay)</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setAddingMethod(false)}>Cancel</Button>
              <Button onClick={() => setAddingMethod(false)}>Continue to Payment Gateway</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}