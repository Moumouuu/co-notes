import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: { noteId: string } }
) {
  const { inviteLink } = await req.json();
  const noteId = context.params.noteId;
  const session = await getServerSession(authOptions);

  if (!inviteLink || !noteId) {
    return new Response("Missing inviteLink or noteId");
  }

  if (!session) {
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

  // check if inviteLink is valid
  const checkInvite = await prismadb.note.findUnique({
    where: {
      id: noteId,
      linkInvitation: inviteLink,
    },
  });

  if (!checkInvite) {
    return new Response("Invalid inviteLink");
  }

  // check if user is already in the note
  const userCheck = await prismadb.note.findFirst({
    where: {
      id: noteId,
      users: {
        some: {
          id: user.id,
        },
      },
    },
  });

  if (userCheck) {
    return NextResponse.json({
      status: 200,
    });
  }

  // add user to note & create right for him
  const addUser = await prismadb.note.update({
    where: {
      id: noteId,
    },
    data: {
      users: {
        connect: {
          id: user.id,
        },
      },
      userRightNote: {
        create: {
          userId: user.id,
          role: "USER",
          userId_noteId: `${user.id}_${noteId}`,
        },
      },
    },
  });

  if (!addUser) {
    return new Response("Error while adding user to note");
  }
  return NextResponse.json({
    status: 200,
  });
}
