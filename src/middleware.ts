import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession(request);

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin-login";
  const isCustomerRoute = pathname.startsWith("/account") || pathname.startsWith("/checkout");
  const isAdminLogin = pathname === "/admin-login";

  if (isAdminRoute) {
    if (!session || session.userType !== "admin") {
      const loginUrl = new URL("/admin-login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isAdminLogin && session?.userType === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isCustomerRoute) {
    if (!session || session.userType !== "customer") {
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
