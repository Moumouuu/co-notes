"use client";

import { cn } from "@/lib/utils";
import type { Note, User } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillHeart, AiOutlineDownload, AiOutlineHeart } from "react-icons/ai";
import { Button } from "./ui/button";

interface NoteProps {
  currentUser: User;
  note: Note & {
    _count: {
      likes: number;
    };
    likes: {
      id: string;
      userId: string;
      noteId: string;
    }[];
  };
}

export default function Note({ note, currentUser }: NoteProps) {
  const userLiked = note.likes?.some((like) => like.userId === currentUser.id);

  const [isLiked, setIsLiked] = useState(userLiked || false);
  const [numberOfLikes, setNumberOfLikes] = useState(note._count.likes || 0);

  const router = useRouter();
  const path = usePathname();
  const isTemplatePage = path === "/app/templates";

  const handleLike = async (noteId: string) => {
    try {
      await axios.post("/api/note/like", { noteId });
      setIsLiked((prev) => !prev);
      setNumberOfLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (e) {
      console.log(`Error while liking note ${noteId}: ${e}`);
    }
  };

  const handleTemplate = async (note: Note) => {
    try {
      // increment numberDownload
      await axios.put("/api/note", {
        idNote: note.id,
        numberDownload : note.numberDownload + 1
      })
      // create new note with content
      const newNote = await axios.post("/api/note", {
        title: "Copie de " + note.title,
        content : note.content
      })
      console.log(newNote)
      // todo : redirect crash app and content is a string not an object
      // redirect to new note
      router.push(`/app/note/${newNote.data.id}`)
    }catch(e){
      console.log(`Error while updating note ${note.id}: ${e} or creating new note with content`);
    }
  };

  return (
    <div
      className={cn(
        "my-10 w-[300px] h-[300px] flex-shrink-0 border rounded-xl shadow-lg mx-4",
        note.image ? "bg-white" : "bg-no-background-note"
      )}
    >
      <div className="h-full flex flex-col justify-between">
        <Link href={`/app/note/${note.id}`} className="h-full">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center px-4 py-2 text-black">
              <h3 className="text-xl font-bold">{note.title}</h3>
            </div>
          </div>
        </Link>
        <div className="flex flex-row justify-between items-center px-4 py-2">
          <div className="flex flex-row items-center">
            <AiOutlineDownload className="mr-2" color={"black"} />
            <p className="text-black">{note.numberDownload}</p>
          </div>

          {isTemplatePage && (
            <Button onClick={() => handleTemplate(note)} variant={"purple"}>
              Prendre la template
            </Button>
          )}

          <div
            className="flex flex-row items-center cursor-pointer"
            onClick={() => handleLike(note.id)}
          >
            {isLiked ? (
              <AiFillHeart className="mr-2" color={"red"} />
            ) : (
              <AiOutlineHeart className="mr-2" color={"black"} />
            )}
            <p className="text-black">{numberOfLikes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
