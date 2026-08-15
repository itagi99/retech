export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("retech-admin-session")?.value;
  
  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  const session = verifySession(token);
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({ authenticated: true, user: session });
}
