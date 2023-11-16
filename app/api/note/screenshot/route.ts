import prismadb from "@/lib/prismadb";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest, res: NextResponse) {
  const { imageData, fileName, noteId } = await req.json();

  if (!imageData || !fileName || !noteId) throw new Response("Missing data");

    
  const publicFolderPath = path.join(
    process.cwd(),
    "public",
    "images",
    "screenshot"
  );

  // create the folder screenshot in public/images/ if it doesn't exist
  if (!fs.existsSync(publicFolderPath)) {
    fs.mkdirSync(publicFolderPath, { recursive: true });
  }

  const filePath = path.join(publicFolderPath, fileName);

  // Save the image to the public folder
  try {
    await fs.promises.writeFile(filePath, imageData, "base64");

    // update note screenshot url
    const res = await prismadb.note.update({
      where: {
        id: noteId,
      },
      data: {
        image: `images/screenshot/${fileName}`,
      },
    });

    if(!res) throw new NextResponse("Error updating note");
    return NextResponse.json({res});
    
  } catch (error: any) {
    throw new NextResponse(error);
  }
}
