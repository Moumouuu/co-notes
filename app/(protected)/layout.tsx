import { getUser } from "@/actions/get-user";
import AsideMenu from "@/components/aside-menu";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { redirect } from "next/navigation";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Co-Notes - Collaborative Notes & Realtime for Teams and Individuals",
  description:
    "Co-Notes is a collaborative note-taking app in realtime for teams and individuals. You can easily share and custom your notes.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }
  return (
    <html lang="fr">
      <body className={inter.className}>
        <main className="flex">
          <AsideMenu currentUser={user} />
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
