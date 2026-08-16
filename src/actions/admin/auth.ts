import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { adminUsers } from "@drizzle/schema";
import { eq } from "drizzle-orm";
import {
  createSession,
  verifySession,
  hashPassword,
  comparePassword,
  type SessionPayload,
} from "@/lib/auth";

const ADMIN_COOKIE = "retech-admin-session";

async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function loginAdmin(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const admin = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);

  if (!admin.length) {
    return { error: "Invalid email or password" };
  }

  const isValid = await comparePassword(password, admin[0].password);
  if (!isValid) {
    return { error: "Invalid email or password" };
  }

  const token = await createSession(admin[0].id, "admin", admin[0].email, admin[0].name, admin[0].role);

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin/login");
}

export async function getCurrentAdmin() {
  return getSession();
}
