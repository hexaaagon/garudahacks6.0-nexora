import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (process.env.NODE_ENV === "development") {
    console.log("🛡️ Auth Middleware:", pathname);
  }

  // Skip auth for public routes and API routes
  const publicRoutes = [
    "/",
    "/auth/sign-in",
    "/auth/sign-out",
    "/unauthorized",
    "/api",
  ];

  const isPublicRoute = publicRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith("/auth/") ||
      pathname.startsWith("/api/")
  );

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
      },
    }
  );

  // Handle protected routes
  if (!isPublicRoute) {
    // Redirect unauthenticated users to sign-in
    if (!session) {
      const signInUrl = new URL("/auth/sign-in", request.url);
      return NextResponse.redirect(signInUrl);
    }

    // For authenticated users, let the layouts handle detailed role checks
    // This prevents the heavy database operations in middleware
  }

  // Handle public routes with authenticated users (redirect from home if logged in)
  if (pathname === "/" && session) {
    // For now, redirect to setup - layouts will handle proper role-based redirects
    const setupUrl = new URL("/setup", request.url);
    return NextResponse.redirect(setupUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|api|_next/image|favicon.ico|sitemap.xml|robots.txt|images/).*)",
  ],
};
