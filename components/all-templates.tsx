"use client";

import { User, Note as NoteType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Note from "./note";

export default function AllTemplates({
  notesTemplates,
  currentUser,
}: {
  notesTemplates: NoteType[];
  currentUser: User;
}) {
  const [notes, setNotes] = useState(notesTemplates);
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);

  useEffect(() => {
    setNotes(notesTemplates);
  }, [notesTemplates]);

  return (
    <div className="grid justify-center grid-cols lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-2 md:gap-4">
      {notes?.map((note: any) => (
        <Note key={note.id} note={note} currentUser={currentUser} />
      ))}
    </div>
  );
}
