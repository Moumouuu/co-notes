import Nav from "@/components/nav";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Co-Notes - Collaborative Notes & Realtime for Teams and Individuals",
  description:
    "Co-Notes is a collaborative note-taking app in realtime for teams and individuals. You can easily share and custom your notes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className + " flex flex-col"}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
