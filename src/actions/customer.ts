"use server";

import { z } from "zod";
import { hash, compare } from "bcryptjs";
import { db } from "@/lib/db";
import { users, wishlists } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createCustomerSession } from "@/lib/customer-session";

const SALT_ROUNDS = 12;

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function registerCustomer(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validated = registerSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { name, email, phone, password } = validated.data;

  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    return { error: "Email already registered" };
  }

  const hashedPassword = await hash(password, SALT_ROUNDS);

  const [newUser] = await db.insert(users).values({
    name,
    email,
    phone: phone || null,
    password: hashedPassword,
  }).returning();

  await db.insert(wishlists).values({ userId: newUser.id });

  await createCustomerSession(newUser.id, newUser.email, newUser.name);
  revalidatePath("/");
  revalidatePath("/account");
  return { success: true };
}
