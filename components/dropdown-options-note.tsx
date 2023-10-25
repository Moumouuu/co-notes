"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Note } from "@prisma/client";
import { AiFillDelete } from "react-icons/ai";
import { BsBorderStyle, BsFillCloudDownloadFill } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";

export default function DropdownOptionsNote({ note }: { note: Note }) {
  // todo : create body method
  const handleDeleteNote = async () => {};
  const handleDownloadNote = async () => {};
  const handleCustomizeNote = async () => {};
  const handlePublishNote = async () => {};

  return (
    <Popover>
      <PopoverTrigger>
        <div className="cursor-pointer">
          <CgMoreO size={25} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col">
        <div className="flex items-center hover:bg-primary/10 p-3 cursor-pointer ">
          <AiFillDelete color={"red"} size={20} />
          <span className="ml-2">Supprimer la note</span>
        </div>
        <div className="flex items-center hover:bg-primary/10 p-3 cursor-pointer ">
          <BsBorderStyle size={20} />
          <span className="ml-2">Personnalisation</span>
        </div>
        <div className="flex items-center hover:bg-primary/10 p-3 cursor-pointer ">
          <BsFillCloudDownloadFill size={20} />
          <span className="ml-2">Télécharger</span>
        </div>
        <Separator />
        <div className="flex items-center hover:bg-primary/10 p-3 cursor-pointer ">
          <Switch defaultChecked={note.published} />
          <span className="ml-2">Template public</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
