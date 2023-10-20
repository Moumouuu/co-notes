import { getUser } from "@/actions/get-user";
import AddingNoteButton from "@/components/adding-note-button";
import Note from "@/components/note";
import { Button } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";
import type { Like, User } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const currentUser = await getUser();
  if (!currentUser) {
    redirect("/sign-in");
  }

  const allUserNotes = await prismadb.note.findMany({
    where: {
      OR: [
        {
          userId: currentUser.id,
        },
        {
          users: {
            some: {
              id: currentUser.id,
            },
          },
        },
      ],
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      likes: true,
      users: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  const userFavoritesNotes = allUserNotes.filter((note: any) => {
    return note.likes?.some((like: Like) => like.userId === currentUser.id);
  });

  const userNotesSharedWithMe = allUserNotes.filter((note: any) => {
    const isUserInUsersList = note.users?.some(
      (user: User) => user.id === currentUser.id
    );
    const isCurrentUserNoteCreator = note.userId !== currentUser.id;

    return isUserInUsersList && isCurrentUserNoteCreator;
  });

  return (
    <div className=" w-full flex flex-col pt-10 overflow-y-scroll h-screen">
      <AddingNoteButton />
      <h1 className="text-2xl md:text-3xl text-center">Mes notes</h1>

      {/* No notes */}
      {allUserNotes.length === 0 && (
        <div className="flex flex-col mt-10 mx-4">
          <h2 className="text-2xl md:text-3xl">
            Vous n&apos;avez pas de notes
          </h2>
          <p className="text-center">Créez votre première note ! 🎉</p>
          <Link href={"/app/note"}>
            <Button variant={"purple"}>Essaie pour voir...</Button>
          </Link>
        </div>
      )}

      {/* Recent notes */}
      {allUserNotes.length > 0 && (
        <div className="flex flex-col mt-10 mx-4">
          <h2 className="text-2xl md:text-3xl">Mes dernières notes 🗒️</h2>
          <div className="flex overflow-x-auto space-x-8 w-full">
            {allUserNotes?.map((note: any) => (
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
    </div>
  );
}
