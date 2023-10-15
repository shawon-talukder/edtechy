"use client";

import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import SearchInput from "./SearchInput";
import { Button } from "./ui/button";

const NavbarRoutes = () => {
  const pathName = usePathname();

  // check if the page/route is for teacher
  const isTeacherPage = pathName?.startsWith("/teacher");

  // check for video player page/routing
  const isPlayerPage = pathName?.includes("/course");

  const isSearchPage = pathName.startsWith("/search");

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isPlayerPage ? (
          <Link href={"/"}>
            <Button variant={"ghost"} size={"sm"}>
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href="/teacher/courses">
            <Button variant={"ghost"} size={"sm"}>
              Teacher Mode
            </Button>
          </Link>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};

export default NavbarRoutes;
