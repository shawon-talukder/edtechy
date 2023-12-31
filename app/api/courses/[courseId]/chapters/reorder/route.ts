import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unauthorized!", { status: 401 });
    }
    const { courseId } = params;

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!courseOwner) {
      return new NextResponse("unauthorized!", { status: 401 });
    }

    const { list } = await req.json();
    // update each chapter
    for (let item of list) {
      await db.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("CHAPTERS_REORDER", error);
    return new NextResponse("Server error!", { status: 500 });
  }
}
