import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/database/drizzle";
import { student } from "@/lib/database/drizzle/schema/student";
import { classroom } from "@/lib/database/drizzle/schema/classroom";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
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

    const { shareCode } = await request.json();

    if (!shareCode) {
      return NextResponse.json(
        { success: false, error: "Share code is required" },
        { status: 400 }
      );
    }

    // Find classroom by share code
    const classroomRecord = await db
      .select()
      .from(classroom)
      .where(eq(classroom.shareCode, shareCode))
      .limit(1);

    if (classroomRecord.length === 0) {
      return NextResponse.json(
        { success: false, error: "Classroom not found" },
        { status: 404 }
      );
    }

    const classroomData = classroomRecord[0];

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
    const currentClassroomIds = studentData.classroomIds || [];

    // Check if already joined
    if (currentClassroomIds.includes(classroomData.id)) {
      return NextResponse.json(
        { success: false, error: "Already joined this classroom" },
        { status: 400 }
      );
    }

    // Add classroom to student's list
    const updatedClassroomIds = [...currentClassroomIds, classroomData.id];

    await db
      .update(student)
      .set({
        classroomIds: updatedClassroomIds,
        updatedAt: new Date(),
      })
      .where(eq(student.id, session.user.id));

    return NextResponse.json({
      success: true,
      message: "Successfully joined classroom",
      classroom: {
        id: classroomData.id,
        name: classroomData.name,
        subjects: classroomData.subjects,
      },
    });
  } catch (error) {
    console.error("Error joining classroom:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
