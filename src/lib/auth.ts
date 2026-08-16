import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { hash, compare } from "bcryptjs";

const SALT_ROUNDS = 12;
const AUTH_SECRET = process.env.AUTH_SECRET || "fallback-secret-key";

const ADMIN_COOKIE = "retech-admin-session";
const CUSTOMER_COOKIE = "retech-customer-session";

export interface SessionPayload {
  userId: string;
  userType: "admin" | "customer";
  email: string;
  name: string;
  role?: string;
}

function getSecretKey() {
  return new TextEncoder().encode(AUTH_SECRET);
}

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}

export async function createSession(userId: string, userType: "admin" | "customer", email: string, name: string, role?: string): Promise<string> {
  const payload: SessionPayload = { userId, userType, email, name, role };
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(req: NextRequest): Promise<SessionPayload | null> {
  const adminToken = req.cookies.get(ADMIN_COOKIE)?.value;
  const customerToken = req.cookies.get(CUSTOMER_COOKIE)?.value;

  const token = adminToken || customerToken;
  if (!token) return null;

  return verifySession(token);
}
