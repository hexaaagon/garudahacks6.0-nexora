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
import { JoinClassroom } from "@/components/student/join-classroom";
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
  Brain,
  FileText,
  Calendar,
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
  const [completedHomework, setCompletedHomework] = useState<Assignment[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
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

        // Filter completed homework for separate display
        const completed = dbAssignments.filter(
          (a: Assignment) => a.status === "completed"
        );
        setCompletedHomework(completed);

        // Update stats
        setStats({
          totalClassrooms: classroomsData.success
            ? classroomsData.classrooms.length
            : 0,
          totalHomework: dbAssignments.length,
          completedHomework: completed.length,
          personalityType: classroomsData.success
            ? classroomsData.personalityType
            : undefined,
        });
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    await fetchData();
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Student Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user.name || user.email}!
            {stats.personalityType && (
              <Badge variant="secondary" className="ml-2">
                {stats.personalityType}
              </Badge>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <JoinClassroom onClassroomJoined={refreshData} />
        </div>
      </div>
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
            &nbsp; &nbsp; Click &quot;Start Assignment&quot; to begin a quiz
            immediately
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.filter((a) => a.status === "pending").length > 0 ? (
              assignments
                .filter((a) => a.status === "pending")
                .map((assignment) => (
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
                          <p className="text-gray-600 mb-2 ml-4">
                            {assignment.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 ml-4">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {assignment.subject}
                            </span>
                            <span>
                              ❓ {assignment.questionsCount} questions
                            </span>
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
                          <Link href={`/${assignment.subject.toLowerCase()}/1`}>
                            <Button className="flex items-center gap-2">
                              <Play className="h-4 w-4" />
                              Start Assignment
                            </Button>
                          </Link>
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
                    No Pending Assignments
                  </h3>
                  <p className="text-gray-600">
                    &nbsp; &nbsp; Great job! You&apos;ve completed all available
                    assignments. Check back later for new ones!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Completed Homework Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-green-600" />
            Completed Homework
          </CardTitle>
          <CardDescription>
            &nbsp; &nbsp; View your completed assignments powered by Puter AI
            personalization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  AI-Powered Personalization
                </h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  &nbsp; &nbsp; All homework is generated by Puter AI based on
                  your learning data and submission patterns. Each assignment
                  typically contains:
                </p>
                <ul className="text-sm text-blue-700 mt-2 ml-4 space-y-1">
                  <li>
                    &nbsp; &nbsp; • 10 multiple choice questions tailored to
                    your level
                  </li>
                  <li>
                    &nbsp; &nbsp; • 3 essay questions for deeper understanding
                  </li>
                  <li>
                    &nbsp; &nbsp; • Personalized difficulty based on your
                    progress
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {completedHomework.length > 0 ? (
              completedHomework.map((homework) => (
                <Card
                  key={homework.id}
                  className="border-l-4 border-l-green-500"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {homework.title}
                          </h3>
                          <Badge variant="secondary">
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Completed
                            </div>
                          </Badge>
                          {homework.difficulty && (
                            <Badge variant="outline">
                              {homework.difficulty}
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2 ml-4">
                          {homework.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 ml-4">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {homework.subject}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {homework.questionsCount} questions
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Completed:{" "}
                            {homework.dueDate
                              ? new Date(homework.dueDate).toLocaleDateString()
                              : "Recently"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Brain className="h-4 w-4" />
                            AI-Generated
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Results
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Completed Homework Yet
                  </h3>
                  <p className="text-gray-600">
                    &nbsp; &nbsp; Complete your first assignment to see it here.
                    Your progress will be tracked and used to personalize future
                    homework!
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
              &nbsp; &nbsp; Choose a classroom to view and complete homework
              assignments.
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
                    <p className="text-sm text-gray-600 mt-1 ml-4">
                      {classroom.subjects.join(", ")}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 ml-4">
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
              &nbsp; &nbsp; You haven&apos;t joined any classrooms yet. Ask your
              teacher for a classroom code to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
