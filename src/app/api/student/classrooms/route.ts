import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/database/drizzle";
import { student } from "@/lib/database/drizzle/schema/student";
import { classroom } from "@/lib/database/drizzle/schema/classroom";
import {
  homework,
  homeworkSubmission,
} from "@/lib/database/drizzle/schema/homework";
import { personalityAssessment } from "@/lib/database/drizzle/schema/personality";
import { eq, count, inArray } from "drizzle-orm";

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

    // Get student's classrooms
    let classrooms: Array<{
      id: string;
      name: string;
      subjects: string[];
      shareCode: string;
    }> = [];
    let totalHomework = 0;

    if (classroomIds.length > 0) {
      classrooms = await db
        .select({
          id: classroom.id,
          name: classroom.name,
          subjects: classroom.subjects,
          shareCode: classroom.shareCode,
        })
        .from(classroom)
        .where(inArray(classroom.id, classroomIds));

      // Get homework stats for all classrooms
      const homeworkStats = await db
        .select({
          total: count(),
        })
        .from(homework)
        .where(inArray(homework.classroomId, classroomIds));

      totalHomework = homeworkStats[0]?.total || 0;
    }

    // Get completed homework count
    const completedHomeworkStats = await db
      .select({
        completed: count(),
      })
      .from(homeworkSubmission)
      .where(eq(homeworkSubmission.studentId, studentData.id));

    // Get personality assessment
    const personalityData = await db
      .select()
      .from(personalityAssessment)
      .where(eq(personalityAssessment.studentId, studentData.id))
      .limit(1);

    return NextResponse.json({
      success: true,
      classrooms: classrooms,
      totalHomework: totalHomework,
      completedHomework: completedHomeworkStats[0]?.completed || 0,
      personalityType: personalityData[0]?.personalityType || null,
    });
  } catch (error) {
    console.error("Error fetching student classrooms:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
