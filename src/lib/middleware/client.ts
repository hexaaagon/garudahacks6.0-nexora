import { createClient } from "@/lib/database/supabase/client";

export type UserRole = "student" | "teacher";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole | null;
}

export async function getCurrentUserRole(): Promise<AuthUser | null> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const { data: studentData } = await supabase
      .from("students")
      .select("id")
      .eq("id", user.id)
      .single();

    if (studentData) {
      return {
        id: user.id,
        email: user.email!,
        role: "student",
      };
    }

    const { data: teacherData } = await supabase
      .from("teachers")
      .select("id")
      .eq("id", user.id)
      .single();

    if (teacherData) {
      return {
        id: user.id,
        email: user.email!,
        role: "teacher",
      };
    }

    return {
      id: user.id,
      email: user.email!,
      role: null,
    };
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}
