"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, Loader2, Home, Building, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  type: "home" | "work" | "other";
}

export default function AccountAddressesClient({ initialAddresses }: { initialAddresses: Address[] }) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    type: "home" as "home" | "work" | "other",
    isDefault: false,
  });

  useEffect(() => {
    setAddresses(initialAddresses);
  }, [initialAddresses]);

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      type: "home",
      isDefault: false,
    });
    setEditingAddress(null);
  };

  const openModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        firstName: address.firstName,
        lastName: address.lastName,
        email: address.email,
        phone: address.phone,
        address1: address.address1,
        address2: address.address2 || "",
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        type: address.type,
        isDefault: address.isDefault,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(resetForm, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingAddress ? `/api/account/addresses/${editingAddress.id}` : "/api/account/addresses";
      const method = editingAddress ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(editingAddress ? "Address updated" : "Address added");
        closeModal();
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to save address");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        toast.success("Address deleted");
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      } else {
        toast.error(data.error || "Failed to delete address");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/account/addresses/${id}/default`, { method: "POST" });
      const data = await res.json();

      if (data.success) {
        toast.success("Default address updated");
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to update default");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (addresses.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Saved Addresses</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your shipping addresses</p>
          </div>
          <Button onClick={() => openModal()} className="gap-2"><Plus className="h-4 w-4" />Add Address</Button>
        </div>

        <div className="text-center py-16 rounded-2xl border border-border bg-card">
          <MapPin className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No saved addresses</h3>
          <p className="text-muted-foreground mb-6">Add an address for faster checkout</p>
          <Button onClick={() => openModal()} className="gap-2"><Plus className="h-4 w-4" />Add Your First Address</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Saved Addresses</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your shipping addresses for faster checkout</p>
        </div>
        <Button onClick={() => openModal()} className="gap-2"><Plus className="h-4 w-4" />Add New Address</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {addresses.map((address) => (
          <div key={address.id} className={cn(
            "rounded-2xl border p-4 transition-all relative",
            address.isDefault ? "border-primary bg-primary/5" : "border-border hover:border-primary/20"
          )}>
            {address.isDefault && (
              <div className="absolute -top-2 -right-2">
                <Badge variant="default" className="gap-1 bg-primary text-primary-foreground">
                  <CheckCircle2 className="h-3 w-3" /> Default
                </Badge>
              </div>
            )}

            <div className="flex items-start gap-3 mb-4">
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                address.type === "home" ? "bg-green-100 text-green-600" :
                address.type === "work" ? "bg-blue-100 text-blue-600" :
                "bg-purple-100 text-purple-600"
              )}>
                {address.type === "home" && <Home className="h-5 w-5" />}
                {address.type === "work" && <Building className="h-5 w-5" />}
                {address.type === "other" && <User className="h-5 w-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-sm truncate">{address.firstName} {address.lastName}</h3>
                  <Badge variant="outline" className="text-xs shrink-0 capitalize">{address.type}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{address.phone}</p>
              </div>
            </div>

            <address className="text-sm text-muted-foreground not-italic space-y-1 mb-4">
              <p className="font-medium text-foreground">{address.address1}</p>
              {address.address2 && <p>{address.address2}</p>}
              <p>{address.city}, {address.state} {address.zipCode}</p>
              <p>{address.country}</p>
            </address>

            <div className="flex items-center gap-2 pt-3 border-t border-border">
              {!address.isDefault && (
                <Button variant="ghost" size="sm" className="flex-1 gap-1" onClick={() => handleSetDefault(address.id)}>
                  <CheckCircle2 className="h-3.5 w-3.5" />Set Default
                </Button>
              )}
              <Button variant="ghost" size="sm" className="gap-1" onClick={() => openModal(address)}>
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(address.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={() => openModal()} className="gap-2"><Plus className="h-4 w-4" />Add Another Address</Button>
      </div>
    </div>
  );
}