import { type NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  requiresAuth,
  shouldExcludeFromMiddleware,
  isAuthPage,
  isHomePage,
  isStudentRoute,
  isTeacherRoute,
  isSetupPage,
  redirectToSignIn,
  redirectToUnauthorized,
  redirectToPortal,
  redirectToSetup,
  allowRequest,
} from "./auth";

export async function handleMiddleware(
  request: NextRequest
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Skip middleware for excluded paths (API routes, static files, etc.)
  if (shouldExcludeFromMiddleware(pathname)) {
    return NextResponse.next();
  }

  // Get the authenticated user for all requests (we'll need it for various checks)
  const user = await getAuthenticatedUser(request);

  if (process.env.NODE_ENV === "development") {
    console.log("🛡️ Middleware Decision Tree:", {
      path: pathname,
      userEmail: user?.email || "not authenticated",
      userRole: user?.role || "no role",
      isAuthPage: isAuthPage(pathname),
      isHomePage: isHomePage(pathname),
      isSetupPage: isSetupPage(pathname),
      requiresAuth: requiresAuth(pathname),
    });
  }

  // If user is authenticated and has a role and tries to access auth pages, redirect to their portal
  if (user && user.role && isAuthPage(pathname)) {
    if (process.env.NODE_ENV === "development") {
      console.log("🔄 Redirecting from auth page to portal:", user.role);
    }
    return redirectToPortal(request, user.role);
  }

  // If user is authenticated and has a role and on home page, redirect to their portal
  if (user && user.role && isHomePage(pathname)) {
    if (process.env.NODE_ENV === "development") {
      console.log("🔄 Redirecting from home to portal:", user.role);
    }
    return redirectToPortal(request, user.role);
  }

  // If user is authenticated but has no role (needs setup)
  if (user && !user.role) {
    if (process.env.NODE_ENV === "development") {
      console.log("🚨 User needs setup, current path:", pathname);
    }
    // If they're trying to access the setup page or auth pages, allow it
    if (isSetupPage(pathname) || isAuthPage(pathname)) {
      if (process.env.NODE_ENV === "development") {
        console.log("✅ Allowing access to setup/auth page");
      }
      return allowRequest();
    }
    // Otherwise redirect to setup
    if (process.env.NODE_ENV === "development") {
      console.log("🔄 Redirecting to setup page");
    }
    return redirectToSetup(request);
  }

  // If user has a role and tries to access setup page, redirect to their portal
  if (user && user.role && isSetupPage(pathname)) {
    if (process.env.NODE_ENV === "development") {
      console.log("🔄 User already setup, redirecting to portal:", user.role);
    }
    return redirectToPortal(request, user.role);
  }

  // If route doesn't require authentication, allow it
  if (!requiresAuth(pathname)) {
    return allowRequest();
  }

  // From here, we're dealing with protected routes that require authentication

  // If user is not authenticated, redirect to sign-in
  if (!user) {
    return redirectToSignIn(request);
  }

  // If user is authenticated but has no role, redirect to setup
  // (This shouldn't happen due to earlier check, but keeping for safety)
  if (!user.role) {
    return redirectToSetup(request);
  }

  // Check role-based access for protected routes
  if (isStudentRoute(pathname) && user.role !== "student") {
    return redirectToUnauthorized(request);
  }

  if (isTeacherRoute(pathname) && user.role !== "teacher") {
    return redirectToUnauthorized(request);
  }

  // User is authenticated and authorized
  return allowRequest();
}
