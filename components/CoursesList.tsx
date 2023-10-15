import CourseCard from "@/components/CourseCard";

import { CourseWithProgressAndCategory } from "@/actions/get-courses";

interface CoursesListProps {
  items: CourseWithProgressAndCategory[];
}

const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <>
      {items.length === 0 && (
        <div className="text-center text-sm mt-10 bg-pink-200/20 border border-dashed py-6 border-pink-700 text-pink-800">
          No courses found
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!}
            chaptersLength={item.chapters.length}
            price={item.price!}
            progress={item.progress}
            category={item.Category?.name!}
          />
        ))}
      </div>
    </>
  );
};

export default CoursesList;
