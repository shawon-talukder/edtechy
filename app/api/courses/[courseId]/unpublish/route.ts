import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface IParams {
  courseId: string;
}

export async function PATCH(req: Request, { params }: { params: IParams }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("unauthorized!", { status: 401 });
    }

    // destructuring
    const { courseId } = params;

    if (!courseId) {
      return new NextResponse("invalid request", { status: 400 });
    }

    // lookup the database if the chapter exists on course
    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    // if not, return error response
    if (!courseOwner) {
      return new NextResponse("unauthorized!", { status: 401 });
    }

    // publish the course
    const unpublish = await db.course.update({
      where: { id: courseId, userId },
      data: { isPublished: false },
    });

    return NextResponse.json(unpublish);
  } catch (error) {
    console.log("CHAPTER_ID/UNPUBLISH", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
