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

  return NextResponse.json(newNotes);
}

export async function PUT(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);

  if (!session) return;

  if (!session?.user?.email) return;

  const { idNote, content, title } = await req.json();

  const updatedNote = await prismadb.note.update({
    where: {
      id: idNote,
    },
    data: {
      content: JSON.stringify(content),
      title,
    },
  });

  return NextResponse.json(updatedNote);
}
