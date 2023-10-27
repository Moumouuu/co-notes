import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: { noteId: string } }
) {
  const { noteId } = context.params;
  const { colorBg, font } = await req.json();

  if (!noteId) return new NextResponse("Missing data");

  const session = await getServerSession(authOptions);

  if (!session) return new Response("Unauthorized");

  const result = await prismadb.preference.update({
    where: {
      noteId,
    },
    data: {
      colorBg,
      font,
    },
  });

  return new Response(JSON.stringify(result));
}
