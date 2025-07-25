"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface Question {
  id: string;
  type: "multiple_choices" | "essay";
  questionText: string;
  choices?: string[];
  answer?: number;
  promptAnswer?: string;
}

interface Homework {
  id: string;
  subjectMatter: string;
  question: Question[];
  deadlineAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface StudentHomeworkViewProps {
  classroomId: string;
}

export function StudentHomeworkView({ classroomId }: StudentHomeworkViewProps) {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(
    null
  );
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeworksData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/classroom/${classroomId}/homework`);
        const data = await response.json();

        if (data.success) {
          setHomeworks(data.homeworks);
        } else {
          setError(data.error || "Failed to fetch homework");
        }
      } catch (err) {
        console.error("Error fetching homework:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeworksData();
  }, [classroomId]);

  const generateQuestions = async (homeworkId: string) => {
    setGeneratingQuestions(true);
    setError(null);

    try {
      const response = await fetch("/api/homework/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subjectMatterId: homeworkId }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the homework with generated questions
        setSelectedHomework((prev) =>
          prev ? { ...prev, question: data.questions } : null
        );

        // Update the homework in the list
        setHomeworks((prev) =>
          prev.map((hw) =>
            hw.id === homeworkId ? { ...hw, question: data.questions } : hw
          )
        );
      } else {
        setError(data.error || "Failed to generate questions");
      }
    } catch (err) {
      console.error("Error generating questions:", err);
      setError("An unexpected error occurred");
    } finally {
      setGeneratingQuestions(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const submitHomework = async () => {
    if (!selectedHomework) return;

    try {
      const response = await fetch("/api/homework/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          homeworkId: selectedHomework.id,
          answers,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Homework submitted successfully!");
        setSelectedHomework(null);
        setAnswers({});
      } else {
        setError(data.error || "Failed to submit homework");
      }
    } catch (err) {
      console.error("Error submitting homework:", err);
      setError("An unexpected error occurred");
    }
  };

  const formatDeadline = (deadline: string) => {
    return new Date(deadline).toLocaleString();
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading homework...</span>
      </div>
    );
  }

  if (selectedHomework) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Homework Assessment</CardTitle>
              <CardDescription>
                {selectedHomework.deadlineAt && (
                  <span
                    className={
                      isDeadlinePassed(selectedHomework.deadlineAt)
                        ? "text-red-600"
                        : ""
                    }
                  >
                    Deadline: {formatDeadline(selectedHomework.deadlineAt)}
                  </span>
                )}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setSelectedHomework(null)}>
              Back to List
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Subject Matter</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="whitespace-pre-wrap">
                {selectedHomework.subjectMatter}
              </p>
            </div>
          </div>

          {selectedHomework.question.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Questions haven&apos;t been generated yet.
              </p>
              <Button
                onClick={() => generateQuestions(selectedHomework.id)}
                disabled={generatingQuestions}
                className="flex items-center gap-2"
              >
                {generatingQuestions ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="font-semibold">Questions</h3>

              {selectedHomework.question.map((question, index) => (
                <Card key={question.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Badge
                        variant={
                          question.type === "essay" ? "secondary" : "default"
                        }
                      >
                        {question.type === "essay"
                          ? "Essay"
                          : "Multiple Choice"}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Question {index + 1}
                      </span>
                    </div>

                    <h4 className="font-medium">{question.questionText}</h4>

                    {question.type === "multiple_choices" &&
                    question.choices ? (
                      <div className="space-y-2">
                        {question.choices.map((choice, choiceIndex) => (
                          <label
                            key={choiceIndex}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={choiceIndex}
                              onChange={(e) =>
                                handleAnswerChange(
                                  question.id,
                                  parseInt(e.target.value)
                                )
                              }
                              checked={answers[question.id] === choiceIndex}
                            />
                            <span>{choice}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor={`essay-${question.id}`}>
                          Your Answer
                        </Label>
                        <Textarea
                          id={`essay-${question.id}`}
                          placeholder="Write your essay answer here..."
                          value={(answers[question.id] as string) || ""}
                          onChange={(e) =>
                            handleAnswerChange(question.id, e.target.value)
                          }
                          className="min-h-[100px]"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              <div className="flex justify-end">
                <Button
                  onClick={submitHomework}
                  className="px-8"
                  disabled={
                    Object.keys(answers).length !==
                    selectedHomework.question.length
                  }
                >
                  Submit Homework
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Available Homework</CardTitle>
          <CardDescription>
            Click on any homework to start working on it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {homeworks.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No homework available yet.
            </p>
          ) : (
            <div className="space-y-3">
              {homeworks.map((homework) => (
                <Card
                  key={homework.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedHomework(homework)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">
                          {homework.subjectMatter.substring(0, 100)}...
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Created:{" "}
                          {new Date(homework.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {homework.deadlineAt && (
                          <Badge
                            variant={
                              isDeadlinePassed(homework.deadlineAt)
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {isDeadlinePassed(homework.deadlineAt)
                              ? "Overdue"
                              : "Due"}
                            : {formatDeadline(homework.deadlineAt)}
                          </Badge>
                        )}
                        <Badge
                          variant={
                            homework.question.length > 0 ? "default" : "outline"
                          }
                        >
                          {homework.question.length > 0
                            ? "Questions Ready"
                            : "Questions Not Generated"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
