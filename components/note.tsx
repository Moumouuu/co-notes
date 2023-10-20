import type { Note } from "@prisma/client";
import { AiOutlineDownload, AiOutlineHeart } from "react-icons/ai";

interface NoteProps {
  note: Note & {
    Like: {
      id: string;
    }[];
    User: {
      id: string;
      name: string;
    }[];
  };
}

//todo : add link to note
// todo : add preview of note

const handleLike = async (noteId: string) => {
  // todo : add take template button to note (if published && not mine)
};
const handleTemplate = async (note: Note) => {
  //todo ; like
};

export default function note({ note }: NoteProps) {
  return (
    <div className="my-10 w-[300px] h-[300px] border rounded-xl shadow-lg mx-4">
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center px-4 py-2">
            <h3 className="text-xl font-bold">{note.title}</h3>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center px-4 py-2">
          <div className="flex flex-row items-center">
            <AiOutlineDownload className="mr-2" />
            <p>{note.numberDownload}</p>
          </div>
          <div className="flex flex-row items-center">
            <AiOutlineHeart className="mr-2" />
            <p>{note.Like.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
