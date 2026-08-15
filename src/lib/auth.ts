import jwt from "jsonwebtoken";
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

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}

export function createSession(userId: string, userType: "admin" | "customer", email: string, name: string, role?: string): string {
  const payload: SessionPayload = { userId, userType, email, name, role };
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: "7d" });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, AUTH_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export function getSession(req: NextRequest): SessionPayload | null {
  const adminToken = req.cookies.get(ADMIN_COOKIE)?.value;
  const customerToken = req.cookies.get(CUSTOMER_COOKIE)?.value;

  const token = adminToken || customerToken;
  if (!token) return null;

  return verifySession(token);
}
