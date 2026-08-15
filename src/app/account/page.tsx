export const dynamic = 'force-dynamic';

import { getCustomerSession } from "@/lib/customer-session";
import { updateProfile, changePassword } from "@/actions/profile";
import AccountSidebar from "@/components/account/account-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { revalidatePath } from "next/cache";

async function getUserData() {
  const session = await getCustomerSession();
  if (!session) return null;
  return session;
}

export default async function AccountProfilePage() {
  const user = await getUserData();
  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your personal information</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <h2 className="text-lg font-semibold">Edit Profile</h2>
        <form action={async (formData) => {
          "use server";
          const result = await updateProfile(formData);
          if (result.success) {
            revalidatePath("/account");
          }
        }} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Full Name</label>
            <Input name="name" defaultValue={user.name} required />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <Input type="email" name="email" defaultValue={user.email} required />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Phone</label>
            <Input type="tel" name="phone" defaultValue={user.phone || ""} />
          </div>
          <div className="flex items-center gap-4">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <form action={async (formData) => {
          "use server";
          const result = await changePassword(formData);
          if (result.success) {
            revalidatePath("/account");
          }
        }} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Current Password</label>
            <Input type="password" name="currentPassword" required />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">New Password</label>
            <Input type="password" name="newPassword" required />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Confirm New Password</label>
            <Input type="password" name="confirmNewPassword" required />
          </div>
          <Button type="submit">Update Password</Button>
        </form>
      </div>
    </div>
  );
}
