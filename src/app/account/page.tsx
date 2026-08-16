"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Eye, EyeOff, Loader2, Check, AlertCircle, Shield, Smartphone, Mail, Bell, Save, User, Edit2, Trash2 } from "lucide-react";
import { updateProfile, changePassword } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AccountProfilePage({ user }: { user: { name: string; email: string; phone: string | null } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "security">("profile");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/account/profile", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated successfully");
        router.refresh();
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmNewPassword") as string;
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Password changed successfully");
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(data.error || "Failed to change password");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <nav className="flex border-b border-border" role="tablist">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "password", label: "Password", icon: Shield },
            { id: "security", label: "Security", icon: Smartphone },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
                    {initials}
                  </div>
                  <label className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg">
                    <Camera className="h-5 w-5" />
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Profile Photo</h3>
                  <p className="text-sm text-muted-foreground">JPG, PNG or WebP. Max 5MB.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                  <Input name="name" defaultValue={user.name} required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <Input type="email" name="email" defaultValue={user.email} required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
                <Input type="tel" name="phone" defaultValue={user.phone || ""} placeholder="+91 98765 43210" />
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  <Save className="h-4 w-4" />
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
              <div className="p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Password Requirements</p>
                    <p className="text-sm text-muted-foreground">At least 6 characters. Use a mix of letters, numbers & symbols.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Current Password</label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">New Password</label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Confirm New Password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmNewPassword"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
                <Save className="h-4 w-4" />
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}
              </Button>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6 max-w-2xl">
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Smartphone className="h-4 w-4" />
                    Enable 2FA
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Order updates, promotions, and security alerts</p>
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Bell className="h-4 w-4" />
                    Manage
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Login Activity</h4>
                      <p className="text-sm text-muted-foreground">View recent login sessions and devices</p>
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Edit2 className="h-4 w-4" />
                    View Sessions
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-destructive">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                  </div>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}