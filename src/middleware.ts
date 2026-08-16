import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_SECRET = process.env.AUTH_SECRET || "fallback-secret-key";
const CUSTOMER_SECRET = process.env.CUSTOMER_SESSION_SECRET || "retech-customer-secret";

const ADMIN_COOKIE = "retech-admin-session";
const CUSTOMER_COOKIE = "retech-customer-session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin-login";
  const isCustomerRoute = pathname.startsWith("/account") || pathname.startsWith("/checkout");
  const isAdminLogin = pathname === "/admin-login";

  if (isAdminRoute) {
    const adminToken = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
    try {
      const { payload } = await jwtVerify(adminToken, new TextEncoder().encode(AUTH_SECRET));
      if (payload.userType !== "admin") {
        return NextResponse.redirect(new URL("/admin-login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
  }

  if (isAdminLogin) {
    const adminToken = request.cookies.get(ADMIN_COOKIE)?.value;
    if (adminToken) {
      try {
        const { payload } = await jwtVerify(adminToken, new TextEncoder().encode(AUTH_SECRET));
        if (payload.userType === "admin") {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      } catch {}
    }
  }

  if (isCustomerRoute) {
    const customerToken = request.cookies.get(CUSTOMER_COOKIE)?.value;
    if (!customerToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    try {
      await jwtVerify(customerToken, new TextEncoder().encode(CUSTOMER_SECRET));
    } catch {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*"],
};
