"use client";
import { LogOut } from "lucide-react";
import { AiFillHome } from "react-icons/ai";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { FiMoreVertical } from "react-icons/fi";
import { HiTemplate } from "react-icons/hi";
import { IoSettings } from "react-icons/io5";

import newNote from "@/actions/new-note";
import ToggleTheme from "@/components/toggle-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AsideMenuContent({
  currentUser,
}: {
  currentUser: User;
}) {
  const workdir = "/app";
  const router = useRouter();
  const menuItems = [
    {
      title: "Accueil",
      href: `${workdir}`,
      icon: <AiFillHome size={20} />,
    },
    {
      title: "Note Rapide",
      href: "#",
      onClick: () => newNote(router),
      icon: <BsFillPlusCircleFill size={20} />,
    },
    {
      title: "Templates",
      href: `${workdir}/templates`,
      icon: <HiTemplate size={20} />,
    },
    {
      title: "Paramètres",
      href: `${workdir}/settings`,
      icon: <IoSettings size={20} />,
    },
  ];

  return (
    <>
      <div className="md:flex items-center hidden md:p-2">
        <Image
          src="/images/co-notes-logo.png"
          alt="Co-Notes"
          width={50}
          height={50}
          className="rounded-md"
        />
        <span className="ml-2 text-xl md:text-2xl">Co-Notes</span>
      </div>
      <div className="flex flex-col w-full h-[88%] justify-between mt-10 md:mt-0 md:p-2">
        <div className="flex flex-col">
          {menuItems.map((item, index) => (
            <div key={index} onClick={item?.onClick}>
              <Link
                key={index}
                href={item?.href}
                className="flex items-center w-full h-16 hover:bg-primary/10 rounded-md"
              >
                <div className="flex items-center p-2">
                  <span>{item.icon}</span>
                  <span className="ml-2 text-xl">{item.title}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center">
            <Image
              src={currentUser.image ?? "/images/default.png"}
              alt={`Profile picture of ${
                currentUser?.name ?? currentUser.email
              }`}
              width={50}
              height={50}
              className="rounded-md"
            />
            <span className="ml-2 text-xl md:text-2xl">
              {currentUser?.name ?? currentUser.email.split("@")[0]}
            </span>
            <div className="m-4">
              <DropdownMenuLogout />
            </div>
          </div>

          <ToggleTheme />
        </div>
      </div>
    </>
  );
}

export function DropdownMenuLogout() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <FiMoreVertical size={20} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
