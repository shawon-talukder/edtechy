import { auth } from "@clerk/nextjs";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";

import CoursesList from "@/components/CoursesList";
import InfoCard from "./_components/InfoCard";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";

const Dashboard = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  );

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label={"In Progress"}
          numberOfItems={coursesInProgress.length}
        />

        <InfoCard
          icon={CheckCircle}
          variant="success"
          label="Completed"
          numberOfItems={completedCourses.length}
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
};

export default Dashboard;
