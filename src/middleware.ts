import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    // In production, validate session cookie for admin access
    // For now, set a header to signal admin context
    const response = NextResponse.next();
    response.headers.set("x-admin-protected", "true");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
