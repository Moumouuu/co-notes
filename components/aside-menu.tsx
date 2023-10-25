import AsideMenuContent from "@/components/aside-menu-content";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AiOutlineMenu } from "react-icons/ai";

import type { User } from "@prisma/client";
import Image from "next/image";

export default function AsideMenu({ currentUser }: { currentUser: User }) {
  return (
    <>
      <div className="block md:hidden absolute top-2 left-2 z-50">
        <Sheet>
          <SheetTrigger asChild className="m-3 cursor-pointer">
            <AiOutlineMenu size={30} />
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle className="flex items-center">
                <Image
                  src="/images/co-notes-logo.png"
                  alt="Co-Notes"
                  width={50}
                  height={50}
                  className="rounded-md"
                />
                <span className="ml-2 text-xl md:text-2xl">Co-Notes</span>
              </SheetTitle>
            </SheetHeader>
            <AsideMenuContent currentUser={currentUser} />
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:block h-screen  w-1/4 border-r">
        <AsideMenuContent currentUser={currentUser} />
      </div>
    </>
  );
}
