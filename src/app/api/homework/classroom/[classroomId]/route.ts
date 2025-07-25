import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/database/drizzle";
import { homework } from "@/lib/database/drizzle/schema/homework";
import { classroom } from "@/lib/database/drizzle/schema/classroom";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classroomId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { classroomId } = await params;

    // Check if user has permission to view this classroom's homework
    const classroomRecord = await db
      .select()
      .from(classroom)
      .where(eq(classroom.id, classroomId))
      .limit(1);

    if (classroomRecord.length === 0) {
      return NextResponse.json(
        { error: "Classroom not found" },
        { status: 404 }
      );
    }

    const classroomData = classroomRecord[0];

    // Check if user is the teacher or an admin
    const hasPermission =
      classroomData.teacherId === session.user.id ||
      (classroomData.adminIds &&
        classroomData.adminIds.includes(session.user.id));

    if (!hasPermission) {
      return NextResponse.json(
        {
          error: "You don't have permission to view homework in this classroom",
        },
        { status: 403 }
      );
    }

    // Fetch homework for this classroom
    const homeworkList = await db
      .select()
      .from(homework)
      .where(
        and(eq(homework.classroomId, classroomId), eq(homework.isActive, true))
      )
      .orderBy(homework.createdAt);

    return NextResponse.json({
      success: true,
      homework: homeworkList,
    });
  } catch (error) {
    console.error("Homework fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
