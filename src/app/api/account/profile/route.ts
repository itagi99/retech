import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@drizzle/schema";
import { eq } from "drizzle-orm";
import { getCustomerSession } from "@/lib/customer-session";
import { revalidatePath } from "next/cache";

const updateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
  };

  const validated = updateSchema.safeParse(raw);
  if (!validated.success) {
    return NextResponse.json({ error: validated.error.issues[0].message }, { status: 400 });
  }

  const { name, email, phone } = validated.data;

  // Check if email is already taken by another user
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing && existing.id !== session.userId) {
    return NextResponse.json({ error: "Email already in use" }, { status: 400 });
  }

  await db.update(users).set({
    name,
    email,
    phone: phone || null,
    updatedAt: new Date().toISOString(),
  }).where(eq(users.id, session.userId));

  revalidatePath("/account");
  return NextResponse.json({ success: true });
}