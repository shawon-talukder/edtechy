import IconBadge from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";

import TitleForm from "./_components/TitleForm";

interface ICourseItemPage {
  courseId: string;
}
const CourseItemPage = async ({ params }: { params: ICourseItemPage }) => {
  const { courseId } = params;
  const { userId } = auth();

  // if there is no user
  // !userId means not logged in
  if (!userId) {
    return redirect("/");
  }

  //lookup the database for the course
  // get course details
  const courseInformation = await db.course.findUnique({
    where: { id: courseId },
  });

  // if there is no course id, consider it invalid and return to home page
  if (!courseInformation || !courseInformation.title) {
    return redirect("/");
  }

  const requiredFields = [
    courseInformation.title,
    courseInformation.description,
    courseInformation.imageUrl,
    courseInformation.price,
    courseInformation.categoryId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="font-medium text-2xl">Course Setup</h1>
          <span className="text-sm text-slate-700">
            Complete All field {completionText}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize Your Course</h2>
          </div>
          <TitleForm initialData={courseInformation} courseId={courseId} />
        </div>
      </div>
    </div>
  );
};

export default CourseItemPage;
