import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    // In production, check for auth session cookie
    // For now, allow access (auth check will be done at component level)
    const response = NextResponse.next();
    response.headers.set("x-admin-protected", "true");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
