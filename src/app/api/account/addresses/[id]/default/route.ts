import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { addresses } from "@drizzle/schema";
import { eq, and } from "drizzle-orm";
import { getCustomerSession } from "@/lib/customer-session";
import { revalidatePath } from "next/cache";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Unset all defaults for this user
  await db.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, session.userId));

  // Set the selected address as default
  const [updated] = await db.update(addresses)
    .set({ isDefault: true, updatedAt: new Date().toISOString() })
    .where(and(eq(addresses.id, id), eq(addresses.userId, session.userId)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Address not found" }, { status: 404 });
  }

  revalidatePath("/account/addresses");
  return NextResponse.json({ success: true, address: updated });
}