import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    // not logged in
    if (!userId) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    const { courseId } = params;
    const { url } = await req.json();

    // check if the courseid's owner is logged in user
    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    // if there is no file againt the owner, send error
    if (!courseOwner) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    // create an attachment
    const attachment = await db.attachment.create({
      data: { url, name: url.split("/").pop(), courseId },
    });

    // return success message
    return NextResponse.json(attachment);
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENT", error);
    return new NextResponse("server error!", { status: 500 });
  }
}
