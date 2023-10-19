import { getUser } from "@/actions/get-user";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { redirect } from "next/navigation";

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
  //todo verif si redirect marche
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
