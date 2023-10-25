"use client";
import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/style.css";
import {
  BlockNoteView,
  Theme,
  lightDefaultTheme,
  useBlockNote,
} from "@blocknote/react";
import { Note } from "@prisma/client";
import { useTheme } from "next-themes";

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

  // Custom dark theme
  const customDarkTheme = {
    // @ts-ignore
    type: "light",
    colors: {
      editor: {
        text: "#ffffff",
        background: "#020817",
      },
      menu: {
        text: "#ffffff",
        background: "#020817",
      },
      tooltip: {
        text: "#ffffff",
        background: "#020817",
      },
      hovered: {
        text: "#ffffff",
        background: "#280032",
      },
      selected: {
        text: "#ffffff",
        background: "#020817",
      },
      disabled: {
        text: "#9b0000",
        background: "#020817",
      },
      shadow: "#280032",
      border: "#280032",
      sideMenu: "#fff",
      highlightColors: lightDefaultTheme.colors.highlightColors,
    },
    borderRadius: 4,
    fontFamily: "Helvetica Neue, sans-serif",
  } satisfies Theme;

  const editor: BlockNoteEditor = useBlockNote({});

  // Renders the editor instance using a React component.
  return (
    <div className="w-full h-screen overflow-y-scroll">
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "light" ? "light" : customDarkTheme}
      />
    </div>
  );
}
