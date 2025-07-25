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
        grades: [],
        averageScore: 0,
        totalSubmissions: 0,
      });
    }

    // Get all homework submissions for the student
    const submissions = await db
      .select({
        id: homeworkSubmission.id,
        score: homeworkSubmission.score,
        totalQuestions: homeworkSubmission.totalQuestions,
        submittedAt: homeworkSubmission.submittedAt,
        timeSpentMinutes: homeworkSubmission.timeSpentMinutes,
        homeworkTitle: homework.title,
        homeworkSubject: homework.subject,
        homeworkDifficulty: homework.difficulty,
        classroomName: classroom.name,
      })
      .from(homeworkSubmission)
      .innerJoin(homework, eq(homeworkSubmission.homeworkId, homework.id))
      .innerJoin(classroom, eq(homework.classroomId, classroom.id))
      .where(
        and(
          eq(homeworkSubmission.studentId, session.user.id),
          inArray(homework.classroomId, classroomIds)
        )
      )
      .orderBy(desc(homeworkSubmission.submittedAt));

    // Calculate statistics
    const totalSubmissions = submissions.length;
    let totalScore = 0;
    let totalPossibleScore = 0;

    const formattedGrades = submissions.map((submission) => {
      const percentage = Math.round(
        (submission.score / submission.totalQuestions) * 100
      );
      totalScore += submission.score;
      totalPossibleScore += submission.totalQuestions;

      return {
        id: submission.id,
        homeworkTitle: submission.homeworkTitle,
        subject: submission.homeworkSubject,
        difficulty: submission.homeworkDifficulty,
        classroomName: submission.classroomName,
        score: submission.score,
        totalQuestions: submission.totalQuestions,
        percentage: percentage,
        grade: getLetterGrade(percentage),
        submittedAt: submission.submittedAt,
        timeSpentMinutes: submission.timeSpentMinutes,
      };
    });

    const averageScore =
      totalPossibleScore > 0
        ? Math.round((totalScore / totalPossibleScore) * 100)
        : 0;

    return NextResponse.json({
      success: true,
      grades: formattedGrades,
      averageScore,
      totalSubmissions,
      averageGrade: getLetterGrade(averageScore),
    });
  } catch (error) {
    console.error("Error fetching student grades:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getLetterGrade(percentage: number): string {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
}
