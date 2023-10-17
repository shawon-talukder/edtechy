import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";

import getProgress from "@/actions/get-progress";

type CourseWithProgressAndCategory = Course & {
  Category: Category;
  chapters: Chapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressAndCategory[];
  coursesInProgress: CourseWithProgressAndCategory[];
};

export async function getDashboardCourses(
  userId: string
): Promise<DashboardCourses> {
  try {
    // get purchased courses against user
    const purchasedCourses = await db.purchase.findMany({
      where: { userId },
      select: {
        course: {
          include: {
            Category: true,
            chapters: {
              where: { isPublished: true },
            },
          },
        },
      },
    });

    // take only course details
    const courses = purchasedCourses.map(
      (purchase) => purchase.course
    ) as CourseWithProgressAndCategory[];

    // set progress for each course
    for (let course of courses) {
      const progress = await getProgress(userId, course?.id);
      course["progress"] = progress;
    }

    // completed if progress is 100%
    const courseCompleted = courses.filter((course) => course.progress === 100);

    const coursesInProgress = courses.filter(
      (course) => (course.progress ?? 0) < 100
    );

    return {
      completedCourses: courseCompleted,
      coursesInProgress,
    };
  } catch (error) {
    console.log("ACTION/DASHBOARD_COURSES", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
}
