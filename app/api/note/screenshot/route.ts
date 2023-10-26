// pages/api/screenshot.js
import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import fs from "fs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest, res: NextResponse) {
  // todo : find another option because this one is not working -> redirect to login page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const { url } = await req.json(); // Récupérez l'URL de la page à prévisualiser depuis les paramètres de requête

  await page.goto(url, { waitUntil: "networkidle2" });

  const screenshot = await page.screenshot();

  await browser.close();

  // Générez un nom de fichier unique en utilisant un horodatage
  const timestamp = new Date().getTime();
  const imageFileName = `screenshot_${timestamp}.png`;

  // Définissez le chemin du fichier où vous souhaitez enregistrer l'image
  const imageFilePath = path.join(
    process.cwd(),
    "public",
    "images",
    "screenshot",
    imageFileName
  );

  // Enregistrez la capture d'écran dans le fichier spécifié
  fs.writeFileSync(imageFilePath, screenshot);

  // Renvoyez l'URL de l'image avec le nom de fichier unique
  return NextResponse.json({
    url: `public/images/screenshot/${imageFileName}`,
  });
}

export async function PUT(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);

  if (!session) return;

  if (!session?.user?.email) return;

  const user = await prismadb.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  if (!user) throw new Response("User not found");

  const { idNote, image } = await req.json();

  // Récupérez l'emplacement de l'ancienne image depuis la base de données
  const note = await prismadb.note.findUnique({
    where: {
      id: idNote,
    },
  });

  if (!note) {
    throw new Response("Note not found");
  }

  if (note.image) {
    // Obtenez le chemin complet de l'ancienne image
    const oldImageFilePath = path.join(process.cwd(), note.image);

    // Supprimez l'ancienne image du dossier "public"
    fs.unlinkSync(oldImageFilePath);
  }

  // Mettez à jour la base de données avec la nouvelle image
  const updatedNote = await prismadb.note.update({
    where: {
      id: idNote,
    },
    data: {
      image,
    },
  });

  return NextResponse.json(updatedNote);
}
