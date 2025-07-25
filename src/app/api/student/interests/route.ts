import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/database/drizzle";
import {
  interest,
  studentInterest,
} from "@/lib/database/drizzle/schema/interests";
import { student } from "@/lib/database/drizzle/schema/student";
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
    const { interests } = body;

    // Validate input
    if (!interests || !Array.isArray(interests)) {
      return NextResponse.json(
        { error: "Interests array is required" },
        { status: 400 }
      );
    }

    if (interests.length < 3 || interests.length > 5) {
      return NextResponse.json(
        { error: "Must select 3-5 interests" },
        { status: 400 }
      );
    }

    // Check if user is a student
    const studentRecord = await db
      .select()
      .from(student)
      .where(eq(student.id, session.user.id))
      .limit(1);

    if (studentRecord.length === 0) {
      return NextResponse.json(
        { error: "Only students can set interests" },
        { status: 403 }
      );
    }

    // Get or create interest records
    const interestRecords = [];
    for (const interestName of interests) {
      // Check if interest exists
      const existingInterest = await db
        .select()
        .from(interest)
        .where(eq(interest.name, interestName))
        .limit(1);

      if (existingInterest.length === 0) {
        // Create new custom interest
        const newInterest = await db
          .insert(interest)
          .values({
            name: interestName,
            isDefault: false,
          })
          .returning();
        interestRecords.push(newInterest[0]);
      } else {
        interestRecords.push(existingInterest[0]);
      }
    }

    // Remove existing student interests
    await db
      .delete(studentInterest)
      .where(eq(studentInterest.studentId, session.user.id));

    // Add new student interests
    const studentInterestData = interestRecords.map((interestRecord) => ({
      studentId: session.user.id,
      interestId: interestRecord.id,
    }));

    await db.insert(studentInterest).values(studentInterestData);

    return NextResponse.json({
      success: true,
      interests: interestRecords,
    });
  } catch (error) {
    console.error("Student interests error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
