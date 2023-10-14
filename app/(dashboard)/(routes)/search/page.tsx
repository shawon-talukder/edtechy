import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import getCourses from "@/actions/get-courses";
import { db } from "@/lib/db";

import CoursesList from "@/components/CoursesList";
import SearchInput from "@/components/SearchInput";
import Categories from "./_components/Categories";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}
const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  // get all categories
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  // get all courses
  const courses = await getCourses({ userId, ...searchParams });

  return (
    <>
      <div className="px-6 pt-6 md:mb-0 block md:hidden">
        <SearchInput />
      </div>
      <div className="p-6 space-y-6">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;
