import { getUser } from "@/actions/get-user";
import Note from "@/components/note";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const allNotes = await prismadb.note.findMany({
    where: {
      userId: user.id,
    },
  });

  const test = [
    {
      id: "1",
      title: "test",
      content: "test",
      createdAt: new Date(),
      updatedAt: new Date(),
      numberDownload: 0,
      published: false,
      linkInvitation: "1",
      userId: "1",
      Like: [],
      User: [],
    },
    {
      id: "1",
      title: "test",
      content: "test",
      createdAt: new Date(),
      updatedAt: new Date(),
      numberDownload: 0,
      published: false,
      linkInvitation: "1",
      userId: "1",
      Like: [],
      User: [],
    },
    {
      id: "1",
      title: "test",
      content: "test",
      createdAt: new Date(),
      updatedAt: new Date(),
      numberDownload: 0,
      published: false,
      linkInvitation: "1",
      userId: "1",
      Like: [],
      User: [],
    },
    {
      id: "1",
      title: "test",
      content: "test",
      createdAt: new Date(),
      updatedAt: new Date(),
      numberDownload: 0,
      published: false,
      linkInvitation: "1",
      userId: "1",
      Like: [],
      User: [],
    },
    {
      id: "1",
      title: "test",
      content: "test",
      createdAt: new Date(),
      updatedAt: new Date(),
      numberDownload: 0,
      published: false,
      linkInvitation: "1",
      userId: "1",
      Like: [],
      User: [],
    },
    {
      id: "1",
      title: "test",
      content: "test",
      createdAt: new Date(),
      updatedAt: new Date(),
      numberDownload: 0,
      published: false,
      linkInvitation: "1",
      userId: "1",
      Like: [],
      User: [],
    },
  ];

  console.log(allNotes);
  // todo : filter notes to have only mine
  // todo : filter notes to have only my favorites
  return (
    <div className="w-full flex flex-col pt-10 overflow-y-scroll h-screen">
      <h1 className="text-2xl md:text-3xl text-center">Mes notes</h1>
      <div className="flex flex-col mt-10 mx-4">
        <h2 className="text-2xl md:text-3xl">Mes 💜 </h2>
        <div className="flex overflow-x-auto">
          {test.map((note) => (
            <Note key={note.id} note={note} />
          ))}
        </div>
      </div>
    </div>
  );
}
