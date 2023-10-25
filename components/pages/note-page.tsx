"use client";
import { customDarkTheme } from "@/lib/block-note";
import { Block, BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/style.css";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { Note } from "@prisma/client";
import axios from "axios";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import NavNoteButtons from "../nav-note-buttons";

export default function NotePage({ note }: { note: Note }) {
  /*const generateScreenshot = async () => {
    try {
      const res = await axios.post("/api/note/screenshot", {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/app/note/${note.id}}`,
      });

      // save screenshot for the current note & remove old one
      await axios.put("/api/note/screenshot", {
        idNote: note.id,
        image: res.data.url,
      });
    } catch (error) {
      console.error(`Error while generating screenshot & updating: ${error}`);
    }
  };
   todo : call 2 times
  generateScreenshot();
  */

  const { resolvedTheme } = useTheme();

  const editor: BlockNoteEditor = useBlockNote({
    editable: true,
    initialContent: note.content
      ? (JSON.parse(note.content) as Block[])
      : undefined,
  });

  var lastTopLevelBlocks: Block[] = note.content
    ? JSON.parse(note.content)
    : [];

  // Fonction à appeler toutes les 10 secondes
  const saveContent = async () => {
    // Si le contenu n'a pas changé, on ne fait rien
    if (
      JSON.stringify(lastTopLevelBlocks) ===
      JSON.stringify(editor.topLevelBlocks)
    )
      return;
    try {
      const content: Block[] = editor.topLevelBlocks;
      await axios.put("/api/note", {
        idNote: note.id,
        content: content,
      });
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde automatique : ${error}`);
    }
  };

  // Utilisation de useEffect pour définir un intervalle de 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      saveContent();
    }, 10000); // 10000 millisecondes (10 secondes)

    // Fonction pour arrêter l'intervalle lorsque le composant est démonté
    return () => {
      clearInterval(interval);
    };
  }, []); // Vide le tableau de dépendances pour que cela s'exécute une seule fois à la création du composant

  useEffect(() => {
    window.addEventListener("beforeunload", saveContent);

    return () => {
      window.removeEventListener("beforeunload", saveContent);
    };
  }, []);

  // Renders the editor instance using a React component.
  return (
    <div className="w-full h-screen overflow-y-scroll mt-12 md:mt-5">
      <div className="z-40 flex w-full md:w-[80%] items-center justify-between fixed top-0 backdrop-blur-sm py-3 px-5">
        <h1 className="text-2xl md:text-3xl">{note.title}</h1>
        <NavNoteButtons note={note} />
      </div>
      <BlockNoteView
        className="mt-14 md:mt-20"
        editor={editor}
        theme={resolvedTheme === "light" ? "light" : customDarkTheme}
      />
    </div>
  );
}
