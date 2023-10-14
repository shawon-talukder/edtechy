import { db } from "@/lib/db";

const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    // get chapters that has published true
    const publishedChapters = await db.chapter.findMany({
      where: { courseId, isPublished: true },
      select: { id: true },
    });

    // get all ids in an array that are published
    const publishedChaptersIds = publishedChapters.map((ch) => ch.id);

    // count completed chapters by the user
    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId,
        chapterId: { in: publishedChaptersIds },
        isCompleted: true,
      },
    });

    // calculation
    const progressPercentage =
      (validCompletedChapters / publishedChaptersIds.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log("GET_PROGRESS", error);
    return 0;
  }
};

export default getProgress;
