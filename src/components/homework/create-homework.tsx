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
import { Textarea } from "@/components/ui/textarea";

interface CreateHomeworkProps {
  classroomId: string;
  onHomeworkCreated?: () => void;
}

export function CreateHomework({
  classroomId,
  onHomeworkCreated,
}: CreateHomeworkProps) {
  const [subjectMatter, setSubjectMatter] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate minimum 2 paragraphs (rough estimation)
    const paragraphs = subjectMatter
      .trim()
      .split("\n\n")
      .filter((p) => p.trim().length > 0);
    if (paragraphs.length < 2) {
      setError("Subject matter must contain at least 2 paragraphs");
      return;
    }

    if (subjectMatter.trim().length < 200) {
      setError(
        "Subject matter should be more detailed (at least 200 characters)"
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Combine date and time if provided
      let deadlineAt = null;
      if (deadlineDate) {
        deadlineAt = new Date(
          deadlineDate + (deadlineTime ? `T${deadlineTime}` : "T23:59")
        );
      }

      const response = await fetch("/api/homework/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classroomId,
          subjectMatter: subjectMatter.trim(),
          deadlineAt,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setSubjectMatter("");
        setDeadlineDate("");
        setDeadlineTime("");
        onHomeworkCreated?.();

        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || "Failed to create homework");
      }
    } catch (err) {
      console.error("Homework creation error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const countParagraphs = (text: string) => {
    return text
      .trim()
      .split("\n\n")
      .filter((p) => p.trim().length > 0).length;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Homework</CardTitle>
        <CardDescription>
          Post subject matter for your students with an optional deadline.
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
              <p className="text-sm text-green-600">
                Homework created successfully! Students can now access it.
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="subjectMatter">
              Subject Matter (Minimum 2 paragraphs)
            </Label>
            <Textarea
              id="subjectMatter"
              value={subjectMatter}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setSubjectMatter(e.target.value)
              }
              placeholder="Enter the subject matter content. Use double line breaks to separate paragraphs.

Example paragraph 1 content...

Example paragraph 2 content..."
              className="min-h-[200px]"
              disabled={isLoading}
              required
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>
                Paragraphs: {countParagraphs(subjectMatter)}/2 minimum
              </span>
              <span>Characters: {subjectMatter.length}/200 minimum</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deadlineDate">Deadline Date (Optional)</Label>
              <Input
                id="deadlineDate"
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="deadlineTime">Deadline Time (Optional)</Label>
              <Input
                id="deadlineTime"
                type="time"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                disabled={isLoading || !deadlineDate}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              isLoading ||
              countParagraphs(subjectMatter) < 2 ||
              subjectMatter.length < 200
            }
          >
            {isLoading ? "Creating Homework..." : "Create Homework"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
