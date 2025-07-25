"use server";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getAuth } from "@nexora/database";
import { createServiceServer } from "@nexora/database/supabase";

export type UserRole = "student" | "teacher";
export type UserSetupStatus = "not_setup" | "partial_setup" | "complete";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole | null;
}

export interface SetupUserData {
  role: UserRole;
  name: string;
  additionalInfo?: Record<string, unknown>;
}

/**
 * Get the authenticated user with role from server-side
 */
export async function getServerUser(): Promise<AuthUser | null> {
  try {
    const session = await getAuth();

    if (!session?.user) {
      return null;
    }

    const supabase = createServiceServer();
    const user = session.user;

    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Server Auth Check:", {
        userId: user.id,
        email: user.email,
      });
    }

    // Check if user exists in students table
    const { data: studentData } = await supabase
      .from("students")
      .select("id")
      .eq("id", user.id)
      .single();

    if (studentData) {
      if (process.env.NODE_ENV === "development") {
        console.log("👨‍🎓 Server: User is a student");
      }
      return {
        id: user.id,
        email: user.email,
        role: "student",
      };
    }

    // Check if user exists in teachers table
    const { data: teacherData } = await supabase
      .from("teachers")
      .select("id")
      .eq("id", user.id)
      .single();

    if (teacherData) {
      if (process.env.NODE_ENV === "development") {
        console.log("👨‍🏫 Server: User is a teacher");
      }
      return {
        id: user.id,
        email: user.email,
        role: "teacher",
      };
    }

    if (process.env.NODE_ENV === "development") {
      console.log("❌ Server: User has no role assigned");
    }

    // User exists but has no role assigned
    return {
      id: user.id,
      email: user.email,
      role: null,
    };
  } catch (error) {
    console.error("Error getting server user:", error);
    return null;
  }
}

/**
 * Require authentication and specific role, redirect if not met
 */
export async function requireAuth(requiredRole?: UserRole): Promise<AuthUser> {
  const user = await getServerUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  if (!user.role) {
    redirect("/unauthorized");
  }

  if (requiredRole && user.role !== requiredRole) {
    redirect("/unauthorized");
  }

  return user;
}

/**
 * Check if user needs to complete setup and return user info (cached to prevent duplicate calls)
 */
export const getUserAndSetupStatus = cache(
  async (): Promise<{
    user: AuthUser | null;
    setupStatus: UserSetupStatus;
  }> => {
    const auth = await getAuth();
    if (!auth?.user?.id) {
      return { user: null, setupStatus: "not_setup" };
    }

    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Checking user and setup status for:", auth.user.email);
    }

    const supabase = createServiceServer();

    // Check if user has a role assigned
    const { data: student } = await supabase
      .from("students")
      .select("id")
      .eq("id", auth.user.id)
      .single();

    const { data: teacher } = await supabase
      .from("teachers")
      .select("id")
      .eq("id", auth.user.id)
      .single();

    let user: AuthUser;
    let setupStatus: UserSetupStatus;

    if (student) {
      user = {
        id: auth.user.id,
        email: auth.user.email,
        role: "student",
      };
      setupStatus = "complete";
      if (process.env.NODE_ENV === "development") {
        console.log("👨‍🎓 User is a student - setup complete");
      }
    } else if (teacher) {
      user = {
        id: auth.user.id,
        email: auth.user.email,
        role: "teacher",
      };
      setupStatus = "complete";
      if (process.env.NODE_ENV === "development") {
        console.log("👨‍🏫 User is a teacher - setup complete");
      }
    } else {
      user = {
        id: auth.user.id,
        email: auth.user.email,
        role: null,
      };
      setupStatus = "not_setup";
      if (process.env.NODE_ENV === "development") {
        console.log("❌ User needs setup");
      }
    }

    return { user, setupStatus };
  }
);

/**
 * Check if user needs to complete setup
 */
export async function checkUserSetupStatus(): Promise<UserSetupStatus> {
  const auth = await getAuth();
  if (!auth?.user?.id) {
    return "not_setup";
  }

  if (process.env.NODE_ENV === "development") {
    console.log("🔍 Checking setup status for user:", auth.user.email);
  }

  const supabase = createServiceServer();

  // Check if user has a role assigned
  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("id", auth.user.id)
    .single();

  const { data: teacher } = await supabase
    .from("teachers")
    .select("id")
    .eq("id", auth.user.id)
    .single();

  if (student || teacher) {
    if (process.env.NODE_ENV === "development") {
      console.log("✅ User setup is complete");
    }
    return "complete";
  }

  if (process.env.NODE_ENV === "development") {
    console.log("❌ User needs setup");
  }
  return "not_setup";
}

/**
 * Setup user with role and additional information
 */
export async function setupUserRole(
  data: SetupUserData
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await getAuth();
    if (!auth?.user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    if (process.env.NODE_ENV === "development") {
      console.log("🔧 Setting up user role:", {
        email: auth.user.email,
        role: data.role,
        name: data.name,
      });
    }

    const supabase = createServiceServer();

    // Update user name first
    const { error: userError } = await supabase
      .from("user")
      .update({ name: data.name })
      .eq("id", auth.user.id);

    if (userError) {
      console.error("Error updating user name:", userError);
      return { success: false, error: "Failed to update user information" };
    }

    // Create role-specific record
    if (data.role === "student") {
      const { error } = await supabase.from("students").insert({
        id: auth.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error creating student record:", error);
        return { success: false, error: "Failed to create student record" };
      }
    } else if (data.role === "teacher") {
      const { error } = await supabase.from("teachers").insert({
        id: auth.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error creating teacher record:", error);
        return { success: false, error: "Failed to create teacher record" };
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Setup user role error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Require authentication and setup completion, redirect if not met
 */
export async function requireSetup(): Promise<AuthUser> {
  const user = await getServerUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const setupStatus = await checkUserSetupStatus();
  if (setupStatus === "not_setup") {
    redirect("/setup");
  }

  if (!user.role) {
    redirect("/setup");
  }

  return user;
}
