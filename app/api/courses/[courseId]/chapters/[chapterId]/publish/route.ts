import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface IParams {
  courseId: string;
  chapterId: string;
}
export async function PATCH(req: Request, { params }: { params: IParams }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("unauthorized!", { status: 401 });
    }

    // destructuring
    const { courseId, chapterId } = params;

    if (!chapterId || !courseId) {
      return new NextResponse("invalid reuest", { status: 400 });
    }

    // lookup the database if the chapter exists on course
    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    // if not, return error response
    if (!courseOwner) {
      return new NextResponse("unauthorized!", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId },
    });

    const muxData = await db.muxData.findUnique({ where: { chapterId } });

    if (
      !chapter ||
      !chapter.title ||
      !chapter.description ||
      !chapter.videoUrl ||
      muxData
    ) {
      return new NextResponse("All fields required!", { status: 400 });
    }

    // publish the chapter
    const publish = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: { isPublished: true },
    });

    return NextResponse.json(publish);
  } catch (error) {
    console.log("CHAPTER_ID/PUBLISH", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
