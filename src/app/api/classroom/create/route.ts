import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/database/drizzle";
import { classroom } from "@/lib/database/drizzle/schema/classroom";
import { teacher } from "@/lib/database/drizzle/schema/teacher";
import { nanoid } from "@/lib/utils";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, grade, subjects, adminEmails, description } = body;

    // Validate input
    if (!name || !grade || !subjects || !Array.isArray(subjects)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (subjects.length === 0 || subjects.length > 5) {
      return NextResponse.json(
        { error: "Must select 1-5 subjects" },
        { status: 400 }
      );
    }

    // Check if user is a teacher
    const teacherRecord = await db
      .select()
      .from(teacher)
      .where(eq(teacher.id, session.user.id))
      .limit(1);

    if (teacherRecord.length === 0) {
      return NextResponse.json(
        { error: "Only teachers can create classrooms" },
        { status: 403 }
      );
    }

    // Generate unique share code
    const shareCode = nanoid(10).toUpperCase();

    // Create classroom
    const newClassroom = await db
      .insert(classroom)
      .values({
        name: name.trim(),
        description,
        grade,
        subjects,
        shareCode,
        adminIds:
          adminEmails?.filter((email: string) => email.trim() !== "") || [],
        teacherId: session.user.id,
      })
      .returning();

    // Update teacher's classroom list
    const currentTeacher = teacherRecord[0];
    const updatedClassroomIds = [
      ...(currentTeacher.classroomIds || []),
      newClassroom[0].id,
    ];

    await db
      .update(teacher)
      .set({
        classroomIds: updatedClassroomIds,
        updatedAt: new Date(),
      })
      .where(eq(teacher.id, session.user.id));

    return NextResponse.json({
      success: true,
      classroom: newClassroom[0],
      shareCode: newClassroom[0].shareCode,
    });
  } catch (error) {
    console.error("Classroom creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
