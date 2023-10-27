import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: {
    params: { noteId: string; userId: string };
  }
) {
  const session = await getServerSession(authOptions);
  const noteId = context.params.noteId;

  if (!session || !noteId) {
    return new Response("No session or noteId");
  }

  if (!session?.user?.email) {
    return new Response("No session user email");
  }

  const user = await prismadb.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return new Response("User not found");
  }

  const note = await prismadb.note.findUnique({
    where: {
      id: noteId?.toString(),
    },
  });

  if (!note) {
    return new Response("Note not found");
  }

  if (user.id !== note.userId) {
    return new Response("Not authorized");
  }

  //delete all rights
  await prismadb.userRightNote.deleteMany({
    where: {
      noteId: noteId,
    },
  });
  // delete all preferences
  await prismadb.preference.deleteMany({
    where: {
      noteId: noteId,
    },
  });
  // delete notes
  await prismadb.note.delete({
    where: {
      id: noteId,
    },
  });

  return NextResponse.json({
    success: true,
    code: 200,
  });
}
