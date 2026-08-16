import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { addresses } from "@drizzle/schema";
import { eq, and } from "drizzle-orm";
import { getCustomerSession } from "@/lib/customer-session";
import { revalidatePath } from "next/cache";

const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Valid phone is required"),
  address1: z.string().min(1, "Address line 1 is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP is required"),
  country: z.string().min(1, "Country is required"),
  type: z.enum(["home", "work", "other"]).default("home"),
  isDefault: z.boolean().default(false),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const validated = addressSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json({ error: validated.error.issues[0].message }, { status: 400 });
  }

  const data = validated.data;

  // If setting as default, unset other defaults
  if (data.isDefault) {
    await db.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, session.userId));
  }

  const [updated] = await db.update(addresses)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(and(eq(addresses.id, id), eq(addresses.userId, session.userId)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Address not found" }, { status: 404 });
  }

  revalidatePath("/account/addresses");
  return NextResponse.json({ success: true, address: updated });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const result = await db.delete(addresses).where(and(eq(addresses.id, id), eq(addresses.userId, session.userId)));

  revalidatePath("/account/addresses");
  return NextResponse.json({ success: true });
}