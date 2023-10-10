import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    // not logged in user, return with error!
    if (!userId) {
      return new NextResponse("unauthorized!", { status: 401 });
    }

    const { courseId } = params;
    const { title } = await req.json();

    if (!courseId) {
      return new NextResponse("Invalid Request!", { status: 400 });
    }

    // check if there is any course on this user and courseId
    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    // not a courseowner, if there is no data
    if (!courseOwner) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    // get last chapter
    const lastChapter = await db.chapter.findFirst({
      where: { courseId },
      orderBy: { position: "desc" },
    });
    // set new position for this new chapter
    const newPosition = lastChapter ? lastChapter?.position + 1 : 1;

    //create new chapter
    const chapter = await db.chapter.create({
      data: { courseId, title, position: newPosition },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("COURSE_ID_CHAPTERS", error);
    return new NextResponse("server error!", { status: 500 });
  }
}
