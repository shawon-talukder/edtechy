"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface ChapterActionsProps {
  isPublished: boolean;
  disabled: boolean;
  courseId: string;
  chapterId: string;
}

const ChapterActions = ({
  chapterId,
  courseId,
  disabled,
  isPublished,
}: ChapterActionsProps) => {
  return (
    <div className="flex items-center gap-x-2">
      <Button
        variant={"outline"}
        onClick={() => {}}
        size={"sm"}
        disabled={disabled}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <Button size={"sm"} onClick={() => {}}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ChapterActions;
