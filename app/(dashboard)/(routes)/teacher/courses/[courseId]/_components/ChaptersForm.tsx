"use client";

import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import ChaptersList from "./ChaptersList";

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}
export type updateDataType = { id: string; position: number };

const formSchema = z.object({
  title: z.string().min(1),
});

const ChaptersForm = ({ initialData: course, courseId }: ChaptersFormProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  const { isSubmitting, isValid } = form.formState;

  // handlers
  const toggleCreate = () => setIsCreating((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);

      // if successful
      // set creating mode to false
      toggleCreate();

      // send user update message and refresh ta page
      toast.success("Chapter created!");
      router.refresh();
    } catch (error) {
      console.log("[COURSE_ID_CHAPTERS]", error);
      toast.error("Something went wrong!");
    }
  };

  const handleReorder = async (updateData: updateDataType[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData,
      });

      toast.success("Reordered!");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsUpdating(false);
    }
  };
  const editContent = isCreating ? (
    "Cancel"
  ) : (
    <>
      <PlusCircle className="h-4 w-4 mr-2" />
    </>
  );

  const contentForm = isCreating && (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="e.g. 'introduction to course'"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={!isValid || isSubmitting} type="submit">
          Create
        </Button>
      </form>
    </Form>
  );

  const editingContent = !isCreating && (
    <p
      className={cn(
        "text-sm mt-2",
        course.chapters.length === 0 && "text-slate-500 italic"
      )}
    >
      {course.chapters.length === 0 && "No Chapters"}
      <ChaptersList
        onEdit={() => {}}
        onReOrder={handleReorder}
        items={course.chapters || []}
      />
    </p>
  );

  const courseDesc = !isCreating && (
    <p className="text-xs text-muted-foreground mt-4">
      Drag & Drop chapters to order them
    </p>
  );
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Chapters
        <Button onClick={toggleCreate} variant={"ghost"}>
          {editContent}
        </Button>
      </div>
      {contentForm}
      {editingContent}
      {courseDesc}
    </div>
  );
};

export default ChaptersForm;
