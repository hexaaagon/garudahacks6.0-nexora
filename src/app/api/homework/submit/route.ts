import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/database/drizzle";
import { classroomSubject } from "@/lib/database/drizzle/schema/classroom";
import { personalityAssessment } from "@/lib/database/drizzle/schema/personality";
import { student } from "@/lib/database/drizzle/schema/student";
import { eq } from "drizzle-orm";
import { puterAI } from "@/lib/ai/puter-service";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { homeworkId, answers } = body;

    if (!homeworkId || !answers) {
      return NextResponse.json(
        { error: "Homework ID and answers are required" },
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
        { error: "Only students can submit homework" },
        { status: 403 }
      );
    }

    // Get the homework
    const homework = await db
      .select()
      .from(classroomSubject)
      .where(eq(classroomSubject.id, homeworkId))
      .limit(1);

    if (homework.length === 0) {
      return NextResponse.json(
        { error: "Homework not found" },
        { status: 404 }
      );
    }

    const homeworkData = homework[0];
    const questions = homeworkData.question;

    // Generate personality assessment using Puter AI
    const personalityData = await puterAI.generatePersonalityAssessment(
      answers,
      questions
    );

    // Check if student already has a personality assessment
    const existingAssessment = await db
      .select()
      .from(personalityAssessment)
      .where(eq(personalityAssessment.studentId, session.user.id))
      .limit(1);

    if (existingAssessment.length > 0) {
      // Update existing assessment
      await db
        .update(personalityAssessment)
        .set({
          personalityType: personalityData.personalityType,
          strengthDescription: personalityData.strengthDescription,
          learningStyle: personalityData.learningStyle,
          mathScore: personalityData.mathScore,
          logicalScore: personalityData.logicalScore,
          creativityScore: personalityData.creativityScore,
          comprehensionScore: personalityData.comprehensionScore,
          updatedAt: new Date(),
        })
        .where(eq(personalityAssessment.studentId, session.user.id));
    } else {
      // Create new assessment
      await db.insert(personalityAssessment).values({
        studentId: session.user.id,
        personalityType: personalityData.personalityType,
        strengthDescription: personalityData.strengthDescription,
        learningStyle: personalityData.learningStyle,
        mathScore: personalityData.mathScore,
        logicalScore: personalityData.logicalScore,
        creativityScore: personalityData.creativityScore,
        comprehensionScore: personalityData.comprehensionScore,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Homework submitted successfully!",
      personalityAssessment: personalityData,
    });
  } catch (error) {
    console.error("Homework submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
