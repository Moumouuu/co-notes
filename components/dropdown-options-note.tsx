"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Note } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AiFillDelete } from "react-icons/ai";
import { BsBorderStyle, BsFillCloudDownloadFill } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";

export default function DropdownOptionsNote({ note }: { note: Note }) {
  const router = useRouter();

  const handleDeleteNote = async (noteId: string) => {
    const res = await axios.delete(`/api/note/${note.id}`);
    if (res.data.success) {
      router.replace("/app");
    }
  };
  const handleDownloadNote = async () => {};
  const handleCustomizeNote = async () => {};
  const handlePublishNote = async () => {
    try {
      await axios.put(`/api/note`, {
        idNote: note.id,
        published: !note.published,
      });
    } catch (e) {
      console.log(`Error when publishing note: ${e}`);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div className="cursor-pointer">
          <CgMoreO size={25} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col">
        <div
          onClick={() => handleDeleteNote(note.id)}
          className="flex items-center hover:bg-primary/10 p-3 cursor-pointer "
        >
          <AiFillDelete color={"red"} size={25} />
          <span className="ml-3 font-semibold">Supprimer la note</span>
        </div>
        <div className="flex items-center hover:bg-primary/10 p-3 cursor-pointer ">
          <BsBorderStyle size={25} />
          <span className="ml-3 font-semibold">Personnalisation</span>
        </div>
        <div className="flex items-center hover:bg-primary/10 p-3 cursor-pointer ">
          <BsFillCloudDownloadFill size={25} />
          <span className="ml-3 font-semibold">Télécharger</span>
        </div>
        <Separator />
        <div className="flex items-center hover:bg-primary/10 p-3 cursor-pointer ">
          <Switch
            defaultChecked={note.published}
            onCheckedChange={handlePublishNote}
          />
          <span className="ml-3 font-semibold">Template public</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
