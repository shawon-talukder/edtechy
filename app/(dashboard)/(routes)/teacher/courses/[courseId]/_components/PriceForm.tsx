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
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface PriceFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  price: z.coerce.number(),
});

const PriceForm = ({ initialData: course, courseId }: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { price: course?.price || undefined },
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
    <p className={cn("text-sm mt-2", !course.price && "text-slate-500 italic")}>
      {course.price ? formatPrice(course.price) : "No Price Set"}
    </p>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  step={0.01}
                  disabled={isSubmitting}
                  placeholder="Set your course price"
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

export default PriceForm;
