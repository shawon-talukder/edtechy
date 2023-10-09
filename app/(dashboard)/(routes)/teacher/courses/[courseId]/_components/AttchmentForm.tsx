"use client";

import { Attachment, Course } from "@prisma/client";
import axios from "axios";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import * as z from "zod";

import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

const AttachmentForm = ({
  initialData: course,
  courseId,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();

  // handlers
  const toggleEdit = () => setIsEditing((current) => !current);

  // handle submit function
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments/`, values);

      // if successful
      // set editing mode to false
      toggleEdit();

      // send user update message and refresh ta page
      toast.success("File uploaded successfully!");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  // deleting an attachment
  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);

      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);

      // if successful
      // set editing mode to false
      toggleEdit();

      // send user update message and refresh ta page
      toast.success("File deleted!");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setDeletingId(null);
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

  // content to upload files
  const addAttachmentContent = (
    <div>
      <FileUpload
        endpoint="courseAttachment"
        onChange={(url) => {
          if (url) {
            onSubmit({ url: url });
          }
        }}
      />
      <div className="text-xs text-muted-foreground mt-4">
        Add anything your student might need to complete the course
      </div>
    </div>
  );

  // show text if no attachment uploaded
  const noAttachmentContent = (
    <p className="text-sm mt-2 text-slate-500 italic">No Attachment Yet!</p>
  );

  const attachmentContent = (
    <div className="space-y-2">
      {course.attachments.map((atch) => (
        <div
          key={atch.id}
          className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
        >
          <File className="h-4 w-4 mr-2 flex-shrink-0" />
          <p className="text-xs line-clamp-1">{atch.name}</p>
          {deletingId === atch.id ? (
            <div className="ml-auto">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <button
              onClick={() => onDelete(atch.id)}
              className="ml-auto hover:opacity-75 transition"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Attachments
        <Button onClick={toggleEdit} variant={"ghost"}>
          {editContent}
        </Button>
      </div>
      {!isEditing && course.attachments.length === 0 && noAttachmentContent}
      {!isEditing && course.attachments.length > 0 && attachmentContent}
      {isEditing && addAttachmentContent}
    </div>
  );
};

export default AttachmentForm;
