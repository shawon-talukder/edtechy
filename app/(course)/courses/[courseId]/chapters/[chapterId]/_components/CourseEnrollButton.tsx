"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}

const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
  const handleClick = () => {};
  return (
    <Button onClick={handleClick} size={"sm"} className="w-full md:w-auto">
      Enroll for {formatPrice(price)}
    </Button>
  );
};

export default CourseEnrollButton;
