import { getUser } from "@/actions/get-user";
import AllTemplates from "@/components/all-templates";
import prismadb from "@/lib/prismadb";

export default async function PageTemplate() {
    const currentUser = await getUser();
  const notesTemplates = await prismadb.note.findMany({
    where: {
      published: true,
    },
    orderBy: {
      numberDownload: "desc",
    },
    include: {
      likes: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });


  if(!currentUser) {
    return <div>Vous devez être connecté pour accéder à cette page</div>
  }

  return (
    <div className="w-full flex flex-col pt-10 overflow-y-scroll">
      <h1 className="text-2xl md:text-3xl text-center">
        Les templates publiques 🗒️
      </h1>
      <AllTemplates notesTemplates={notesTemplates} currentUser={currentUser} />
    </div>
  );
}
