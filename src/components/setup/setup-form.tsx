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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  setupUserRole,
  type UserRole,
  type AuthUser,
} from "@/lib/auth/server-utils";

interface SetupFormProps {
  user: AuthUser;
}

type SetupStep = "role" | "teacher-setup" | "student-interests" | "complete";

const DEFAULT_INTERESTS = [
  "Coding",
  "Gaming",
  "Mathematics",
  "Science",
  "Art",
  "Music",
  "Sports",
  "Reading",
  "Writing",
  "Photography",
  "Dancing",
  "Cooking",
  "History",
  "Geography",
  "Language Learning",
  "Philosophy",
  "Psychology",
  "Physics",
];

const GRADE_OPTIONS = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

const SUBJECT_OPTIONS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "Physics",
  "Chemistry",
  "Biology",
  "Literature",
  "Art",
  "Music",
  "Physical Education",
  "Computer Science",
  "Foreign Language",
  "Social Studies",
];

export function SetupForm({ user }: SetupFormProps) {
  const [currentStep, setCurrentStep] = useState<SetupStep>("role");
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [name, setName] = useState(user.email.split("@")[0] || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Teacher setup states
  const [classroomName, setClassroomName] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [adminEmails, setAdminEmails] = useState<string[]>([""]);
  const [shareCode, setShareCode] = useState("");

  // Student setup states
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");

  const handleRoleSubmit = async (e: React.FormEvent) => {
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
        if (selectedRole === "teacher") {
          setCurrentStep("teacher-setup");
        } else {
          setCurrentStep("student-interests");
        }
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

  const handleTeacherClassroomSetup = async (skipClassroom = false) => {
    if (!skipClassroom) {
      if (!classroomName.trim()) {
        setError("Please enter a classroom name");
        return;
      }
      if (!selectedGrade) {
        setError("Please select a grade");
        return;
      }
      if (selectedSubjects.length === 0) {
        setError("Please select at least one subject");
        return;
      }
      if (selectedSubjects.length > 5) {
        setError("Please select at most 5 subjects");
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!skipClassroom) {
        // Create classroom with the provided details
        const classroomData = {
          name: classroomName.trim(),
          grade: selectedGrade,
          subjects: selectedSubjects,
          adminEmails: adminEmails.filter((email) => email.trim() !== ""),
        };

        const response = await fetch("/api/classroom/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(classroomData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setShareCode(result.shareCode);
          // Auto-redirect to teacher dashboard after showing success message briefly
          setTimeout(() => {
            router.push("/teacher");
          }, 2000);
        } else {
          setError(result.error || "Failed to create classroom");
          return;
        }
      } else {
        // If skipping classroom creation, redirect to teacher dashboard
        router.push("/teacher");
        return;
      }
    } catch (err) {
      console.error("Classroom setup error:", err);
      setError("Failed to create classroom. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentInterestsSubmit = async () => {
    if (selectedInterests.length < 3) {
      setError("Please select at least 3 interests");
      return;
    }
    if (selectedInterests.length > 5) {
      setError("Please select at most 5 interests");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Save student interests to database
      const interestsData = {
        interests: selectedInterests,
      };

      const response = await fetch("/api/student/interests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(interestsData),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/student");
        router.refresh();
      } else {
        setError(result.error || "Failed to save interests");
      }
    } catch (err) {
      console.error("Interests setup error:", err);
      setError("Failed to save interests");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : prev.length < 5
        ? [...prev, subject]
        : prev
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 5
        ? [...prev, interest]
        : prev
    );
  };

  const addCustomInterest = () => {
    if (
      customInterest.trim().length >= 3 &&
      customInterest.trim().length <= 15 &&
      !selectedInterests.includes(customInterest.trim()) &&
      selectedInterests.length < 5
    ) {
      setSelectedInterests((prev) => [...prev, customInterest.trim()]);
      setCustomInterest("");
    }
  };

  const addAdminEmail = () => {
    if (adminEmails.length < 5) {
      setAdminEmails([...adminEmails, ""]);
    }
  };

  const updateAdminEmail = (index: number, email: string) => {
    const updated = [...adminEmails];
    updated[index] = email;
    setAdminEmails(updated);
  };

  const removeAdminEmail = (index: number) => {
    setAdminEmails(adminEmails.filter((_, i) => i !== index));
  };

  if (currentStep === "role") {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Account Setup</CardTitle>
          <CardDescription>
            Choose your role and complete your profile information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRoleSubmit} className="space-y-6">
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
              {isLoading ? "Setting up..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === "teacher-setup") {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create Your First Classroom</CardTitle>
          <CardDescription>
            Set up your classroom details. You can skip this and create it
            later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <Label htmlFor="classroomName">Classroom Name</Label>
              <Input
                id="classroomName"
                value={classroomName}
                onChange={(e) => setClassroomName(e.target.value)}
                placeholder="e.g., Math Class 2024"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label>Grade Level</Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {GRADE_OPTIONS.map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setSelectedGrade(grade)}
                    className={`p-2 text-sm border rounded-md transition-colors ${
                      selectedGrade === grade
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    disabled={isLoading}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Subjects (Select 1-5)</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {SUBJECT_OPTIONS.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className={`p-2 text-sm border rounded-md transition-colors ${
                      selectedSubjects.includes(subject)
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    } ${
                      selectedSubjects.length >= 5 &&
                      !selectedSubjects.includes(subject)
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={
                      isLoading ||
                      (selectedSubjects.length >= 5 &&
                        !selectedSubjects.includes(subject))
                    }
                  >
                    {subject}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Selected: {selectedSubjects.length}/5
              </p>
            </div>

            <div>
              <Label>Additional Admins (Optional, Max 5)</Label>
              <div className="mt-2 space-y-2">
                {adminEmails.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={email}
                      onChange={(e) => updateAdminEmail(index, e.target.value)}
                      placeholder="admin@school.edu"
                      type="email"
                      disabled={isLoading}
                    />
                    {adminEmails.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAdminEmail(index)}
                        disabled={isLoading}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                {adminEmails.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAdminEmail}
                    disabled={isLoading}
                  >
                    Add Admin
                  </Button>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => handleTeacherClassroomSetup(false)}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Creating..." : "Create Classroom"}
              </Button>
              <Button
                type="button"
                onClick={() => handleTeacherClassroomSetup(true)}
                variant="outline"
                disabled={isLoading}
                className="flex-1"
              >
                Remind Me Later
              </Button>
            </div>

            {shareCode && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h4 className="font-medium text-green-800">
                  Classroom Created Successfully! 🎉
                </h4>
                <p className="text-sm text-green-600 mt-1">
                  Share this code with your students:{" "}
                  <strong className="bg-green-100 px-2 py-1 rounded">
                    {shareCode}
                  </strong>
                </p>
                <p className="text-xs text-green-600 mt-2">
                  Redirecting to your dashboard in 2 seconds...
                </p>
                <div className="mt-3">
                  <Button
                    onClick={() => {
                      router.push("/teacher");
                    }}
                    className="w-full"
                  >
                    Continue to Dashboard Now
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === "student-interests") {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Select Your Interests</CardTitle>
          <CardDescription>
            Choose 3-5 interests to personalize your learning experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <Label>Available Interests</Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {DEFAULT_INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`p-2 text-sm border rounded-md transition-colors ${
                      selectedInterests.includes(interest)
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    } ${
                      selectedInterests.length >= 5 &&
                      !selectedInterests.includes(interest)
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={
                      isLoading ||
                      (selectedInterests.length >= 5 &&
                        !selectedInterests.includes(interest))
                    }
                  >
                    {interest}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Selected: {selectedInterests.length}/5 (minimum 3 required)
              </p>
            </div>

            <div>
              <Label>Add Custom Interest</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  placeholder="Your custom interest (3-15 chars)"
                  maxLength={15}
                  disabled={isLoading || selectedInterests.length >= 5}
                />
                <Button
                  type="button"
                  onClick={addCustomInterest}
                  disabled={
                    isLoading ||
                    customInterest.trim().length < 3 ||
                    customInterest.trim().length > 15 ||
                    selectedInterests.includes(customInterest.trim()) ||
                    selectedInterests.length >= 5
                  }
                >
                  Add
                </Button>
              </div>
            </div>

            {selectedInterests.length > 0 && (
              <div>
                <Label>Selected Interests</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedInterests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                        disabled={isLoading}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleStudentInterestsSubmit}
              disabled={isLoading || selectedInterests.length < 3}
              className="w-full"
            >
              {isLoading ? "Setting up..." : "Complete Setup"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
