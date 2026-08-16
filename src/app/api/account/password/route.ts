import { NextResponse } from "next/server";
import { z } from "zod";
import { compare, hash } from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@drizzle/schema";
import { eq } from "drizzle-orm";
import { getCustomerSession } from "@/lib/customer-session";
import { revalidatePath } from "next/cache";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords do not match",
  path: ["confirmNewPassword"],
});

export async function POST(req: Request) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const raw = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmNewPassword: formData.get("confirmNewPassword") as string,
  };

  const validated = changePasswordSchema.safeParse(raw);
  if (!validated.success) {
    return NextResponse.json({ error: validated.error.issues[0].message }, { status: 400 });
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  if (!user || !user.password) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isValid = await compare(validated.data.currentPassword, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  const hashedPassword = await hash(validated.data.newPassword, 12);
  await db.update(users).set({ password: hashedPassword, updatedAt: new Date().toISOString() }).where(eq(users.id, session.userId));

  revalidatePath("/account");
  return NextResponse.json({ success: true });
}