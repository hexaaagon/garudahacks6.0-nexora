import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/database/drizzle";
import { homework } from "@/lib/database/drizzle/schema/homework";
import { student } from "@/lib/database/drizzle/schema/student";
import { homeworkSubmission } from "@/lib/database/drizzle/schema/homework";
import { eq, sql, and } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a student
    const studentRecord = await db
      .select()
      .from(student)
      .where(eq(student.id, session.user.id))
      .limit(1);

    if (studentRecord.length === 0) {
      return NextResponse.json(
        { error: "Only students can access homework" },
        { status: 403 }
      );
    }

    const studentData = studentRecord[0];

    // Get homework from all classrooms the student is enrolled in
    const homeworkList = await db
      .select({
        id: homework.id,
        classroomId: homework.classroomId,
        title: homework.title,
        description: homework.description,
        subject: homework.subject,
        difficulty: homework.difficulty,
        questions: homework.questions,
        dueDate: homework.dueDate,
        createdAt: homework.createdAt,
      })
      .from(homework)
      .where(
        and(
          sql`${homework.classroomId} = ANY(${studentData.classroomIds})`,
          eq(homework.isActive, true)
        )
      )
      .orderBy(homework.createdAt);

    // Get submission status for each homework
    const enrichedHomework = await Promise.all(
      homeworkList.map(async (hw) => {
        const submission = await db
          .select()
          .from(homeworkSubmission)
          .where(
            and(
              eq(homeworkSubmission.homeworkId, hw.id),
              eq(homeworkSubmission.studentId, session.user.id)
            )
          )
          .limit(1);

        return {
          ...hw,
          isSubmitted: submission.length > 0,
          submissionId: submission[0]?.id || null,
          submittedAt: submission[0]?.submittedAt || null,
          score: submission[0]?.score || null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      homework: enrichedHomework,
    });
  } catch (error) {
    console.error("Student homework fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
