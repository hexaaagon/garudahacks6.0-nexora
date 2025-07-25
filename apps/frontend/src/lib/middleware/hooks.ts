"use client";

import { useState, useEffect } from "react";
import { createClient } from "@nexora/database/supabase/client";
import type { AuthUser } from "./client";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let supabaseClient: Awaited<ReturnType<typeof createClient>> | null = null;

    const getInitialSession = async () => {
      try {
        supabaseClient = await createClient();
        const {
          data: { user },
          error,
        } = await supabaseClient.auth.getUser();

        if (error) {
          setError(error.message);
          setUser(null);
          return;
        }

        if (!user) {
          setUser(null);
          return;
        }

        const [studentResult, teacherResult] = await Promise.all([
          supabaseClient
            .from("students")
            .select("id")
            .eq("id", user.id)
            .single(),
          supabaseClient
            .from("teachers")
            .select("id")
            .eq("id", user.id)
            .single(),
        ]);

        let role: "student" | "teacher" | null = null;

        if (studentResult.data) {
          role = "student";
        } else if (teacherResult.data) {
          role = "teacher";
        }

        setUser({
          id: user.id,
          email: user.email!,
          role,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const setupAuthListener = async () => {
      await getInitialSession();

      if (supabaseClient) {
        const {
          data: { subscription },
        } = supabaseClient.auth.onAuthStateChange(
          async (
            event: string,
            session: { user?: { id: string; email?: string } } | null
          ) => {
            if (event === "SIGNED_OUT" || !session?.user) {
              setUser(null);
              setLoading(false);
              return;
            }

            if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
              const user = session.user;

              const [studentResult, teacherResult] = await Promise.all([
                supabaseClient!
                  .from("students")
                  .select("id")
                  .eq("id", user.id)
                  .single(),
                supabaseClient!
                  .from("teachers")
                  .select("id")
                  .eq("id", user.id)
                  .single(),
              ]);

              let role: "student" | "teacher" | null = null;

              if (studentResult.data) {
                role = "student";
              } else if (teacherResult.data) {
                role = "teacher";
              }

              setUser({
                id: user.id,
                email: user.email!,
                role,
              });
              setLoading(false);
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      }
    };

    setupAuthListener();
  }, []);

  const signOut = async () => {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  return {
    user,
    loading,
    error,
    signOut,
    isStudent: user?.role === "student",
    isTeacher: user?.role === "teacher",
    isAuthenticated: !!user,
  };
}
