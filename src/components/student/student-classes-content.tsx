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
import { JoinClassroom } from "@/components/student/join-classroom";
import {
  Users,
  BookOpen,
  GraduationCap,
  ExternalLink,
  Calendar,
} from "lucide-react";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

interface Classroom {
  id: string;
  name: string;
  description?: string;
  grade: string;
  subjects: string[];
  shareCode: string;
  teacherName?: string;
  studentCount?: number;
  homeworkCount?: number;
  joinedAt?: string;
}

interface StudentClassesContentProps {
  user: AuthUser;
}

export function StudentClassesContent({ user }: StudentClassesContentProps) {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/student/classrooms");
      const data = await response.json();

      if (data.success) {
        setClassrooms(data.classrooms);
      }
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
          <p className="text-gray-600">Loading your enrolled classes...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
          <p className="text-gray-600">
            Manage your enrolled classes and join new ones
          </p>
        </div>
        <JoinClassroom onClassroomJoined={fetchClassrooms} />
      </div>

      {classrooms.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Classes Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven&apos;t joined any classes yet. Ask your teacher for a
              classroom code or use the join button to get started.
            </p>
            <JoinClassroom onClassroomJoined={fetchClassrooms} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom) => (
            <Card
              key={classroom.id}
              className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold mb-1">
                      {classroom.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Grade {classroom.grade}
                      {classroom.teacherName && ` • ${classroom.teacherName}`}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {classroom.shareCode}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Subjects */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Subjects
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {classroom.subjects.map((subject, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Description */}
                {classroom.description && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Description
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {classroom.description}
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="flex justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{classroom.studentCount || 0} students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{classroom.homeworkCount || 0} homework</span>
                  </div>
                </div>

                {/* Join Date */}
                {classroom.joinedAt && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Joined {new Date(classroom.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      (window.location.href = `/student/assignments?class=${classroom.id}`)
                    }
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    View Homework
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      (window.location.href = `/classroom/${classroom.id}`)
                    }
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {classrooms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {classrooms.length}
                </div>
                <div className="text-sm text-gray-600">Total Classes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {classrooms.reduce(
                    (sum, c) => sum + (c.homeworkCount || 0),
                    0
                  )}
                </div>
                <div className="text-sm text-gray-600">Total Homework</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {classrooms.reduce(
                    (sum, c) => sum + (c.studentCount || 0),
                    0
                  )}
                </div>
                <div className="text-sm text-gray-600">Total Classmates</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
