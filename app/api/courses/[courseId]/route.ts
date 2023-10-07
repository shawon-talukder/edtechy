import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    // return error if user is not logged in
    if (!userId) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    const { courseId } = params;

    // if there is no course id, return error
    // course id length === 36, since it is uuid
    if (!courseId || courseId.length !== 36) {
      return new NextResponse("Invalid Request!", { status: 400 });
    }

    // lookup for the database for the course against user id and course id
    const courseExists = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    // if there is no course return error
    if (!courseExists) {
      return new NextResponse("Invalid Request!", { status: 400 });
    }

    // get values from body
    const values = await req.json();

    // update the course
    const course = await db.course.update({
      where: { id: courseId, userId },
      data: { ...values },
    });

    // return updated data
    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
