"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface HomeworkViewProps {
  homework: {
    id: string;
    subjectMatter: string;
    deadlineAt: string | null;
    question: Array<{
      id: string;
      type: "multiple_choices" | "essay";
      questionText: string;
      choices?: string[];
      answer?: number;
      promptAnswer?: string;
    }>;
  };
}

export function HomeworkView({ homework }: HomeworkViewProps) {
  const [questions, setQuestions] = useState(homework.question);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [showResults, setShowResults] = useState(false);

  const hasQuestions = questions.length > 0;
  const isExpired =
    homework.deadlineAt && new Date(homework.deadlineAt) < new Date();

  const generateQuestions = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/homework/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectMatterId: homework.id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setQuestions(data.questions);
      } else {
        console.error("Failed to generate questions:", data.error);
      }
    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswer = (questionId: string, answer: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const submitAnswers = async () => {
    // TODO: Submit answers to backend for evaluation and personality assessment
    console.log("Submitting answers:", answers);
    setShowResults(true);
  };

  const formatDeadline = (deadline: string) => {
    return new Date(deadline).toLocaleString();
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Homework Assignment</CardTitle>
              <CardDescription>
                Read the subject matter and answer the generated questions
              </CardDescription>
            </div>
            {homework.deadlineAt && (
              <Badge variant={isExpired ? "destructive" : "secondary"}>
                Due: {formatDeadline(homework.deadlineAt)}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <h3>Subject Matter</h3>
            {homework.subjectMatter.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Questions Section */}
      {!hasQuestions ? (
        <Card>
          <CardHeader>
            <CardTitle>Generate Questions</CardTitle>
            <CardDescription>
              Click below to generate personalized questions based on the
              subject matter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={generateQuestions}
              disabled={isGenerating || Boolean(isExpired)}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                "Generate Questions"
              )}
            </Button>
            {isExpired && (
              <p className="text-sm text-red-600 mt-2">
                This homework has expired and cannot be completed.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </CardTitle>
                <CardDescription>
                  {currentQuestion?.type === "multiple_choices"
                    ? "Multiple Choice"
                    : "Essay Question"}
                </CardDescription>
              </div>
              <div className="text-sm text-gray-500">
                Progress: {Math.round(progress)}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion && (
              <div>
                <h3 className="font-medium text-lg mb-4">
                  {currentQuestion.questionText}
                </h3>

                {currentQuestion.type === "multiple_choices" &&
                  currentQuestion.choices && (
                    <div className="space-y-2">
                      {currentQuestion.choices.map((choice, choiceIndex) => (
                        <label
                          key={choiceIndex}
                          className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion.id}`}
                            value={choiceIndex}
                            checked={
                              answers[currentQuestion.id] === choiceIndex
                            }
                            onChange={() =>
                              handleAnswer(currentQuestion.id, choiceIndex)
                            }
                            className="text-blue-600"
                          />
                          <span>{choice}</span>
                        </label>
                      ))}
                    </div>
                  )}

                {currentQuestion.type === "essay" && (
                  <textarea
                    className="w-full h-32 p-3 border rounded-lg resize-none"
                    placeholder="Write your essay answer here..."
                    value={(answers[currentQuestion.id] as string) || ""}
                    onChange={(e) =>
                      handleAnswer(currentQuestion.id, e.target.value)
                    }
                  />
                )}
              </div>
            )}

            <div className="flex justify-between">
              <Button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                variant="outline"
              >
                Previous
              </Button>

              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={submitAnswers}
                  disabled={Object.keys(answers).length !== questions.length}
                >
                  Submit Answers
                </Button>
              ) : (
                <Button
                  onClick={nextQuestion}
                  disabled={!answers[currentQuestion?.id]}
                >
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle>Assessment Complete!</CardTitle>
            <CardDescription>
              Your answers have been submitted for evaluation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">
                Submission Successful
              </h4>
              <p className="text-green-600 text-sm">
                Your homework has been submitted. The AI will analyze your
                responses to provide personalized insights about your learning
                style and intellectual strengths.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
