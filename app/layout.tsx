import { authOptions } from "@/lib/auth";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import AuthContext from "./context/auth-context";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

import { ThemeProvider } from "@/components/theme-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";

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
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthContext session={session}>
            <EdgeStoreProvider>{children}</EdgeStoreProvider>
            <Analytics />
          </AuthContext>
        </ThemeProvider>
      </body>
    </html>
  );
}
