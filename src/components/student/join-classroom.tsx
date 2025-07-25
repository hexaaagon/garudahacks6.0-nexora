"use client";

import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users, Plus } from "lucide-react";

interface JoinClassroomProps {
  onClassroomJoined?: () => void;
  prefilledCode?: string;
  autoOpen?: boolean;
}

export function JoinClassroom({
  onClassroomJoined,
  prefilledCode = "",
  autoOpen = false,
}: JoinClassroomProps) {
  const [shareCode, setShareCode] = useState(prefilledCode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(autoOpen);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shareCode.trim()) {
      setError("Please enter a classroom code");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/student/join-classroom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shareCode: shareCode.trim().toUpperCase(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Successfully joined ${data.classroom.name}!`);
        setShareCode("");
        onClassroomJoined?.();

        // Close dialog after 2 seconds
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(null);
        }, 2000);
      } else {
        setError(data.error || "Failed to join classroom");
      }
    } catch (err) {
      console.error("Join classroom error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-20 flex-col space-y-2">
          <Plus className="h-5 w-5" />
          <span>Join Class</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Join a Classroom</DialogTitle>
          <DialogDescription>
            Enter the classroom code provided by your teacher to join the class.
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Classroom Code</CardTitle>
            </div>
            <CardDescription>
              Ask your teacher for the 6-character classroom code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="shareCode">Classroom Code</Label>
                <Input
                  id="shareCode"
                  value={shareCode}
                  onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                  placeholder="Enter 10-character code (e.g., ABC123ABC1)"
                  maxLength={10}
                  className="text-center text-lg font-mono tracking-wider"
                  disabled={isLoading}
                  required
                />
                <p className="text-xs text-gray-500">
                  Code format: 10 characters (letters and numbers)
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || shareCode.trim().length !== 10}
              >
                {isLoading ? "Joining..." : "Join Classroom"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
