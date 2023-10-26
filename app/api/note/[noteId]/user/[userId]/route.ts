import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: { noteId: string; userId: string } }
) {
  const noteId = context.params.noteId;
  const userId = context.params.userId;

  console.log(context.params);

  const session = await getServerSession(authOptions);

  if (!session || !noteId) {
    return new Error("No session or noteId");
  }

  if (!session?.user?.email) {
    return new Error("No session user email");
  }

  const user = await prismadb.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return new Error("User not found");
  }

  const note = await prismadb.note.findUnique({
    where: {
      id: noteId?.toString(),
    },
  });

  if (!note) {
    return new Error("Note not found");
  }

  // remove userId from users array
  const noteUpdated = await prismadb.note.update({
    where: {
      id: noteId.toString(),
    },
    data: {
      users: {
        disconnect: {
          id: userId.toString(),
        },
      },
    },
  });

  return new Response(JSON.stringify(noteUpdated));
}
