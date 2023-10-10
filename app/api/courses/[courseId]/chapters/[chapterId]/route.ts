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
    const hasChapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId },
    });

    // if not, return error response
    if (!hasChapter) {
      return new NextResponse("unauthorized!", { status: 401 });
    }

    // get values
    const { isPublished, ...values } = await req.json();

    // update chapter with values
    const updateData = await db.chapter.update({
      where: { courseId, id: chapterId },
      data: { ...values },
    });

    return NextResponse.json(updateData);
  } catch (error) {
    console.log("COURSE/COURSE_ID/CHAPTERS/CHAPTER_ID", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
