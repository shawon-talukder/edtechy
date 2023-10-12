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

    // publish the chapter
    const unpublish = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: { isPublished: false },
    });

    // if any chapter has published, make the full course unpublished
    const hasPublishedCourse = await db.chapter.findMany({
      where: { courseId, isPublished: true },
    });

    if (!hasPublishedCourse.length) {
      await db.course.update({
        where: { id: courseId },
        data: { isPublished: false },
      });
    }

    return NextResponse.json(unpublish);
  } catch (error) {
    console.log("CHAPTER_ID/PUBLISH", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
