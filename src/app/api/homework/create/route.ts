import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/database/drizzle";
import { homework } from "@/lib/database/drizzle/schema/homework";
import { classroom } from "@/lib/database/drizzle/schema/classroom";
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
    const {
      classroomId,
      subjectMatter,
      deadlineAt,
      subject = "General",
      difficulty = "medium",
    } = body;

    // Validate input
    if (!classroomId || !subjectMatter) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate subject matter length (minimum 2 paragraphs)
    const paragraphs = subjectMatter
      .trim()
      .split("\n\n")
      .filter((p: string) => p.trim().length > 0);
    if (paragraphs.length < 2) {
      return NextResponse.json(
        { error: "Subject matter must contain at least 2 paragraphs" },
        { status: 400 }
      );
    }

    // Check if user has permission to create homework in this classroom
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
          error:
            "You don't have permission to create homework in this classroom",
        },
        { status: 403 }
      );
    }

    // Create homework
    const newHomework = await db
      .insert(homework)
      .values({
        classroomId,
        teacherId: session.user.id,
        title: `Homework - ${new Date().toLocaleDateString()}`,
        description: subjectMatter.trim(),
        subject,
        difficulty,
        questions: [], // Questions will be generated when students access the homework
        dueDate: deadlineAt ? new Date(deadlineAt) : null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      homework: newHomework[0],
    });
  } catch (error) {
    console.error("Homework creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
