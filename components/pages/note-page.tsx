"use client";
import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/style.css";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { Note } from "@prisma/client";

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
  const editor: BlockNoteEditor = useBlockNote({});

  // Renders the editor instance using a React component.
  return <BlockNoteView editor={editor} />;
}
