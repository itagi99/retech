import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-session";
import AccountSidebar from "@/components/account/account-sidebar";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      redirect("/login");
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar />
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Account layout error:", error);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6">
          <p className="text-sm text-destructive font-medium">Account Error</p>
          <p className="text-xs text-muted-foreground mt-1">
            Something went wrong while loading your account. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
