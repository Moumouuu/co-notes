// pages/api/screenshot.js
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(req: NextRequest, res: NextResponse) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const { url } = await req.json(); // Récupérez l'URL de la page à prévisualiser depuis les paramètres de requête

  await page.goto(url, { waitUntil: "networkidle2" });

  const screenshot = await page.screenshot();

  await browser.close();

  // Enregistrez la capture d'écran dans un fichier
  fs.writeFileSync("public/screenshot.png", screenshot);

  // Vous pouvez maintenant utiliser 'screenshot.png' comme og:image
  // N'oubliez pas de gérer le stockage, le nettoyage, etc., en fonction de vos besoins.

  return NextResponse.json({ url: "/screenshot.png" });
}
