"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ClipboardList,
  Calendar,
  Users,
  BarChart3,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  BookOpen,
  Trophy,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

interface HomeworkItem {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  classroomId: string;
  classroomName: string;
  dueDate?: string;
  questionsCount: number;
  submissionCount: number;
  totalStudents: number;
  averageScore?: number;
  createdAt: string;
  isActive: boolean;
}

interface TeacherHomeworkContentProps {
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

export function TeacherHomeworkContent({ user }: TeacherHomeworkContentProps) {
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [classroomFilter, setClassroomFilter] = useState<string>("all");

  useEffect(() => {
    fetchHomework();
  }, []);

  const fetchHomework = async () => {
    try {
      setIsLoading(true);

      // First get teacher's classrooms
      const classroomsResponse = await fetch("/api/teacher/classrooms");
      const classroomsData = await classroomsResponse.json();

      if (classroomsData.success) {
        const allHomework: HomeworkItem[] = [];

        // Fetch homework for each classroom
        for (const classroom of classroomsData.classrooms) {
          try {
            const homeworkResponse = await fetch(
              `/api/homework/classroom/${classroom.id}`
            );
            const homeworkData = await homeworkResponse.json();

            if (homeworkData.success) {
              const classroomHomework: HomeworkItem[] =
                homeworkData.homework.map((hw: Record<string, unknown>) => ({
                  id: hw.id,
                  title: hw.title,
                  description: hw.description || "No description",
                  subject: hw.subject,
                  difficulty: hw.difficulty,
                  classroomId: classroom.id,
                  classroomName: classroom.name,
                  dueDate: hw.dueDate,
                  questionsCount: Array.isArray(hw.questions)
                    ? hw.questions.length
                    : 0,
                  submissionCount: hw.submissionCount || 0,
                  totalStudents: classroom.studentCount || 0,
                  averageScore: hw.averageScore,
                  createdAt: hw.createdAt,
                  isActive: hw.isActive !== false,
                }));

              allHomework.push(...classroomHomework);
            }
          } catch (error) {
            console.error(
              `Error fetching homework for classroom ${classroom.id}:`,
              error
            );
          }
        }

        setHomework(allHomework);
      }
    } catch (error) {
      console.error("Error fetching homework:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHomework = homework.filter((hw) => {
    const matchesSearch =
      hw.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hw.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClassroom =
      classroomFilter === "all" || hw.classroomId === classroomFilter;

    return matchesSearch && matchesClassroom;
  });

  const stats = {
    total: homework.length,
    active: homework.filter((hw) => hw.isActive).length,
    totalSubmissions: homework.reduce((sum, hw) => sum + hw.submissionCount, 0),
    averageScore:
      homework.length > 0
        ? Math.round(
            homework.reduce((sum, hw) => sum + (hw.averageScore || 0), 0) /
              homework.length
          )
        : 0,
  };

  const uniqueClassrooms = Array.from(
    new Set(
      homework.map((hw) => ({
        id: hw.classroomId,
        name: hw.classroomName,
      }))
    )
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Homework</h1>
          <p className="text-gray-600">Loading homework assignments...</p>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Homework</h1>
          <p className="text-gray-600">
            Manage and track all your homework assignments
          </p>
        </div>
        <Link href="/dashboard/teacher/homework/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Homework
          </Button>
        </Link>
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
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.active}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Submissions</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.totalSubmissions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Trophy className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.averageScore}%
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
                  placeholder="Search homework..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <select
              value={classroomFilter}
              onChange={(e) => setClassroomFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Classes</option>
              {uniqueClassrooms.map((classroom) => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Homework List */}
      {filteredHomework.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ClipboardList className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Homework Found
            </h3>
            <p className="text-gray-600 mb-6">
              {homework.length === 0
                ? "You haven't created any homework yet."
                : "No homework matches your current filters."}
            </p>
            <Link href="/dashboard/teacher/homework/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Homework
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredHomework.map((hw) => (
            <Card
              key={hw.id}
              className="hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {hw.title}
                      </h3>
                      <div className="flex gap-2 shrink-0">
                        <Badge className={getDifficultyColor(hw.difficulty)}>
                          {hw.difficulty}
                        </Badge>
                        {!hw.isActive && (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {hw.description.length > 100
                        ? `${hw.description.substring(0, 100)}...`
                        : hw.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{hw.classroomName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClipboardList className="h-4 w-4" />
                        <span>{hw.questionsCount} questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {hw.submissionCount}/{hw.totalStudents} submitted
                        </span>
                      </div>
                      {hw.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Due {new Date(hw.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          Created {new Date(hw.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {hw.averageScore !== undefined && (
                      <div className="mt-3 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">
                          Average Score: {Math.round(hw.averageScore)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Results
                    </Button>

                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
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
