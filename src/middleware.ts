import { auth } from "@/services/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const publicRoutes = [
  "/login",
  "/api/auth/callback/google",
  "api/auth/error",
];

export async function middleware(request: NextRequest) {
  const session = await auth();

  if (process.env.DEBUG_AUTH === "true") {
    console.log(`\x1b[32m[MIDDLEWARE] session\x1b[0m`, session);
    console.log(
      `\x1b[32m[MIDDLEWARE] request.nextUrl.pathname\x1b[0m`,
      request.nextUrl.pathname,
    );
  }

  if (!session && !publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
