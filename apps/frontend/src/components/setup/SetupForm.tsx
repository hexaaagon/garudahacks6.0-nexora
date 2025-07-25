"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  setupUserRole,
  type UserRole,
  type AuthUser,
} from "@/lib/auth/server-utils";

interface SetupFormProps {
  user: AuthUser;
}

export function SetupForm({ user }: SetupFormProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [name, setName] = useState(user.email.split("@")[0] || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await setupUserRole({
        role: selectedRole as UserRole,
        name: name.trim(),
      });

      if (result.success) {
        // Redirect to appropriate dashboard
        router.push(selectedRole === "student" ? "/student" : "/teacher");
        router.refresh();
      } else {
        setError(result.error || "Failed to setup account");
      }
    } catch (err) {
      console.error("Setup error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Account Setup</CardTitle>
        <CardDescription>
          Choose your role and complete your profile information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label>Select Your Role</Label>
              <div className="mt-2 space-y-3">
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedRole === "student"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedRole("student")}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="student"
                      name="role"
                      value="student"
                      checked={selectedRole === "student"}
                      onChange={(e) =>
                        setSelectedRole(e.target.value as UserRole)
                      }
                      className="mr-3"
                      disabled={isLoading}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">Student</h3>
                      <p className="text-sm text-gray-500">
                        Access learning materials and participate in classes
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedRole === "teacher"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedRole("teacher")}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="teacher"
                      name="role"
                      value="teacher"
                      checked={selectedRole === "teacher"}
                      onChange={(e) =>
                        setSelectedRole(e.target.value as UserRole)
                      }
                      className="mr-3"
                      disabled={isLoading}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">Teacher</h3>
                      <p className="text-sm text-gray-500">
                        Create and manage classes, assignments, and student
                        progress
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !selectedRole || !name.trim()}
          >
            {isLoading ? "Setting up..." : "Complete Setup"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
