import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/database/drizzle";
import { homework } from "@/lib/database/drizzle/schema/homework";
import { personalityAssessment } from "@/lib/database/drizzle/schema/personality";
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
    const { homeworkId } = body;

    if (!homeworkId) {
      return NextResponse.json(
        { error: "Homework ID is required" },
        { status: 400 }
      );
    }

    // Get the homework
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

    // Get student's personality data for personalized questions
    const personalityData = await db
      .select()
      .from(personalityAssessment)
      .where(eq(personalityAssessment.studentId, session.user.id))
      .limit(1);

    // Generate questions using Puter AI
    const questions = await puterAI.generateQuestionsWithAI(
      homeworkData.description || homeworkData.title,
      personalityData.length > 0 ? personalityData[0] : undefined
    );

    // Update the subject matter with generated questions
    const questionData = questions.map((q) => {
      if (q.type === "multiple_choices") {
        return {
          id: q.id,
          type: "multiple_choices" as const,
          questionText: q.questionText,
          choices: q.choices || [],
          answer: q.answer || 0,
        };
      } else {
        return {
          id: q.id,
          type: "essay" as const,
          questionText: q.questionText,
          promptAnswer: q.promptAnswer || "",
        };
      }
    });

    await db
      .update(homework)
      .set({
        questions: questionData,
        updatedAt: new Date(),
      })
      .where(eq(homework.id, homeworkId));

    return NextResponse.json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error("Question generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
