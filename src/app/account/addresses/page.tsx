import { db } from "@/lib/db";
import { addresses } from "@drizzle/schema";
import { eq } from "drizzle-orm";
import { getCustomerSession } from "@/lib/customer-session";
import AccountAddressesClient from "@/components/account/addresses-client";

export default async function AccountAddressesPage() {
  const session = await getCustomerSession();
  if (!session) return null;

  const userAddresses = await db.select().from(addresses).where(eq(addresses.userId, session.userId)).orderBy(addresses.createdAt);

  return <AccountAddressesClient initialAddresses={userAddresses} />;
}