import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/database/drizzle";
import { student } from "@/lib/database/drizzle/schema/student";
import {
  homework,
  homeworkSubmission,
} from "@/lib/database/drizzle/schema/homework";
import { classroom } from "@/lib/database/drizzle/schema/classroom";
import { eq, inArray, and, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get student record
    const studentRecord = await db
      .select()
      .from(student)
      .where(eq(student.id, session.user.id))
      .limit(1);

    if (studentRecord.length === 0) {
      return NextResponse.json(
        { success: false, error: "Student record not found" },
        { status: 404 }
      );
    }

    const studentData = studentRecord[0];
    const classroomIds = studentData.classroomIds || [];

    if (classroomIds.length === 0) {
      return NextResponse.json({
        success: true,
        assignments: [],
      });
    }

    // Get all homework assignments for the student's classrooms
    const assignments = await db
      .select({
        id: homework.id,
        title: homework.title,
        description: homework.description,
        subject: homework.subject,
        difficulty: homework.difficulty,
        dueDate: homework.dueDate,
        isActive: homework.isActive,
        createdAt: homework.createdAt,
        questionsCount: homework.questions,
        classroomName: classroom.name,
        classroomId: homework.classroomId,
      })
      .from(homework)
      .innerJoin(classroom, eq(homework.classroomId, classroom.id))
      .where(
        and(
          inArray(homework.classroomId, classroomIds),
          eq(homework.isActive, true)
        )
      )
      .orderBy(desc(homework.createdAt));

    // Get submission status for each assignment
    const assignmentIds = assignments.map((a) => a.id);
    let submissions: Array<{ homeworkId: string; submittedAt: Date }> = [];

    if (assignmentIds.length > 0) {
      submissions = await db
        .select({
          homeworkId: homeworkSubmission.homeworkId,
          submittedAt: homeworkSubmission.submittedAt,
        })
        .from(homeworkSubmission)
        .where(
          and(
            eq(homeworkSubmission.studentId, session.user.id),
            inArray(homeworkSubmission.homeworkId, assignmentIds)
          )
        );
    }

    // Create a map of submissions for easy lookup
    const submissionMap = new Map(
      submissions.map((s) => [s.homeworkId, s.submittedAt])
    );

    // Format assignments for the frontend
    const formattedAssignments = assignments.map((assignment) => {
      const isSubmitted = submissionMap.has(assignment.id);
      const isOverdue =
        assignment.dueDate && new Date() > assignment.dueDate && !isSubmitted;

      return {
        id: assignment.id,
        title: assignment.title,
        subject: assignment.subject,
        description: assignment.description || "No description provided",
        dueDate: assignment.dueDate
          ? assignment.dueDate.toISOString().split("T")[0]
          : null,
        status: isSubmitted ? "completed" : isOverdue ? "overdue" : "pending",
        questionsCount: Array.isArray(assignment.questionsCount)
          ? assignment.questionsCount.length
          : 0,
        classroomId: assignment.classroomId,
        classroomName: assignment.classroomName,
        difficulty: assignment.difficulty,
        createdAt: assignment.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      assignments: formattedAssignments,
    });
  } catch (error) {
    console.error("Error fetching student assignments:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
