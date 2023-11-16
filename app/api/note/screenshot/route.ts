import prismadb from "@/lib/prismadb";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const { url, noteId } = await req.json();

  if (!url || !noteId) throw new Response("Missing data");

  try {
    // update note screenshot url
    const res = await prismadb.note.update({
      where: {
        id: noteId,
      },
      data: {
        image: url,
      },
    });

    if(!res) throw new NextResponse("Error updating note");
    return NextResponse.json({res});
    
  } catch (error: any) {
    throw new NextResponse(error);
  }
}
