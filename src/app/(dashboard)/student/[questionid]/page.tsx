"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Placeholder data structure for easy DB integration later
// TODO: Replace with database fetch based on assignment/subject and subjectname
const questions = [
  {
    id: "1",
    question: "What is the capital of France?",
    choices: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: 2,
    explanation:
      "Paris is the capital and largest city of France, located on the Seine River in the north-central part of the country.",
  },
  {
    id: "2",
    question: "Which of the following is a programming language?",
    choices: ["HTML", "CSS", "JavaScript", "XML"],
    answer: 2,
    explanation:
      "JavaScript is a programming language, while HTML, CSS, and XML are markup languages.",
  },
  {
    id: "3",
    question: "What is 2 + 2?",
    choices: ["3", "4", "5", "6"],
    answer: 1,
    explanation: "2 + 2 equals 4. This is basic arithmetic.",
  },
  {
    id: "4",
    question: "Which planet is closest to the Sun?",
    choices: ["Venus", "Mercury", "Earth", "Mars"],
    answer: 1,
    explanation:
      "Mercury is the closest planet to the Sun in our solar system.",
  },
  {
    id: "5",
    question: "What does HTML stand for?",
    choices: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlink and Text Markup Language",
    ],
    answer: 0,
    explanation:
      "HTML stands for Hyper Text Markup Language, which is used to create web pages.",
  },
  {
    id: "6",
    question: "Which of these is NOT a primary color?",
    choices: ["Red", "Blue", "Green", "Yellow"],
    answer: 2,
    explanation:
      "Green is not a primary color. The primary colors are red, blue, and yellow.",
  },
  {
    id: "7",
    question: "What is the largest mammal in the world?",
    choices: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    answer: 1,
    explanation:
      "The Blue Whale is the largest mammal and the largest animal ever known to have lived on Earth.",
  },
  {
    id: "8",
    question: "In which year did World War II end?",
    choices: ["1944", "1945", "1946", "1947"],
    answer: 1,
    explanation:
      "World War II ended in 1945 with the surrender of Japan in September.",
  },
  {
    id: "9",
    question: "What is the chemical symbol for gold?",
    choices: ["Go", "Gd", "Au", "Ag"],
    answer: 2,
    explanation:
      "Au is the chemical symbol for gold, derived from the Latin word 'aurum'.",
  },
  {
    id: "10",
    question: "Which continent is the largest by land area?",
    choices: ["Africa", "Asia", "North America", "Europe"],
    answer: 1,
    explanation:
      "Asia is the largest continent by both land area and population.",
  },
];

export default function QuizPage({
  params,
}: {
  params: Promise<{ subjectname: string; questionid: string }>;
}) {
  const router = useRouter();
  const [subjectname, setSubjectname] = useState<string>("");
  const [questionid, setQuestionid] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setSubjectname(resolvedParams.subjectname);
      setQuestionid(resolvedParams.questionid);
      setIsLoading(false);
    };
    resolveParams();
  }, [params]);

  const currentQuestionIndex = questions.findIndex((q) => q.id === questionid);
  const question = questions[currentQuestionIndex] || questions[0];
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  if (isLoading) {
    return <div className="max-w-2xl mx-auto p-6">Loading...</div>;
  }

  const handleAnswer = (idx: number) => {
    setSelected(idx);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      router.push(`/${subjectname}/${questions[currentQuestionIndex + 1].id}`);
    } else {
      // Finished all questions, could redirect to results or back to dashboard
      alert("Assignment completed! Great job!");
      router.push("/dashboard/student");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      router.push(`/${subjectname}/${questions[currentQuestionIndex - 1].id}`);
    }
  };

  const handleFinish = () => {
    // TODO: Save results to database
    alert(`${subjectname} assignment completed! Great job!`);
    router.push("/dashboard/student");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">
          {subjectname.charAt(0).toUpperCase() + subjectname.slice(1)} -
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          ></div>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">{question.question}</h2>
        <div className="space-y-3 mb-6">
          {question.choices.map((choice, idx) => (
            <button
              key={idx}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                selected === idx
                  ? idx === question.answer
                    ? "bg-green-100 border-green-500 text-green-800"
                    : "bg-red-100 border-red-500 text-red-800"
                  : "bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              }`}
              disabled={selected !== null}
              onClick={() => handleAnswer(idx)}
            >
              <span className="font-medium mr-2">
                {String.fromCharCode(65 + idx)}.
              </span>
              {choice}
            </button>
          ))}
        </div>

        {showExplanation && (
          <div
            className={`p-4 rounded-lg ${
              selected === question.answer
                ? "bg-green-50 border-l-4 border-green-500"
                : "bg-red-50 border-l-4 border-red-500"
            }`}
          >
            <div
              className={`font-bold text-lg mb-2 ${
                selected === question.answer ? "text-green-800" : "text-red-800"
              }`}
            >
              {selected === question.answer ? "✅ Correct!" : "❌ Incorrect"}
            </div>
            <div className="text-gray-700">{question.explanation}</div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <Button
            onClick={
              currentQuestionIndex === questions.length - 1
                ? handleFinish
                : handleNext
            }
            disabled={!showExplanation}
          >
            {currentQuestionIndex === questions.length - 1
              ? "Finish Assignment"
              : "Next Question"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
