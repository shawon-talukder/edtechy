import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client";
import getProgress from "./get-progress";

type CourseWithProgressAndCategory = Course & {
  Category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

const getCourses = async ({
  userId,
  categoryId,
  title,
}: GetCourses): Promise<CourseWithProgressAndCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        categoryId,
        title: { contains: title },
      },
      include: {
        Category: true,
        chapters: {
          where: { isPublished: true },
          select: { id: true },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress: CourseWithProgressAndCategory[] =
      await Promise.all(
        courses.map(async (course) => {
          if (course.purchases.length === 0) {
            return {
              ...course,
              progress: null,
            };
          }

          const progressPercentage = await getProgress(userId, course.id);

          return {
            ...course,
            progress: progressPercentage,
          };
        })
      );

    return coursesWithProgress;
  } catch (error) {
    console.log("ACTION/COURSES", error);
    return [];
  }
};

export default getCourses;
