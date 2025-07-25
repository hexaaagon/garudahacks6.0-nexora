import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/database/drizzle";
import { homework } from "@/lib/database/drizzle/schema/homework";
import { eq } from "drizzle-orm";

export async function GET(
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

    return NextResponse.json({
      success: true,
      homework: homeworkData,
    });
  } catch (error) {
    console.error("Homework fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
