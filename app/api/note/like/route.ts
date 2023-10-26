import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { noteId } = await req.json();

  const session = await getServerSession(authOptions);

  if (!noteId) throw new Response("postId is required");
  if (!session?.user?.email) throw new Response("No user connected");

  const currentUser = await prismadb.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  if (!currentUser) throw new Response("No user found");

  // create like if not exist or delete it if exist
  const like = await prismadb.like.findFirst({
    where: {
      noteId,
      userId: currentUser.id,
    },
  });

  if (like) {
    await prismadb.like.delete({
      where: {
        id: like.id,
      },
    });
    return NextResponse.json({
      message: "Like deleted",
    });
  }

  const newLike = await prismadb.like.create({
    data: {
      noteId,
      userId: currentUser.id,
    },
  });

  return NextResponse.json(newLike);
}
