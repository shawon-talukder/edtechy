"use client";

import axios from "axios";
import { Pencil } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface DescriptionFormProps {
  initialData: {
    description?: string;
  };
  courseId: string;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required!",
  }),
});

const DescriptionForm = ({
  initialData: course,
  courseId,
}: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: course,
  });

  const { isSubmitting, isValid } = form.formState;

  // handlers
  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);

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
        !course.description && "text-slate-500 italic"
      )}
    >
      {course.description || "No Description"}
    </p>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  disabled={isSubmitting}
                  placeholder="e.g. 'This course is about...'"
                  {...field}
                />
              </FormControl>
              <FormMessage />
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
        Course Description
        <Button onClick={toggleEdit} variant={"ghost"}>
          {editContent}
        </Button>
      </div>
      {editingContent}
    </div>
  );
};

export default DescriptionForm;
