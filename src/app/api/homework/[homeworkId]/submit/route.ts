import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/database/drizzle";
import {
  homework,
  homeworkSubmission,
} from "@/lib/database/drizzle/schema/homework";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: { homeworkId: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { homeworkId } = params;
    const body = await request.json();
    const { answers } = body;

    if (!answers) {
      return NextResponse.json(
        { error: "Answers are required" },
        { status: 400 }
      );
    }

    // Get the homework to validate it exists
    const homeworkRecord = await db
      .select()
      .from(homework)
      .where(eq(homework.id, homeworkId))
      .limit(1);

    if (homeworkRecord.length === 0) {
      return NextResponse.json(
        { error: "Homework not found" },
        { status: 404 }
      );
    }

    const homeworkData = homeworkRecord[0];

    // Calculate basic score (for demonstration)
    let totalScore = 0;
    let maxScore = 0;

    if (homeworkData.questions && Array.isArray(homeworkData.questions)) {
      for (const question of homeworkData.questions as Array<{
        id: string;
        type: string;
        answer?: number;
        questionText: string;
      }>) {
        maxScore += 10; // Each question worth 10 points

        const userAnswer = answers[question.id];
        if (
          question.type === "multiple_choices" &&
          userAnswer === question.answer
        ) {
          totalScore += 10;
        } else if (
          question.type === "essay" &&
          userAnswer &&
          String(userAnswer).trim().length > 0
        ) {
          // Basic scoring for essays - give partial credit
          totalScore += Math.min(
            10,
            Math.max(5, String(userAnswer).length / 20)
          );
        }
      }
    }

    // Check if submission already exists
    const existingSubmission = await db
      .select()
      .from(homeworkSubmission)
      .where(eq(homeworkSubmission.homeworkId, homeworkId))
      .limit(1);

    const totalQuestions = Array.isArray(homeworkData.questions)
      ? homeworkData.questions.length
      : 0;

    if (existingSubmission.length > 0) {
      // Update existing submission
      await db
        .update(homeworkSubmission)
        .set({
          answers: answers,
          score: Math.round(totalScore),
          submittedAt: new Date(),
        })
        .where(eq(homeworkSubmission.id, existingSubmission[0].id));
    } else {
      // Create new submission
      await db.insert(homeworkSubmission).values({
        homeworkId,
        studentId: session.user.id,
        answers: answers,
        score: Math.round(totalScore),
        totalQuestions,
        submittedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      score: Math.round(totalScore),
      maxScore: maxScore,
      percentage: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0,
    });
  } catch (error) {
    console.error("Homework submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
