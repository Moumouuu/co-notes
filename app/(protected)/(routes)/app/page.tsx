import { getUser } from "@/actions/get-user";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

import Note from "@/components/note";

import type { Like } from "@prisma/client";

export default async function Home() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const allUserNotes = await prismadb.note.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 15,
    include: {
      likes: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  const userFavoritesNotes = allUserNotes.filter((note: any) => {
    return note.like?.map((like: Like) => like.userId === user.id);
  });

  console.log(allUserNotes);
  console.log(userFavoritesNotes);

  // todo : filter notes to have only mine
  // todo : filter notes to have only my favorites
  return (
    <div className="w-full flex flex-col pt-10 overflow-y-scroll h-screen">
      <h1 className="text-2xl md:text-3xl text-center">Mes notes</h1>
      <div className="flex flex-col mt-10 mx-4">
        <h2 className="text-2xl md:text-3xl">Mes dernières notes 🗒️</h2>
        <div className="flex overflow-x-auto space-x-8 w-full">
          {allUserNotes?.map((note: any) => (
            <Note key={note.id} note={note} />
          ))}
        </div>
      </div>
    </div>
  );
}
