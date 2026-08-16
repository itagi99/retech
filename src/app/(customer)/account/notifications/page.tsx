"use client";

import { useState } from "react";
import { Bell, Mail, Smartphone, Loader2, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AccountNotificationsPage() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [priceDrops, setPriceDrops] = useState(true);
  const [backInStock, setBackInStock] = useState(true);
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggle = async (key: string, currentValue: boolean, setter: (v: boolean) => void) => {
    setLoading(key);
    setter(!currentValue);
    await new Promise(r => setTimeout(r, 400));
    setLoading(null);
    toast.success(`${key} ${!currentValue ? "enabled" : "disabled"}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage how you receive updates from ReTech</p>
      </div>

      {/* Channel Preferences */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notification Channels
        </h2>
        <p className="text-sm text-muted-foreground mb-6">Choose how you want to be notified</p>

        <div className="space-y-4">
          {[
            { key: "email", label: "Email", desc: "Receive notifications via email", enabled: emailEnabled, setEnabled: setEmailEnabled, icon: Mail },
            { key: "push", label: "Push Notifications", desc: "Receive push notifications on your devices", enabled: pushEnabled, setEnabled: setPushEnabled, icon: Smartphone },
            { key: "sms", label: "SMS", desc: "Receive SMS for important updates", enabled: smsEnabled, setEnabled: setSmsEnabled, icon: Smartphone },
          ].map(({ key, label, desc, enabled, setEnabled, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{label}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(key, enabled, setEnabled)}
                disabled={loading === key}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  enabled ? "bg-primary" : "bg-muted"
                }`}
                role="switch"
                aria-checked={enabled}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Types */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <RotateCcw className="h-5 w-5 text-primary" />
          What to Notify About
        </h2>
        <p className="text-sm text-muted-foreground mb-6">Choose which events trigger notifications</p>

        <div className="space-y-4">
          {[
            { key: "orderUpdates", label: "Order Updates", desc: "Order confirmation, shipping, delivery", enabled: orderUpdates, setEnabled: setOrderUpdates },
            { key: "promotions", label: "Promotions & Deals", desc: "Sales, coupons, special offers", enabled: promotions, setEnabled: setPromotions },
            { key: "priceDrops", label: "Price Drops", desc: "When saved items go on sale", enabled: priceDrops, setEnabled: setPriceDrops },
            { key: "backInStock", label: "Back in Stock", desc: "When wishlist items are available", enabled: backInStock, setEnabled: setBackInStock },
          ].map(({ key, label, desc, enabled, setEnabled }) => (
            <div key={key} className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <h3 className="font-medium">{label}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
              <button
                onClick={() => handleToggle(key, enabled, setEnabled)}
                disabled={loading === key}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  enabled ? "bg-primary" : "bg-muted"
                }`}
                role="switch"
                aria-checked={enabled}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Frequency
        </h2>
        <p className="text-sm text-muted-foreground mb-4">How often to receive promotional emails</p>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { value: "instant", label: "Instant", desc: "As they happen" },
            { value: "daily", label: "Daily Digest", desc: "Once per day summary" },
            { value: "weekly", label: "Weekly Digest", desc: "Once per week summary" },
          ].map(({ value, label, desc }) => (
            <button
              key={value}
              className={`p-4 rounded-xl border-2 text-left transition-colors ${
                value === "daily" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <h3 className="font-medium">{label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}