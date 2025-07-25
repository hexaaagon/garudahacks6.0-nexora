import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/database/drizzle";
import { classroomSubject } from "@/lib/database/drizzle/schema/classroom";
import { student } from "@/lib/database/drizzle/schema/student";
import { eq } from "drizzle-orm";

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

    // Check if user is a student
    const studentRecord = await db
      .select()
      .from(student)
      .where(eq(student.id, session.user.id))
      .limit(1);

    if (studentRecord.length === 0) {
      return NextResponse.json(
        { error: "Only students can view homework" },
        { status: 403 }
      );
    }

    // Check if student is enrolled in this classroom
    const currentStudent = studentRecord[0];
    if (!(currentStudent.classroomIds || []).includes(classroomId)) {
      return NextResponse.json(
        { error: "You are not enrolled in this classroom" },
        { status: 403 }
      );
    }

    // Fetch homework for this classroom
    const homeworks = await db
      .select()
      .from(classroomSubject)
      .where(eq(classroomSubject.classroomId, classroomId))
      .orderBy(classroomSubject.createdAt);

    return NextResponse.json({
      success: true,
      homeworks,
    });
  } catch (error) {
    console.error("Fetch homework error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
