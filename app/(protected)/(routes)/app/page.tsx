import { getUser } from "@/actions/get-user";
import AddingNoteButton from "@/components/adding-note-button";
import AllMyNotes from "@/components/all-my-notes";
import prismadb from "@/lib/prismadb";
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

  return (
    <div className=" w-full flex flex-col pt-10 overflow-y-scroll h-screen">
      <AddingNoteButton />
      <h1 className="text-2xl md:text-3xl text-center">Mes notes</h1>
      <AllMyNotes currentUser={currentUser} allUserNotes={allUserNotes} />
    </div>
  );
}
