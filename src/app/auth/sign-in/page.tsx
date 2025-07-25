"use client";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SiGoogle } from "@icons-pack/react-simple-icons";
import { authClient } from "@/lib/auth/client";
import AuthLayout from "@/components/layout/auth-layout";

export default function AuthPage() {
  const handleSignIn = async () => {
    try {
      console.log("Starting Google sign-in...");

      const signInPromise = authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      toast.promise(signInPromise, {
        loading: "Signing in with Google...",
        success: "Redirecting...",
        error: "Failed to sign in. Please try again.",
      });
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Welcome back! Please sign in to continue."
    >
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/images/claisse.svg"
              height={32}
              width={32}
              alt="Claisse Logo"
            />
            <h1 className="ml-2 text-lg font-semibold">Claisse</h1>
          </div>
          <CardTitle className="text-lg">Continue with your account</CardTitle>
          <CardDescription>
            Choose your sign-in method to access your portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full cursor-pointer" onClick={handleSignIn}>
            <SiGoogle className="mr-2" /> Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div className="text-center text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-gray-700"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-gray-700"
            >
              Privacy Policy
            </a>
            .
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
