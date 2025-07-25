import { redirect } from "next/navigation";
import { getUserAndSetupStatus } from "@/lib/auth/server-utils";

interface SetupLayoutProps {
  children: React.ReactNode;
}

export default async function SetupLayout({ children }: SetupLayoutProps) {
  // Check if user is authenticated and get setup status
  const { user, setupStatus } = await getUserAndSetupStatus();

  if (!user) {
    if (process.env.NODE_ENV === "development") {
      console.log("🚫 Setup Layout: No user found, redirecting to sign-in");
    }
    redirect("/auth/sign-in");
  }

  if (process.env.NODE_ENV === "development") {
    console.log("🔧 Setup Layout Check:", {
      user: { email: user.email, role: user.role },
      setupStatus,
    });
  }

  if (setupStatus === "complete") {
    // User has completed setup, redirect to appropriate dashboard
    if (user.role === "student") {
      if (process.env.NODE_ENV === "development") {
        console.log("✅ Setup complete, redirecting student to dashboard");
      }
      redirect("/student");
    } else if (user.role === "teacher") {
      if (process.env.NODE_ENV === "development") {
        console.log("✅ Setup complete, redirecting teacher to dashboard");
      }
      redirect("/teacher");
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.log("📝 Showing setup page");
  }

  // Show the setup page content
  return <>{children}</>;
}
