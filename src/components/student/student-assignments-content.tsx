"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ClipboardList,
  Clock,
  Calendar,
  Play,
  CheckCircle,
  AlertCircle,
  Search,
  BookOpen,
  Trophy,
  Target,
} from "lucide-react";
import Link from "next/link";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  dueDate: string | null;
  status: "pending" | "completed" | "overdue";
  questionsCount: number;
  classroomId: string;
  classroomName?: string;
  teacherName?: string;
  score?: number;
  maxScore?: number;
  submittedAt?: string;
  estimatedTime?: number; // in minutes
}

interface StudentAssignmentsContentProps {
  user: AuthUser;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "hard":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-blue-100 text-blue-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4" />;
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "overdue":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <ClipboardList className="h-4 w-4" />;
  }
};

export function StudentAssignmentsContent({
  user,
}: StudentAssignmentsContentProps) {
  const searchParams = useSearchParams();
  const classFilter = searchParams.get("class");

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/student/homework");
      const data = await response.json();

      if (data.success) {
        const formattedAssignments: Assignment[] = data.homework.map(
          (hw: Record<string, unknown>) => {
            const questions = Array.isArray(hw.questions) ? hw.questions : [];
            const dueDate = typeof hw.dueDate === "string" ? hw.dueDate : null;
            const classroomId =
              typeof hw.classroomId === "string" ? hw.classroomId : "";

            return {
              id: String(hw.id || ""),
              title: String(hw.title || "Untitled Assignment"),
              description: String(hw.description || "No description provided"),
              subject: String(hw.subject || "General"),
              difficulty:
                (hw.difficulty as "easy" | "medium" | "hard") || "medium",
              dueDate,
              status: Boolean(hw.isSubmitted)
                ? "completed"
                : dueDate && new Date(dueDate) < new Date()
                ? "overdue"
                : "pending",
              questionsCount: questions.length,
              classroomId,
              classroomName: `Class ${classroomId.slice(-6)}`, // Mock classroom name
              score: typeof hw.score === "number" ? hw.score : undefined,
              maxScore: 100,
              submittedAt:
                typeof hw.submittedAt === "string" ? hw.submittedAt : undefined,
              estimatedTime: Math.max(5, questions.length * 2), // 2 min per question
            };
          }
        );
        setAssignments(formattedAssignments);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || assignment.status === statusFilter;
    const matchesDifficulty =
      difficultyFilter === "all" || assignment.difficulty === difficultyFilter;
    const matchesClass = !classFilter || assignment.classroomId === classFilter;

    return matchesSearch && matchesStatus && matchesDifficulty && matchesClass;
  });

  const stats = {
    total: assignments.length,
    completed: assignments.filter((a) => a.status === "completed").length,
    pending: assignments.filter((a) => a.status === "pending").length,
    overdue: assignments.filter((a) => a.status === "overdue").length,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
          <p className="text-gray-600">Loading your assignments...</p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-20 bg-gray-100 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
        <p className="text-gray-600">
          Complete your homework and track your progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClipboardList className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.completed}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.overdue}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ClipboardList className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Assignments Found
            </h3>
            <p className="text-gray-600">
              {assignments.length === 0
                ? "You don't have any assignments yet. Check back later!"
                : "No assignments match your current filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAssignments.map((assignment) => (
            <Card
              key={assignment.id}
              className="hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {assignment.title}
                      </h3>
                      <div className="flex gap-2 shrink-0">
                        <Badge
                          className={getDifficultyColor(assignment.difficulty)}
                        >
                          {assignment.difficulty}
                        </Badge>
                        <Badge className={getStatusColor(assignment.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(assignment.status)}
                            {assignment.status}
                          </span>
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {assignment.description.length > 100
                        ? `${assignment.description.substring(0, 100)}...`
                        : assignment.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{assignment.subject}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        <span>{assignment.questionsCount} questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>~{assignment.estimatedTime} min</span>
                      </div>
                      {assignment.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Due{" "}
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {assignment.status === "completed" &&
                      assignment.score !== undefined && (
                        <div className="mt-3 flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">
                            Score: {assignment.score}/{assignment.maxScore}
                            <span className="text-gray-500 ml-1">
                              (
                              {Math.round(
                                (assignment.score /
                                  (assignment.maxScore || 100)) *
                                  100
                              )}
                              %)
                            </span>
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    {assignment.status === "completed" ? (
                      <Button variant="outline" size="sm">
                        View Results
                      </Button>
                    ) : (
                      <Link
                        href={`/dashboard/student/assignments/${assignment.id}`}
                      >
                        <Button className="flex items-center gap-2">
                          <Play className="h-4 w-4" />
                          Start Assignment
                        </Button>
                      </Link>
                    )}

                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
