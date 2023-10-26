import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);

  if (!session) return;

  if (!session?.user?.email) return;

  const user = await prismadb.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  if (!user) throw new Error("User not found");

  const newNotes = await prismadb.note.create({
    data: {
      title: "Untitled Note",
      userId: user.id,
      users: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  const rightUser = await prismadb.userRightNote.create({
    data: {
      userId: user.id,
      noteId: newNotes.id,
      role: "ADMIN",
      userId_noteId: `${user.id}_${newNotes.id}}`,
    },
  });

  if (!rightUser) throw new Error("User not found");

  return NextResponse.json(newNotes);
}

export async function PUT(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);

  if (!session) return;

  if (!session?.user?.email) return;

  const { idNote, content, title, published } = await req.json();

  const oldNote = await prismadb.note.findUnique({
    where: {
      id: idNote,
    },
    select: {
      published: true,
    },
  });

  // todo : check if published is not toggle (in case this route is called from another file not wanted)
  const updatedNote = await prismadb.note.update({
    where: {
      id: idNote,
    },
    data: {
      content: JSON.stringify(content),
      title,
      published: !oldNote?.published,
    },
  });

  return NextResponse.json(updatedNote);
}
