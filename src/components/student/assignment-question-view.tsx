"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Trophy,
  Lightbulb,
  Target,
} from "lucide-react";
import Link from "next/link";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

interface Question {
  id: string;
  type: "essay" | "multiple_choices";
  questionText: string;
  choices?: string[];
  answer?: number;
  promptAnswer?: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  questions: Question[];
  dueDate?: string;
}

interface AssignmentQuestionViewProps {
  user: AuthUser;
  assignmentId: string;
}

export function AssignmentQuestionView({
  user,
  assignmentId,
}: AssignmentQuestionViewProps) {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAssignment = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/homework/${assignmentId}`);
        const data = await response.json();

        if (data.success) {
          const hw = data.homework;
          const assignmentData: Assignment = {
            id: hw.id,
            title: hw.title,
            description: hw.description,
            subject: hw.subject,
            difficulty: hw.difficulty,
            questions: hw.questions || [],
            dueDate: hw.dueDate,
          };

          setAssignment(assignmentData);

          // If no questions exist, generate them using AI
          if (!hw.questions || hw.questions.length === 0) {
            await generateQuestions();
          }
        } else {
          setError(data.error || "Assignment not found");
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
        setError("Failed to load assignment");
      } finally {
        setIsLoading(false);
      }
    };

    loadAssignment();
  }, [assignmentId]);

  const generateQuestions = async () => {
    try {
      setIsGeneratingQuestions(true);
      setError(null);

      const response = await fetch("/api/homework/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          homeworkId: assignmentId,
        }),
      });

      const data = await response.json();

      if (data.success && data.questions) {
        setAssignment((prev) =>
          prev
            ? {
                ...prev,
                questions: data.questions,
              }
            : null
        );
      } else {
        setError(data.error || "Failed to generate questions");
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      setError("Failed to generate questions with AI");
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!assignment) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/homework/${assignmentId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to results page or assignments list
        window.location.href = "/student/assignments";
      } else {
        setError(data.error || "Failed to submit assignment");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      setError("Failed to submit assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = assignment?.questions[currentQuestionIndex];
  const isLastQuestion =
    currentQuestionIndex === (assignment?.questions.length || 0) - 1;
  const progress = assignment
    ? ((currentQuestionIndex + 1) / assignment.questions.length) * 100
    : 0;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-8"></div>
          <Card>
            <CardContent className="p-8">
              <div className="h-32 bg-gray-100 rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center py-12">
          <CardContent>
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {error || "Assignment Not Found"}
            </h3>
            <p className="text-gray-600 mb-6">
              {error === "Assignment not found"
                ? "The assignment you're looking for doesn't exist or has been removed."
                : "There was an error loading the assignment. Please try again."}
            </p>
            <Link href="/student/assignments">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Assignments
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isGeneratingQuestions) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center py-12">
          <CardContent>
            <Brain className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Generating AI Questions
            </h3>
            <p className="text-gray-600 mb-6">
              Our AI is creating personalized questions based on your learning
              style and the assignment content. This may take a few moments...
            </p>
            <div className="w-64 mx-auto bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full animate-pulse"
                style={{ width: "60%" }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (assignment.questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center py-12">
          <CardContent>
            <Lightbulb className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to Generate Questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Click the button below to generate AI-powered questions tailored
              to your learning style.
            </p>
            <Button onClick={generateQuestions} className="mb-4">
              <Brain className="h-4 w-4 mr-2" />
              Generate AI Questions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/student/assignments">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assignments
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {assignment.title}
          </h1>
          <p className="text-gray-600">{assignment.description}</p>
        </div>
        <div className="text-right">
          <Badge className="mb-2">
            {assignment.subject} • {assignment.difficulty}
          </Badge>
          {assignment.dueDate && (
            <p className="text-sm text-gray-500">
              Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of{" "}
              {assignment.questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      {currentQuestion && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Question {currentQuestionIndex + 1}
            </CardTitle>
            <CardDescription>
              {currentQuestion.type === "multiple_choices"
                ? "Multiple Choice"
                : "Essay Question"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed">
                {currentQuestion.questionText}
              </p>
            </div>

            {currentQuestion.type === "multiple_choices" ? (
              <div className="space-y-3">
                {currentQuestion.choices?.map((choice, index) => (
                  <label
                    key={index}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={index}
                      checked={answers[currentQuestion.id] === index}
                      onChange={(e) =>
                        handleAnswerChange(
                          currentQuestion.id,
                          parseInt(e.target.value)
                        )
                      }
                      className="mr-3 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-900">{choice}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div>
                <Textarea
                  placeholder="Type your answer here..."
                  value={(answers[currentQuestion.id] as string) || ""}
                  onChange={(e) =>
                    handleAnswerChange(currentQuestion.id, e.target.value)
                  }
                  className="min-h-[150px] resize-none"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Provide a detailed answer explaining your reasoning.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
              }
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {assignment.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    index === currentQuestionIndex
                      ? "bg-blue-600 text-white"
                      : answers[assignment.questions[index].id] !== undefined
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Trophy className="h-4 w-4 mr-2" />
                    Submit Assignment
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={() =>
                  setCurrentQuestionIndex(
                    Math.min(
                      assignment.questions.length - 1,
                      currentQuestionIndex + 1
                    )
                  )
                }
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Hint (if available) */}
      {currentQuestion?.promptAnswer && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">AI Hint</h4>
                <p className="text-yellow-700 text-sm">
                  {currentQuestion.promptAnswer}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
