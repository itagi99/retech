import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SESSION_SECRET = process.env.CUSTOMER_SESSION_SECRET || "retech-customer-secret";
const SESSION_COOKIE_NAME = "retech-customer-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export interface CustomerSession {
  userId: string;
  email: string;
  name: string;
  phone?: string;
}

export async function createCustomerSession(userId: string, email: string, name: string) {
  const token = jwt.sign({ userId, email, name }, SESSION_SECRET, { expiresIn: "7d" });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, SESSION_SECRET) as CustomerSession;
    return decoded;
  } catch {
    return null;
  }
}

export async function deleteCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}
