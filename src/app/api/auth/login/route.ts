export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { adminUsers } from "@drizzle/schema";
import { eq } from "drizzle-orm";
import { hashPassword, comparePassword, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { db } = await import("@/lib/db");
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const admin = await db.select().from(adminUsers).where(eq(adminUsers.email, email.toLowerCase())).limit(1);

    if (!admin.length) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValid = await comparePassword(password, admin[0].password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = createSession(admin[0].id, "admin", admin[0].email, admin[0].name, admin[0].role);

    const response = NextResponse.json({ success: true, redirect: "/admin" });
    response.cookies.set("retech-admin-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
