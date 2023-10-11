import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";
interface IParams {
  courseId: string;
  chapterId: string;
}

const { Video } = new Mux(
  process.env.MUX_CLIENT_ID!,
  process.env.MUX_CLIENT_SECRET!
);

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

    // update video upload
    if (values?.videoUrl) {
      // check if there is already a video exists on this chapter
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId },
      });

      // if exists, delete the previous one from both mux assets and our database
      if (existingMuxData) {
        await db.muxData.delete({ where: { id: existingMuxData?.id } });
        await Video.Assets.del(existingMuxData?.assetId);
      }

      // add new video to mux asset
      const asset = await Video.Assets.create({
        input: values.videoUrl,
        playback_policy: "public",
        test: false,
      });

      // push to the database
      await db.muxData.create({
        data: {
          chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0].id!,
        },
      });
    }

    return NextResponse.json(updateData);
  } catch (error) {
    console.log("COURSE/COURSE_ID/CHAPTERS/CHAPTER_ID", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
