"use server";

import { z } from "zod";
import { compare, hash } from "bcryptjs";
import { db, isDbAvailable } from "@/lib/db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCustomerSession } from "@/lib/customer-session";

const SALT_ROUNDS = 12;

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords do not match",
  path: ["confirmNewPassword"],
});

export async function updateProfile(formData: FormData) {
  const session = await getCustomerSession();
  if (!session) return { error: "Please log in" };

  if (!isDbAvailable()) {
    return { error: "Database is not configured. Profile cannot be updated." };
  }

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
  };

  const validated = updateProfileSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const [updated] = await db.update(users).set({
    name: validated.data.name,
    email: validated.data.email,
    phone: validated.data.phone || null,
    updatedAt: new Date().toISOString(),
  }).where(eq(users.id, session.userId)).returning();

  revalidatePath("/account");
  return { success: true, user: { id: updated.id, name: updated.name, email: updated.email, phone: updated.phone } };
}

export async function changePassword(formData: FormData) {
  const session = await getCustomerSession();
  if (!session) return { error: "Please log in" };

  if (!isDbAvailable()) {
    return { error: "Database is not configured. Password cannot be changed." };
  }

  const raw = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmNewPassword: formData.get("confirmNewPassword") as string,
  };

  const validated = changePasswordSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  if (!user || !user.password) {
    return { error: "User not found" };
  }

  const isValid = await compare(validated.data.currentPassword, user.password);
  if (!isValid) {
    return { error: "Current password is incorrect" };
  }

  const hashedPassword = await hash(validated.data.newPassword, SALT_ROUNDS);
  await db.update(users).set({ password: hashedPassword, updatedAt: new Date().toISOString() }).where(eq(users.id, session.userId));
  revalidatePath("/account");
  return { success: true };
}
