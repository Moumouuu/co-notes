"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";

import type { Note } from "@prisma/client";

import { AiFillHeart, AiOutlineDownload, AiOutlineHeart } from "react-icons/ai";

interface NoteProps {
  note: Note & {
    _count: {
      like: number;
    };
    likes: {
      id: string;
      userId: string;
      noteId: string;
    }[];
  };
}

export default function note({ note }: NoteProps) {
  //todo : add link to note
  // todo : add preview of note
  const userLiked = note.likes?.some((like) => like.userId === note.userId);

  const [isLiked, setIsLiked] = useState(userLiked || false);
  const [numberOfLikes, setNumberOfLikes] = useState(note._count.like || 0);

  const handleLike = async (noteId: string) => {
    try {
      await axios.post("/api/like", { noteId });
      setIsLiked((prev) => !prev);
      setNumberOfLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (e) {
      console.log(`Error while liking note ${noteId}: ${e}`);
    }
  };

  const handleTemplate = async (note: Note) => {
    // todo : add take template button to note (if published && not mine)
    // todo : on page /app/template show button to take template
  };

  return (
    <div className="my-10 w-[300px] h-[300px] flex-shrink-0 border rounded-xl shadow-lg mx-4">
      <div className="h-full flex flex-col justify-between">
        <Link href={`/app/note/${note.id}`} className="h-full">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center px-4 py-2">
              <h3 className="text-xl font-bold">{note.title}</h3>
            </div>
          </div>
        </Link>
        <div className="flex flex-row justify-between items-center px-4 py-2">
          <div className="flex flex-row items-center">
            <AiOutlineDownload className="mr-2" />
            <p>{note.numberDownload}</p>
          </div>
          <div
            className="flex flex-row items-center cursor-pointer"
            onClick={() => handleLike(note.id)}
          >
            {isLiked ? (
              <AiFillHeart className="mr-2" />
            ) : (
              <AiOutlineHeart className="mr-2" />
            )}
            <p>{numberOfLikes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
