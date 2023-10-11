import IconBadge from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ChapterDescriptionForm from "./_components/ChapterDescriptionForm";
import ChapterTitleForm from "./_components/ChapterTitleForm";

interface IParams {
  courseId: string;
  chapterId: string;
}

const ChapterIdPage = async ({ params }: { params: IParams }) => {
  const { courseId, chapterId } = params;

  const { userId } = auth();

  // no userid, not logged in user is trying ro access
  if (!userId) {
    return redirect("/");
  }

  // get the chapter with the id from db
  const chapter = await db.chapter.findUnique({
    where: { courseId, id: chapterId },
    include: { muxData: true },
  });

  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [chapter.description, chapter.title, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completedText = `(${completedFields}/${totalFields})`;
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${courseId}`}
            className="flex items-center text-sm hover:opacity-75"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course Setup
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter creation</h1>
              <span className="text-sm text-slate-700">
                Complete all fields {completedText}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="tex-xl">Customize your chapter</h2>
            </div>
            <ChapterTitleForm
              courseId={courseId}
              initialData={chapter}
              chapterId={chapterId}
            />

            <ChapterDescriptionForm
              courseId={courseId}
              initialData={chapter}
              chapterId={chapterId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
