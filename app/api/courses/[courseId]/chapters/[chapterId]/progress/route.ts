import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("unauthenticated!", { status: 401 });
    }

    const { courseId, chapterId } = params;

    const { isCompleted } = await req.json();

    const userProgress = await db.userProgress.upsert({
      where: { chapterId_userId: { chapterId, userId } },
      update: { isCompleted },
      create: { userId, chapterId, isCompleted },
    });

    return NextResponse.json (userProgress);
  } catch (error) {
    console.log("CHAPTER/PROGRESS");
    return new NextResponse("Server error!", { status: 500 });
  }
}
