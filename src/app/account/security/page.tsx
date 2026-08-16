"use client";

import { useState } from "react";
import { Toggle, Shield, Bell, Smartphone, Mail, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AccountSecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggle = async (key: string, currentValue: boolean, setter: (v: boolean) => void) => {
    setLoading(key);
    setter(!currentValue);
    // In real app, call API to update settings
    await new Promise(r => setTimeout(r, 500));
    setLoading(null);
    toast.success(`${key} ${!currentValue ? "enabled" : "disabled"}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Security</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account security settings</p>
      </div>

      {/* Two-Factor Authentication */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Two-Factor Authentication (2FA)
        </h2>
        <p className="text-sm text-muted-foreground mb-6">Add an extra layer of security to your account</p>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Authenticator App</h3>
            <p className="text-sm text-muted-foreground">Use Google Authenticator, Authy, or similar</p>
          </div>
          <Button
            variant={twoFactorEnabled ? "default" : "outline"}
            className="gap-2"
            onClick={() => handleToggle("2FA", twoFactorEnabled, setTwoFactorEnabled)}
            disabled={loading === "2FA"}
          >
            {loading === "2FA" ? <Loader2 className="h-4 w-4 animate-spin" /> : twoFactorEnabled ? <Check className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
            {twoFactorEnabled ? "Enabled" : "Enable 2FA"}
          </Button>
        </div>

        {twoFactorEnabled && (
          <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm text-green-800">2FA is enabled. You'll need to enter a code from your authenticator app when signing in.</p>
            <Button variant="ghost" size="sm" className="mt-2">View Backup Codes</Button>
          </div>
        )}
      </div>

      {/* Login Alerts */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Login Alerts
        </h2>
        <p className="text-sm text-muted-foreground mb-4">Get notified when someone logs into your account</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">New Device Login</h3>
              <p className="text-sm text-muted-foreground">Email alert when a new device signs in</p>
            </div>
            <button
              onClick={() => handleToggle("newDevice", loginAlerts, setLoginAlerts)}
              disabled={loading === "newDevice"}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                loginAlerts ? "bg-primary" : "bg-muted"
              }`}
              role="switch"
              aria-checked={loginAlerts}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  loginAlerts ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Sessions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          Active Sessions
        </h2>
        <p className="text-sm text-muted-foreground mb-4">Manage devices logged into your account</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Current Device</h4>
                <p className="text-sm text-muted-foreground">Chrome on Windows • Active now</p>
              </div>
            </div>
            <Badge variant="success" className="capitalize">Current</Badge>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">iPhone 15 Pro</h4>
                <p className="text-sm text-muted-foreground">Safari on iOS • 2 hours ago</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-destructive">Revoke</Button>
          </div>
        </div>
        <Button variant="outline" className="mt-4 w-full">Revoke All Other Sessions</Button>
      </div>
    </div>
  );
}