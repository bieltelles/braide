import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin pages and admin API routes
  if (pathname.startsWith("/admin") || isAdminApi(pathname)) {
    const adminSecret = process.env.ADMIN_SECRET;

    // If no ADMIN_SECRET is set, allow access (dev mode)
    if (!adminSecret) {
      return NextResponse.next();
    }

    // Check for admin cookie
    const adminCookie = request.cookies.get("admin-token")?.value;
    if (adminCookie === adminSecret) {
      return NextResponse.next();
    }

    // For API routes, return 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For admin pages, redirect to login
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

function isAdminApi(pathname: string): boolean {
  const adminApis = ["/api/upload", "/api/events", "/api/downloads", "/api/suggestions"];
  // Only protect write operations (POST/PATCH/DELETE are handled by method check in routes)
  // But middleware can't check method, so we protect all admin API access
  // GET requests that are public (like /api/downloads for the public page) are handled separately
  return false; // Don't block APIs via middleware - let route handlers decide
}

export const config = {
  matcher: ["/admin/:path*"],
};
