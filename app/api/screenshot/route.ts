// pages/api/screenshot.js
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest, res: NextResponse) {
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
