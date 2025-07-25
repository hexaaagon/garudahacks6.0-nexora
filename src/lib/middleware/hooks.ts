"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import type { AuthUser } from "./client";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: session, error } = await authClient.getSession();

        if (error) {
          setError(error.message);
          setUser(null);
          setLoading(false);
          return;
        }

        if (!session?.user) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Fetch user role from the database
        const response = await fetch("/api/auth/user");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();

        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: userData.role,
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

    getInitialSession();
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await authClient.signOut();
      if (error) {
        setError(error.message);
      } else {
        setUser(null);
        router.push("/auth/sign-in");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
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
