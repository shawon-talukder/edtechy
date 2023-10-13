"use client";

import { Button } from "@/components/ui/button";
import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";

const getIcon = (direction: boolean) => {
  if (direction) {
    return <ArrowUp className="w-4 h-4 ml-2" />;
  }
  return <ArrowDown className="w-4 h-4 ml-2" />;
};

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          {getIcon(column.getIsSorted() === "asc")}
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          {getIcon(column.getIsSorted() === "asc")}
        </Button>
      );
    },
  },
  {
    accessorKey: "isPublished",
    header: "Status",
  },
];
