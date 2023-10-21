"use client";

import Note from "@/components/note";
import { Button } from "@/components/ui/button";
import type { Like, Note as NoteType, User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AllMyNotes({
  allUserNotes,
  currentUser,
}: {
  allUserNotes: NoteType[];
  currentUser: User;
}) {
  const [notes, setNotes] = useState(allUserNotes);
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);

  useEffect(() => {
    setNotes(allUserNotes);
  }, [allUserNotes]);

  const userFavoritesNotes = notes.filter((note: any) => {
    return note.likes?.some((like: Like) => like.userId === currentUser.id);
  });

  const userNotesSharedWithMe = notes.filter((note: any) => {
    const isUserInUsersList = note.users?.some(
      (user: User) => user.id === currentUser.id
    );
    const isCurrentUserNoteCreator = note.userId !== currentUser.id;

    return isUserInUsersList && isCurrentUserNoteCreator;
  });

  return (
    <>
      {/* No notes */}
      {notes.length === 0 && (
        <div className="flex flex-col mt-10 mx-4 items-center">
          <h2 className="text-2xl md:text-3xl mb-4">
            Vous n&apos;avez pas de notes !
          </h2>
          <p className="my-2">Créez votre première note ! 🎉</p>
          <Link href={"/app/note"}>
            {/* todo : add create note */}
            <Button variant={"purple"}>Essaie pour voir...</Button>
          </Link>
        </div>
      )}

      {/* Recent notes */}
      {notes.length > 0 && (
        <div className="flex flex-col mt-10 mx-4">
          <h2 className="text-2xl md:text-3xl">Mes dernières notes 🗒️</h2>
          <div className="flex overflow-x-auto space-x-8 w-full">
            {notes?.map((note: any) => (
              <Note key={note.id} note={note} currentUser={currentUser} />
            ))}
          </div>
        </div>
      )}

      {/* Favorites notes */}
      {userFavoritesNotes.length > 0 && (
        <div className="flex flex-col mt-10 mx-4">
          <h2 className="text-2xl md:text-3xl">Mes notes favorites 💜</h2>
          <div className="flex overflow-x-auto space-x-8 w-full">
            {userFavoritesNotes?.map((note: any) => (
              <Note key={note.id} note={note} currentUser={currentUser} />
            ))}
          </div>
        </div>
      )}

      {/* Notes shared with me */}
      {userNotesSharedWithMe.length > 0 && (
        <div className="flex flex-col mt-10 mx-4">
          <h2 className="text-2xl md:text-3xl">
            Les notes qu&apos;on m&apos;a partagé 🤝
          </h2>
          <div className="flex overflow-x-auto space-x-8 w-full">
            {userNotesSharedWithMe?.map((note: any) => (
              <Note key={note.id} note={note} currentUser={currentUser} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
