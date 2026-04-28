import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAINTENANCE_MODE = true;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Maintenance mode: redirect all public traffic to /manutencao
  if (MAINTENANCE_MODE) {
    const isExempt =
      pathname.startsWith("/manutencao") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/images/") ||
      pathname === "/favicon.ico" ||
      pathname === "/manifest.json" ||
      pathname === "/robots.txt" ||
      pathname === "/sitemap.xml";

    if (!isExempt) {
      return NextResponse.redirect(new URL("/manutencao", request.url));
    }
  }

  // Protect admin pages
  if (pathname.startsWith("/admin")) {
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret) {
      return NextResponse.next();
    }

    const adminCookie = request.cookies.get("admin-token")?.value;
    if (adminCookie === adminSecret) {
      return NextResponse.next();
    }

    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
