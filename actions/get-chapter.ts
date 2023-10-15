import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

const getChapter = async ({ userId, courseId, chapterId }: GetChapterProps) => {
  try {
    // get user purchase information
    const purchase = await db.purchase.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    // get course information check if published
    const course = await db.course.findUnique({
      where: { id: courseId, isPublished: true },
      select: { price: true },
    });

    // get chapter information
    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, isPublished: true },
    });

    if (!course || !chapter) {
      throw new Error("Chapter or course not found!");
    }

    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    // get attachments of this course only if user purchased it
    if (purchase) {
      attachments = await db.attachment.findMany({ where: { courseId } });
    }

    // if chapter is public or purchased, load the video data
    if (chapter.isFree || purchase) {
      muxData = await db.muxData.findUnique({ where: { chapterId } });

      nextChapter = await db.chapter.findFirst({
        where: {
          courseId,
          isPublished: true,
          position: { gt: chapter.position },
        },
        orderBy: { position: "asc" },
      });
    }

    // get user progress details
    const userProgress = await db.userProgress.findUnique({
      where: { chapterId_userId: { chapterId, userId } },
    });

    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
    };
  } catch (error) {
    console.log("ACTION/CHAPTER", error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};

export default getChapter;
