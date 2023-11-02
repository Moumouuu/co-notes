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

  if (!user) throw new Response("User not found");

  const { content, title } = await req.json();

  const newNotes = await prismadb.note.create({
    data: {
      title: title ?? "Untitled Note",
      userId: user.id,
      content: JSON.stringify(content),
      preference: {
        create: {},
      },
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

  if (!rightUser) throw new Response("User not found");

  return NextResponse.json(newNotes);
}

export async function PUT(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);

  if (!session) return;

  if (!session?.user?.email) return;

  const { idNote, content, title, published, numberDownload } = await req.json();

  const updatedNote = await prismadb.note.update({
    where: {
      id: idNote,
    },
    data: {
      content: JSON.stringify(content),
      title,
      published: published,
      numberDownload
    },
  });

  return NextResponse.json(updatedNote);
}
