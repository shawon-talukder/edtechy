"use client";

import axios from "axios";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface ChapterAccessFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

const ChapterAccessForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterAccessFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { isFree: !!initialData.isFree },
  });

  const { isSubmitting, isValid } = form.formState;

  // handlers
  const toggleEdit = () => setIsEditing((current) => !current);

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
      toast.success("Updated successfully!");
      router.refresh();
    } catch (error) {
      console.log("[COURSE_ID]", error);
      toast.error("Something went wrong!");
    }
  };

  const editContent = isEditing ? (
    "Cancel"
  ) : (
    <>
      <Pencil className="h-4 w-4 mr-2" />
    </>
  );

  const editingContent = !isEditing ? (
    <p
      className={cn(
        "text-sm mt-2",
        !initialData.description && "text-slate-500 italic"
      )}
    >
      {initialData?.isFree
        ? "This chapter is Free"
        : "This chapter is not for free preview"}
    </p>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="isFree"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormDescription>
                  Check this box if you want to make this chapter free for
                  preview
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <div className="flex items-center gap-x-2">
          <Button disabled={!isValid || isSubmitting} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Access
        <Button onClick={toggleEdit} variant={"ghost"}>
          {editContent}
        </Button>
      </div>
      {editingContent}
    </div>
  );
};

export default ChapterAccessForm;
