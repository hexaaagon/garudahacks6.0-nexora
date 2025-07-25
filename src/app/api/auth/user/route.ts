import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/database/drizzle";
import { user } from "@/lib/database/drizzle/schema/auth";
import { student } from "@/lib/database/drizzle/schema/student";
import { teacher } from "@/lib/database/drizzle/schema/teacher";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    // Get the session from Better Auth
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user from database with role information
    const [userRecord] = await db
      .select({
        id: user.id,
        email: user.email,
        name: user.name,
      })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is a student or teacher
    const [studentRecord] = await db
      .select({ id: student.id })
      .from(student)
      .where(eq(student.id, userRecord.id))
      .limit(1);

    const [teacherRecord] = await db
      .select({ id: teacher.id })
      .from(teacher)
      .where(eq(teacher.id, userRecord.id))
      .limit(1);

    let role: "student" | "teacher" | null = null;
    if (studentRecord) {
      role = "student";
    } else if (teacherRecord) {
      role = "teacher";
    }

    return NextResponse.json({
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      role,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
