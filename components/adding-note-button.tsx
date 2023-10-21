"use client";
import newNote from "@/actions/new-note";
import { useRouter } from "next/navigation";
import { AiOutlinePlus } from "react-icons/ai";

export default function AddingNoteButton() {
  const router = useRouter();
  return (
    <div
      onClick={() => newNote(router)}
      className="fixed cursor-pointer right-5 bottom-7 p-3 rounded-full bg-gradient-to-r from-[#953AB9] to-[#471F57] hover:animate-pulse"
    >
      <div>
        <AiOutlinePlus size={30} />
      </div>
    </div>
  );
}
