"use client";

import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Chapter, MuxData } from "@prisma/client";

import { PlusCircle, Video } from "lucide-react";
import * as z from "zod";

import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // handlers
  const toggleEdit = () => setIsEditing((current) => !current);

  // handle submit function
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );

      // if successful
      // set editing mode to false
      toggleEdit();

      // send user update message and refresh ta page
      toast.success("Video Updated!");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  // inner text html for icon, 'cancel' if it is in editing mode or show icon
  const editContent = isEditing ? (
    "Cancel"
  ) : (
    <>
      <PlusCircle className="h-4 w-4 mr-2" />
    </>
  );

  // content to upload image
  const videoContent = (
    <div>
      <FileUpload
        endpoint="courseVideo"
        onChange={(url) => {
          if (url) {
            onSubmit({ videoUrl: url });
          }
        }}
      />
      <div className="text-xs text-muted-foreground mt-4">
        Upload this chapter&apos;s video
      </div>
    </div>
  );

  // show add image icon, if there is no image uploaded
  const noVideoUrlContent = (
    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
      <Video className="h-10 w-10 text-slate-500" />
    </div>
  );

  // if there is imageurl show the image
  const videoUrlContent = (
    <div className="relative aspect-video mt-2">
      <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
    </div>
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button onClick={toggleEdit} variant={"ghost"}>
          {editContent}
        </Button>
      </div>
      {!isEditing && !initialData.videoUrl && noVideoUrlContent}
      {!isEditing && initialData.videoUrl && videoUrlContent}
      {isEditing && videoContent}
    </div>
  );
};

export default ChapterVideoForm;
