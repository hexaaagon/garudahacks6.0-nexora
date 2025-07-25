import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/server-utils";
import type { UserRole } from "@/lib/auth/server-utils";

interface DashboardTemplateProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

/**
 * Dashboard Template - handles role-based access control
 * Middleware handles basic auth, this handles detailed role checks
 */
export default async function DashboardTemplate({
  children,
  requiredRole,
}: DashboardTemplateProps) {
  const user = await getServerUser();

  if (process.env.NODE_ENV === "development") {
    console.log("🔍 Dashboard Template Check:", {
      user: user ? { email: user.email, role: user.role } : null,
      requiredRole,
    });
  }

  // If user is not authenticated, redirect to sign-in
  if (!user) {
    redirect("/auth/sign-in");
  }

  // If user has no role, redirect to setup
  if (!user.role) {
    redirect("/setup");
  }

  // If specific role is required and user doesn't have it, redirect to unauthorized
  if (requiredRole && user.role !== requiredRole) {
    redirect("/unauthorized");
  }

  // User has proper access - render children
  return <>{children}</>;
}
