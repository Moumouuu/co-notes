// pages/api/screenshot.js
import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import fs from "fs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const browser = await puppeteer.launch({
      headless: "new"
    });
    const page = await browser.newPage();
    const { url } = await req.json();

    // set viewport size mobile
    await page.setViewport({ width: 450, height: 812 });

    // Naviguer vers la page de connexion
    await page.goto(url, { waitUntil: "networkidle2" });

    // Remplir les champs de connexion
    await page.type("#email", process.env.NEXT_PUBLIC_PUPPETEER_ADMIN!);
    await page.type("#password", process.env.NEXT_PUBLIC_PUPPETEER_PASSWORD!);
    await Promise.all([
      page.click("#submit"),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);

    // go to sheetPage
    await page.goto(url, { waitUntil: "load" });

    // Prendre une capture d'écran
    const screenshot = await page.screenshot();

    // Fermer le navigateur
    await browser.close();

    // Générer un nom de fichier unique en utilisant un horodatage
    const timestamp = new Date().getTime();
    const imageFileName = `screenshot_${timestamp}.png`;

    // Créer un dossier s'il n'existe pas encore
    const dir = path.join(process.cwd(), "public", "images", "screenshot");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Définir le chemin du fichier où vous souhaitez enregistrer l'image
    const imageFilePath = path.join(
      process.cwd(),
      "public",
      "images",
      "screenshot",
      imageFileName
    );

    // Enregistrer la capture d'écran dans le fichier spécifié
    fs.writeFileSync(imageFilePath, screenshot);

    // Renvoyer l'URL de l'image avec le nom de fichier unique
    return NextResponse.json({
      url: `images/screenshot/${imageFileName}`,
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
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

  // !! todo : remove old image
  /*
  if (note.image) {
    // Obtenez le chemin complet de l'ancienne image
    const oldImageFilePath = path.join(process.cwd(), note.image);

    // Supprimez l'ancienne image du dossier "public"
    fs.unlinkSync(oldImageFilePath);
  }
*/
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
