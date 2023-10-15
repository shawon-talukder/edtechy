import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import getChapter from "@/actions/get-chapter";

import Banner from "@/components/Banner";
import CourseEnrollButton from "./_components/CourseEnrollButton";
import VideoPlayer from "./_components/VideoPlayer";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const {
    attachments,
    chapter,
    course,
    muxData,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    courseId: params.courseId,
    chapterId: params.chapterId,
  });

  if (!course || !chapter) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !userProgress?.isCompleted && !!purchase;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant={"success"}
          label="You have alredy completed this chapter"
        />
      )}
      {isLocked && (
        <Banner
          variant={"warning"}
          label="You need to purchase to watch this chapter"
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            courseId={params.courseId}
            title={chapter.title}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd!}
          />
        </div>
        <div>
          <div className="p-4 flex flex-colmd:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              "Purchase button"
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
