import { getUser } from "@/actions/get-user";
import NotePage from "@/components/pages/note-page";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

export default async function page({ params }: { params: { idNote: string } }) {
  const user = await getUser();
  const idNote = params.idNote;
  const note = await prismadb.note.findUnique({
    where: {
      id: idNote,
    },
    include: {
      users: true,
    },
  });

  if (!note) {
    return (
      <>
        <h1>Not found</h1>
      </>
    );
  }

  // protect page from other users
  if (user && !note.users.find((u) => u.id === user.id)) {
    return redirect("/app");
  }

  return <NotePage note={note} />;
}
