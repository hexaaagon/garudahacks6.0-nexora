"use client";

import { useAuth } from "@/lib/middleware/hooks";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function AuthDebugPage() {
  const { user, loading, error } = useAuth();
  const [session, setSession] = useState<unknown>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Try to get session data using the auth client
        const result = await authClient.getSession();
        setSession(result);
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        setSessionLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleTestSignIn = async () => {
    try {
      console.log("Testing sign-in...");
      const result = await authClient.signIn.social({
        provider: "google",
      });
      console.log("Sign-in result:", result);
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      window.location.reload();
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Auth Debug Page</h1>

          <div className="space-y-6">
            {/* useAuth Hook Results */}
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">useAuth Hook</h2>
              <div className="space-y-2">
                <p>
                  <strong>Loading:</strong> {loading ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Error:</strong> {error || "None"}
                </p>
                <p>
                  <strong>User:</strong>
                </p>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>

            {/* Direct Session Check */}
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">
                Direct Session Check
              </h2>
              <div className="space-y-2">
                <p>
                  <strong>Loading:</strong> {sessionLoading ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Session:</strong>
                </p>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            </div>

            {/* Auth Actions */}
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Auth Actions</h2>
              <div className="space-x-4">
                <Button onClick={handleTestSignIn}>Test Google Sign-In</Button>
                <Button onClick={handleSignOut} variant="outline">
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Environment Check */}
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Environment</h2>
              <div className="space-y-2">
                <p>
                  <strong>Base URL:</strong>{" "}
                  {process.env.NEXT_PUBLIC_APP_URL || "Not set"}
                </p>
                <p>
                  <strong>Current URL:</strong>{" "}
                  {typeof window !== "undefined"
                    ? window.location.href
                    : "Server-side"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
