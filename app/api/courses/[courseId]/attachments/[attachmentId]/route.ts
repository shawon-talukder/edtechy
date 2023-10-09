import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

type IParams = { courseId: string; attachmentId: string };

export async function DELETE(req: Request, { params }: { params: IParams }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("unauthorized!", { status: 401 });
    }

    const { courseId, attachmentId } = params;

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!courseOwner) {
      return new NextResponse("unauthorized!", { status: 401 });
    }
    const attachment = await db.attachment.delete({
      where: { courseId, id: attachmentId },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("COUSEID_ATTACHMENT_A-ID");
    return new NextResponse("server error!", { status: 500 });
  }
}
