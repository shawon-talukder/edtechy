"use client";

import { BarChart, Compass, Layout, List } from "lucide-react";
import { usePathname } from "next/navigation";
import SidebarItem from "./SidebarItem";

const guestRoutes = [
  { icon: Layout, label: "Dashboard", href: "/" },
  { icon: Compass, label: "Browse", href: "/search" },
];

const teacherRoutes = [
  { icon: List, label: "Courses", href: "/teacher/courses" },
  { icon: BarChart, label: "Analytics", href: "/teacher/analytics" },
];

const SidebarRoutes = () => {
  const pathName = usePathname();

  // check wheather the page is teacher, means teacher logged in
  const isTeacherPage = pathName?.includes("/teacher");

  // if the user is teacher, then show routes for teacher
  const routes = isTeacherPage ? teacherRoutes : guestRoutes;
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
