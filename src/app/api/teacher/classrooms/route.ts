import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/database/drizzle";
import { classroom } from "@/lib/database/drizzle/schema/classroom";
import { homework } from "@/lib/database/drizzle/schema/homework";
import { teacher } from "@/lib/database/drizzle/schema/teacher";
import { student } from "@/lib/database/drizzle/schema/student";
import { eq, sql, and } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a teacher
    const teacherRecord = await db
      .select()
      .from(teacher)
      .where(eq(teacher.id, session.user.id))
      .limit(1);

    if (teacherRecord.length === 0) {
      return NextResponse.json(
        { error: "Only teachers can access classrooms" },
        { status: 403 }
      );
    }

    // Get all classrooms for this teacher
    const classrooms = await db
      .select({
        id: classroom.id,
        name: classroom.name,
        description: classroom.description,
        grade: classroom.grade,
        subjects: classroom.subjects,
        shareCode: classroom.shareCode,
        adminIds: classroom.adminIds,
        createdAt: classroom.createdAt,
        updatedAt: classroom.updatedAt,
      })
      .from(classroom)
      .where(eq(classroom.teacherId, session.user.id));

    // Get homework count and student count for each classroom
    const enrichedClassrooms = await Promise.all(
      classrooms.map(async (classroomData) => {
        // Count homework for this classroom
        const homeworkCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(homework)
          .where(
            and(
              eq(homework.classroomId, classroomData.id),
              eq(homework.isActive, true)
            )
          );

        // Count students in this classroom
        const studentCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(student)
          .where(sql`${classroomData.id} = ANY(${student.classroomIds})`);

        return {
          ...classroomData,
          homeworkCount: homeworkCount[0]?.count || 0,
          studentCount: studentCount[0]?.count || 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      classrooms: enrichedClassrooms,
    });
  } catch (error) {
    console.error("Error fetching teacher classrooms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
