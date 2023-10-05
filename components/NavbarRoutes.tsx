"use client";

import { UserButton } from "@clerk/nextjs";
import { Link, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

const NavbarRoutes = () => {
  const pathName = usePathname();
  const router = useRouter();

  // check if the page/route is for teacher
  const isTeacherPage = pathName?.startsWith("/teacher");

  // check for video player page/routing
  const isPlayerPage = pathName?.includes("/chapter");

  return (
    <div className="flex gap-x-2 ml-auto">
      {isTeacherPage || isPlayerPage ? (
        <Button variant={"ghost"} size={"sm"}>
          <LogOut className="h-4 w-4 mr-2" />
          Exit
        </Button>
      ) : (
        <Link href="/teacher/courses">
          <Button variant={"ghost"} size={"sm"}>
            Teacher Mode
          </Button>
        </Link>
      )}
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default NavbarRoutes;
