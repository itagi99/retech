"use server";

import { z } from "zod";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createCustomerSession } from "@/lib/customer-session";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function loginCustomer(formData: FormData) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validated = loginSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { email, password } = validated.data;

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || !user.password) {
    return { error: "Invalid email or password" };
  }

  const isValid = await compare(password, user.password);
  if (!isValid) {
    return { error: "Invalid email or password" };
  }

  await createCustomerSession(user.id, user.email, user.name);
  revalidatePath("/");
  revalidatePath("/account");
  return { success: true };
}