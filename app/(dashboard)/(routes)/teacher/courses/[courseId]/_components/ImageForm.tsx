"use client";

import { Course } from "@prisma/client";
import axios from "axios";
import { ImageIcon, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import * as z from "zod";

import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required!",
  }),
});

const ImageForm = ({ initialData: course, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // handlers
  const toggleEdit = () => setIsEditing((current) => !current);

  // handle submit function
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);

      // if successful
      // set editing mode to false
      toggleEdit();

      // send user update message and refresh ta page
      toast.success("Image Updated successfully!");
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
  const imageContent = (
    <div>
      <FileUpload
        endpoint="courseImage"
        onChange={(url) => {
          if (url) {
            onSubmit({ imageUrl: url });
          }
        }}
      />
      <div className="text-xs text-muted-foreground mt-4">
        16:9 aspect ratio recommended
      </div>
    </div>
  );

  // show add image icon, if there is no image uploaded
  const noImageUrlContent = (
    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
      <ImageIcon />
    </div>
  );

  // if there is imageurl show the image
  const imageUrlContent = (
    <div className="relative aspect-video mt-2">
      <Image
        className="object-cover rounded-md"
        fill
        src={course?.imageUrl as string}
        alt={course?.title}
      />
    </div>
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Image
        <Button onClick={toggleEdit} variant={"ghost"}>
          {editContent}
        </Button>
      </div>
      {!isEditing && !course.imageUrl && noImageUrlContent}
      {!isEditing && course.imageUrl && imageUrlContent}
      {isEditing && imageContent}
    </div>
  );
};

export default ImageForm;
