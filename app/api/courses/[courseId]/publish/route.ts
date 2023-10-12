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
      include: { chapters: { include: { muxData: true } } },
    });

    // if not, return error response
    if (!courseOwner) {
      return new NextResponse("unauthorized!", { status: 401 });
    }

    // check if at least one chapter is published
    const hasPubChap = courseOwner.chapters.some((ch) => ch.isPublished);

    if (
      !courseOwner.title ||
      !courseOwner.description ||
      !courseOwner.categoryId ||
      !courseOwner.imageUrl ||
      !hasPubChap
    ) {
      return new NextResponse("All fields required!", { status: 400 });
    }

    // publish the course
    const publish = await db.course.update({
      where: { id: courseId, userId },
      data: { isPublished: true },
    });

    return NextResponse.json(publish);
  } catch (error) {
    console.log("CHAPTER_ID/PUBLISH", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
