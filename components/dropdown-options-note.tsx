"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Note, Preference, User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AiFillDelete } from "react-icons/ai";
import { BsFillCloudDownloadFill } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import PersonalizationDialog from "./dialog/personalization-dialog";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";

interface NoteWithUsers {
  note: Note & {
    users: User[];
    preference: Preference | null;
  };
  isOwner: boolean;
}

export default function DropdownOptionsNote({ note, isOwner }: NoteWithUsers) {
  const router = useRouter();

  const handleDeleteNote = async () => {
    const res = await axios.delete(`/api/note/${note.id}`);
    if (res.data.success) {
      router.replace("/app");
    }
  };
  // todo : download note
  const handleDownloadNote = async () => {};
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
        {isOwner && (
          <>
            <div
              onClick={handleDeleteNote}
              className="flex items-center hover:bg-primary/10 p-3 cursor-pointer "
            >
              <AiFillDelete color={"red"} size={25} />
              <span className="ml-3 font-semibold">Supprimer la note</span>
            </div>
          </>
        )}
        <PersonalizationDialog note={note} />
        <div className="flex items-center hover:bg-primary/10 p-3 cursor-pointer ">
          <BsFillCloudDownloadFill size={25} />
          <span className="ml-3 font-semibold">Télécharger</span>
        </div>
        {isOwner && (
          <>
            <Separator />
            <div className="flex items-center hover:bg-primary/10 p-3 cursor-pointer ">
              <Switch
                defaultChecked={note.published}
                onCheckedChange={handlePublishNote}
              />
              <span className="ml-3 font-semibold">Template public</span>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
