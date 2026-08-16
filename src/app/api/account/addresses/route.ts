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

export async function GET() {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userAddresses = await db.select().from(addresses).where(eq(addresses.userId, session.userId)).orderBy(addresses.createdAt);

  return NextResponse.json(userAddresses);
}

export async function POST(req: Request) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const [newAddress] = await db.insert(addresses).values({
    userId: session.userId,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }).returning();

  revalidatePath("/account/addresses");
  return NextResponse.json({ success: true, address: newAddress });
}