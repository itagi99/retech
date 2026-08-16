import { db, isDbAvailable } from "@/lib/db";
import { addresses } from "@drizzle/schema";
import { eq } from "drizzle-orm";
import { getCustomerSession } from "@/lib/customer-session";
import AccountAddressesClient from "@/components/account/addresses-client";

export default async function AccountAddressesPage() {
  const session = await getCustomerSession();
  if (!session) return null;

  if (!isDbAvailable()) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6">
        <p className="text-sm text-destructive font-medium">Database not configured</p>
        <p className="text-xs text-muted-foreground mt-1">Please set up Turso environment variables to manage addresses.</p>
      </div>
    );
  }

  const userAddresses = await db.select().from(addresses).where(eq(addresses.userId, session.userId)).orderBy(addresses.createdAt);

  return <AccountAddressesClient initialAddresses={userAddresses} />;
}