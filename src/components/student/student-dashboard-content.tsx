"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StudentHomeworkView } from "@/components/homework/student-homework-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  ClipboardList,
  Trophy,
  Play,
  Clock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

interface StudentStats {
  totalClassrooms: number;
  totalHomework: number;
  completedHomework: number;
  personalityType?: string;
}

interface Classroom {
  id: string;
  name: string;
  subjects: string[];
  shareCode: string;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string | null;
  status: "pending" | "completed" | "overdue";
  questionsCount: number;
  classroomId: string;
  classroomName?: string;
  difficulty?: string;
}

interface StudentDashboardContentProps {
  user: AuthUser;
}

// Placeholder assignments data - TODO: Replace with database fetch
const placeholderAssignments: Assignment[] = [
  {
    id: "math-quiz-1",
    title: "Mathematics Quiz #1",
    subject: "Mathematics",
    description: "Basic arithmetic and algebra questions",
    dueDate: "2025-07-30",
    status: "pending",
    questionsCount: 10,
    classroomId: "classroom-1",
  },
  {
    id: "science-quiz-1",
    title: "Science Quiz #1",
    subject: "Science",
    description: "General science knowledge",
    dueDate: "2025-08-01",
    status: "pending",
    questionsCount: 10,
    classroomId: "classroom-1",
  },
  {
    id: "history-quiz-1",
    title: "History Quiz #1",
    subject: "History",
    description: "World War II and modern history",
    dueDate: "2025-08-05",
    status: "completed",
    questionsCount: 10,
    classroomId: "classroom-2",
  },
];

export function StudentDashboardContent({
  user,
}: StudentDashboardContentProps) {
  const [stats, setStats] = useState<StudentStats>({
    totalClassrooms: 0,
    totalHomework: 0,
    completedHomework: 0,
  });
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch student's classrooms and assignments in parallel
        const [classroomsResponse, assignmentsResponse] = await Promise.all([
          fetch("/api/student/classrooms"),
          fetch("/api/student/assignments"),
        ]);

        const classroomsData = await classroomsResponse.json();
        const assignmentsData = await assignmentsResponse.json();

        // Set classrooms
        if (classroomsData.success) {
          setClassrooms(classroomsData.classrooms);

          // Set first classroom as selected by default
          if (classroomsData.classrooms.length > 0) {
            setSelectedClassroom(classroomsData.classrooms[0].id);
          }
        }

        // Set assignments from database
        const dbAssignments = assignmentsData.success
          ? assignmentsData.assignments
          : [];
        setAssignments(dbAssignments);

        // Update stats
        setStats({
          totalClassrooms: classroomsData.success
            ? classroomsData.classrooms.length
            : 0,
          totalHomework: dbAssignments.length,
          completedHomework: dbAssignments.filter(
            (a: Assignment) => a.status === "completed"
          ).length,
          personalityType: classroomsData.success
            ? classroomsData.personalityType
            : undefined,
        });
      } catch (error) {
        console.error("Error fetching student data:", error);
        // On error, show placeholder assignments as fallback
        setAssignments(placeholderAssignments);
        setStats({
          totalClassrooms: 0,
          totalHomework: placeholderAssignments.length,
          completedHomework: placeholderAssignments.filter(
            (a) => a.status === "completed"
          ).length,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user.name || user.email}!
          {stats.personalityType && (
            <Badge variant="secondary" className="ml-2">
              {stats.personalityType}
            </Badge>
          )}
        </p>
      </div>{" "}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Classes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : stats.totalClassrooms}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ClipboardList className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Homework
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : stats.totalHomework}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : stats.completedHomework}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Available Assignments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Available Assignments
          </CardTitle>
          <CardDescription>
            Click &quot;Start Assignment&quot; to begin a quiz immediately
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <Card
                  key={assignment.id}
                  className="border-l-4 border-l-blue-500"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {assignment.title}
                          </h3>
                          <Badge
                            variant={
                              assignment.status === "pending"
                                ? "default"
                                : assignment.status === "completed"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            <div className="flex items-center gap-1">
                              {assignment.status === "pending" && (
                                <Clock className="h-3 w-3" />
                              )}
                              {assignment.status === "completed" && (
                                <CheckCircle className="h-3 w-3" />
                              )}
                              {assignment.status.charAt(0).toUpperCase() +
                                assignment.status.slice(1)}
                            </div>
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">
                          {assignment.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {assignment.subject}
                          </span>
                          <span>❓ {assignment.questionsCount} questions</span>
                          <span>
                            📅 Due:{" "}
                            {assignment.dueDate
                              ? new Date(
                                  assignment.dueDate
                                ).toLocaleDateString()
                              : "No due date"}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        {assignment.status === "pending" ? (
                          <Link href={`/${assignment.subject.toLowerCase()}/1`}>
                            <Button className="flex items-center gap-2">
                              <Play className="h-4 w-4" />
                              Start Assignment
                            </Button>
                          </Link>
                        ) : assignment.status === "completed" ? (
                          <Button variant="outline" disabled>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Completed
                          </Button>
                        ) : (
                          <Button variant="destructive" disabled>
                            Overdue
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Assignments Yet
                  </h3>
                  <p className="text-gray-600">
                    Your teacher hasn&apos;t created any assignments yet. Check
                    back later!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Classroom Selection */}
      {classrooms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Classroom</CardTitle>
            <CardDescription>
              Choose a classroom to view and complete homework assignments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classrooms.map((classroom) => (
                <Card
                  key={classroom.id}
                  className={`cursor-pointer transition-colors ${
                    selectedClassroom === classroom.id
                      ? "border-blue-500 bg-blue-50"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedClassroom(classroom.id)}
                >
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900">
                      {classroom.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {classroom.subjects.join(", ")}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Code: {classroom.shareCode}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {/* Homework View */}
      {selectedClassroom ? (
        <StudentHomeworkView classroomId={selectedClassroom} />
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Classrooms Yet
            </h3>
            <p className="text-gray-600 mb-4">
              You haven&apos;t joined any classrooms yet. Ask your teacher for a
              classroom code to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
