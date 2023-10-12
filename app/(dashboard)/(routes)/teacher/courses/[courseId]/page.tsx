import IconBadge from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";

import Banner from "@/components/Banner";
import AttachmentForm from "./_components/AttchmentForm";
import CategoryForm from "./_components/CategoryForm";
import ChaptersForm from "./_components/ChaptersForm";
import CourseActions from "./_components/CourseActions";
import DescriptionForm from "./_components/Description";
import ImageForm from "./_components/ImageForm";
import PriceForm from "./_components/PriceForm";
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
    where: { id: courseId, userId },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  // if there is no course id, consider it invalid and return to home page
  if (!courseInformation || !courseInformation.title) {
    return redirect("/");
  }

  // get all categories from database
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const requiredFields = [
    courseInformation.title,
    courseInformation.description,
    courseInformation.imageUrl,
    courseInformation.price,
    courseInformation.categoryId,
    courseInformation.chapters.some((ch) => ch.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);
  return (
    <>
      {courseInformation.isPublished && (
        <Banner label="The course is unpublished. This will not be visible" />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="font-medium text-2xl">Course Setup</h1>
            <span className="text-sm text-slate-700">
              Complete All field {completionText}
            </span>
          </div>
          <CourseActions
            disabled={!isComplete}
            courseId={courseId}
            isPublished={courseInformation.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize Your Course</h2>
            </div>
            <TitleForm initialData={courseInformation} courseId={courseId} />

            <DescriptionForm
              initialData={courseInformation}
              courseId={courseId}
            />

            <ImageForm initialData={courseInformation} courseId={courseId} />

            <CategoryForm
              initialData={courseInformation}
              courseId={courseId}
              options={categories.map((c) => ({ label: c.name, value: c.id }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Chapters</h2>
              </div>
              <ChaptersForm
                initialData={courseInformation}
                courseId={courseId}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm initialData={courseInformation} courseId={courseId} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentForm
                initialData={courseInformation}
                courseId={courseId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseItemPage;
