import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { createServiceServer } from "@nexora/database/supabase";
import { auth } from "../auth";

export type UserRole = "student" | "teacher";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole | null;
}

export async function getAuthenticatedUser(
  request: NextRequest
): Promise<AuthUser | null> {
  try {
    const sessionCookie = getSessionCookie(request);

    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Middleware Debug - Auth check:", {
        path: request.nextUrl.pathname,
        user: sessionCookie,
      });
    }

    if (!sessionCookie) {
      return null;
    }

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const user = session?.user!;
    const supabase = createServiceServer();

    const { data: studentData, error: studentError } = await supabase
      .from("students")
      .select("id")
      .eq("id", user.id)
      .single();

    if (
      process.env.NODE_ENV === "development" &&
      studentError &&
      studentError.code !== "PGRST116"
    ) {
      console.log("🔍 Student query error:", studentError);
    }

    if (studentData) {
      if (process.env.NODE_ENV === "development") {
        console.log("👨‍🎓 User is a student:", user.email);
      }
      return {
        id: user.id,
        email: user.email,
        role: "student",
      };
    }

    const { data: teacherData, error: teacherError } = await supabase
      .from("teachers")
      .select("id")
      .eq("id", user.id)
      .single();

    if (
      process.env.NODE_ENV === "development" &&
      teacherError &&
      teacherError.code !== "PGRST116"
    ) {
      console.log("🔍 Teacher query error:", teacherError);
    }

    if (teacherData) {
      if (process.env.NODE_ENV === "development") {
        console.log("👨‍🏫 User is a teacher:", user.email);
      }
      return {
        id: user.id,
        email: user.email,
        role: "teacher",
      };
    }

    if (process.env.NODE_ENV === "development") {
      console.log("❌ User has no role assigned:", user.email);
    }

    return {
      id: user.id,
      email: user.email,
      role: null,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("🚨 Middleware auth error:", error);
    }
    return null;
  }
}

export function requiresAuth(pathname: string): boolean {
  const protectedPaths = ["/student", "/teacher"];
  return protectedPaths.some((path) => pathname.startsWith(path));
}

/**
 * Check if the current path should be completely excluded from middleware
 */
export function shouldExcludeFromMiddleware(pathname: string): boolean {
  const excludedPaths = [
    "/api/auth", // Auth API routes
    "/_next", // Next.js static files
    "/favicon.ico",
    "/sitemap.xml",
    "/robots.txt",
    "/images",
    "/.well-known", // Chrome dev tools and other well-known paths
    "/debug", // Debug pages
  ];
  return excludedPaths.some((path) => pathname.startsWith(path));
}

/**
 * Check if the current path is an auth page that shouldn't be accessible when logged in
 */
export function isAuthPage(pathname: string): boolean {
  const authPaths = [
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/reset-password",
    "/auth/forgot-password",
  ];
  return authPaths.some((path) => pathname.startsWith(path));
}

/**
 * Check if the current path is the home page
 */
export function isHomePage(pathname: string): boolean {
  return pathname === "/";
}

export function isStudentRoute(pathname: string): boolean {
  return pathname.startsWith("/student");
}

export function isTeacherRoute(pathname: string): boolean {
  return pathname.startsWith("/teacher");
}

/**
 * Redirect user to their appropriate portal based on role
 */
export function redirectToPortal(
  request: NextRequest,
  role: UserRole
): NextResponse {
  const portalUrl = new URL(
    role === "student" ? "/student" : "/teacher",
    request.url
  );
  return NextResponse.redirect(portalUrl);
}

export function redirectToSignIn(request: NextRequest): NextResponse {
  const signInUrl = new URL("/auth/sign-in", request.url);
  signInUrl.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
}

export function redirectToUnauthorized(request: NextRequest): NextResponse {
  const unauthorizedUrl = new URL("/unauthorized", request.url);
  return NextResponse.redirect(unauthorizedUrl);
}

export function redirectToSetup(request: NextRequest): NextResponse {
  const setupUrl = new URL("/setup", request.url);
  return NextResponse.redirect(setupUrl);
}

export function isSetupPage(pathname: string): boolean {
  return pathname === "/setup";
}

export function allowRequest(): NextResponse {
  return NextResponse.next();
}
