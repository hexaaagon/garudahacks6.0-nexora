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
import { CreateHomework } from "@/components/homework/create-homework";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Users, BookOpen, ClipboardList } from "lucide-react";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

interface Classroom {
  id: string;
  name: string;
  grade: string;
  subjects: string[];
  shareCode: string;
  studentCount?: number;
  homeworkCount?: number;
}

interface TeacherDashboardContentProps {
  user: AuthUser | null;
}

interface ClassroomStats {
  totalClasses: number;
  totalHomework: number;
  totalStudents: number;
}

export function TeacherDashboardContent({
  user,
}: TeacherDashboardContentProps) {
  const [stats, setStats] = useState<ClassroomStats>({
    totalClasses: 0,
    totalHomework: 0,
    totalStudents: 0,
  });
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClassroom, setSelectedClassroom] = useState<string>("");
  const [showCreateHomework, setShowCreateHomework] = useState(false);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  // Tambahkan dependency pada showCreateHomework agar data di-refresh setelah dialog ditutup
  useEffect(() => {
    if (!showCreateHomework) {
      fetchTeacherData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCreateHomework]);

  const fetchTeacherData = async () => {
    try {
      setIsLoading(true);

      // Fetch teacher's classrooms
      const classroomsResponse = await fetch("/api/teacher/classrooms", {
        cache: "no-store",
      });
      const classroomsData = await classroomsResponse.json();

      if (classroomsData.success) {
        setClassrooms(classroomsData.classrooms);
        setStats({
          totalClasses: classroomsData.classrooms.length,
          totalHomework: classroomsData.classrooms.reduce(
            (sum: number, classroom: Classroom) =>
              sum + (classroom.homeworkCount || 0),
            0
          ),
          totalStudents: classroomsData.classrooms.reduce(
            (sum: number, classroom: Classroom) =>
              sum + (classroom.studentCount || 0),
            0
          ),
        });
      }
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHomeworkCreated = () => {
    setShowCreateHomework(false);
    // fetchTeacherData(); // Tidak perlu, sudah di-handle oleh useEffect di atas
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.name || user?.email}!
        </p>
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
                  {isLoading ? "..." : stats.totalClasses}
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
                <p className="text-sm font-medium text-gray-600">Homework</p>
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
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : stats.totalStudents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2"
              onClick={() => (window.location.href = "/setup")}
            >
              <Plus className="h-5 w-5" />
              <span>Create New Class</span>
            </Button>

            <Dialog
              open={showCreateHomework}
              onOpenChange={setShowCreateHomework}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2"
                  disabled={classrooms.length === 0}
                >
                  <ClipboardList className="h-5 w-5" />
                  <span>Create Homework</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Homework</DialogTitle>
                  <DialogDescription>
                    Choose a classroom and create homework for your students.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {classrooms.length === 0 ? (
                    <p className="text-center text-gray-600 py-4">
                      You need to create a classroom first before creating
                      homework.
                    </p>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Classroom
                        </label>
                        <select
                          value={selectedClassroom}
                          onChange={(e) => setSelectedClassroom(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Choose a classroom...</option>
                          {classrooms.map((classroom) => (
                            <option key={classroom.id} value={classroom.id}>
                              {classroom.name} - {classroom.grade}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedClassroom && (
                        <CreateHomework
                          classroomId={selectedClassroom}
                          onHomeworkCreated={handleHomeworkCreated}
                        />
                      )}
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Classrooms List */}
      {classrooms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>My Classrooms</CardTitle>
            <CardDescription>
              Manage your classes and their homework
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classrooms.map((classroom) => (
                <div
                  key={classroom.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {classroom.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {classroom.grade} • {classroom.subjects?.join(", ")} •
                      Share Code: {classroom.shareCode}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">
                        {classroom.studentCount || 0}
                      </p>
                      <p className="text-xs text-gray-500">Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">
                        {classroom.homeworkCount || 0}
                      </p>
                      <p className="text-xs text-gray-500">Homework</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedClassroom(classroom.id);
                        setShowCreateHomework(true);
                      }}
                    >
                      Add Homework
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {classrooms.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Classrooms Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by creating your first classroom to manage students
              and homework.
            </p>
            <Button onClick={() => (window.location.href = "/setup")}>
              Create Your First Class
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
