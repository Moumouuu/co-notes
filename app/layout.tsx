import { authOptions } from "@/lib/auth";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import AuthContext from "./context/auth-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Co-Notes - Collaborative Notes for Teams and Individuals",
  description:
    "Co-Notes is a collaborative note-taking app for teams and individuals.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthContext session={session}>{children}</AuthContext>
      </body>
    </html>
  );
}
