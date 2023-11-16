"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Block, BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/style.css";
import {
  BlockNoteView,
  Theme,
  lightDefaultTheme,
  useBlockNote,
} from "@blocknote/react";
import { Note, Preference, User, UserRightNote } from "@prisma/client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BiLoader, BiSave } from "react-icons/bi";
import YPartyKitProvider from "y-partykit/provider";
import * as Y from "yjs";
import NavNoteButtons from "../nav-note-buttons";
import { fonts } from "@/lib/font";
import { cn, dataURLtoFile, generateRandomColor } from "@/lib/utils";
import html2canvas from "html2canvas";
import { useEdgeStore } from "@/lib/edgestore";

interface Props {
  note: NoteType;
  currentUser: User;
}

interface NoteType extends Note {
  preference: Preference | null;
  users: User[];
}

interface UserWithRights extends User {
  userRightNote: UserRightNote[];
}

export default function NotePage({ note, currentUser }: Props) {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { edgestore } = useEdgeStore();

  const title = useRef<HTMLHeadingElement | null>(null);

  const selectedFont = fonts.find(
    (font) => font.name === note.preference?.font
  )?.name;

  const currentUserRights = note.users.find(
    (u) => u.id === currentUser.id
  ) as UserWithRights;

  const canEdit =
    currentUserRights &&
    currentUserRights.userRightNote.find(
      (r: UserRightNote) => r.noteId === note.id
    )?.role === "USER"
      ? false
      : true;

  var lastSavedTopLevelBlocks = note.content ? JSON.parse(note.content) : [];
  const colorSelected = note.preference?.colorBg;
  const isOwner = currentUser.id === note.userId;
  const doc = new Y.Doc();

  const provider = new YPartyKitProvider(
    "blocknote-dev.yousefed.partykit.dev",
    // use a unique name as a "room" for your application:
    note.id.toString(),
    doc
  );

  const editor: BlockNoteEditor = useBlockNote({
    editable: canEdit,
    initialContent: note.content
      ? (JSON.parse(note.content) as Block[])
      : undefined,
    collaboration: {
      // The Yjs Provider responsible for transporting updates:
      provider,
      // Where to store BlockNote data in the Y.Doc:
      fragment: doc.getXmlFragment("document-store"),
      // Information (name and color) for this user:
      user: {
        name: currentUser.name ?? currentUser.email.split("@")[0],
        color: generateRandomColor(),
      },
    },
  });

  const generateScreenshot = async () => {
    const fileName = note.id + ".png";
    
    // generate screenshot of the note and upload it to the edge store
    const canvas = await html2canvas(document.getElementById("note")!);
    const image = canvas.toDataURL("image/png", 1.0);

    const file = dataURLtoFile(image, fileName);

    const res = await edgestore.publicFiles.upload({
      file,
      options: {
        replaceTargetUrl: note.image ?? undefined,
      }
    });

    //updating the note with the screenshot url
    try {
      await axios.post("/api/note/screenshot", {
        url: res.url,
        noteId : note.id
      });

    } catch (error) {
      console.error(`Error while generating screenshot & updating: ${error}`);
    }
  };

  const saveContent = async () => {
    const isSaved =
      JSON.stringify(lastSavedTopLevelBlocks) ===
        JSON.stringify(editor.topLevelBlocks) &&
      title.current &&
      title.current.innerText === note.title;

    // Si le contenu n'a pas changé, on ne fait rien
    if (isSaved) return;
    try {
      setIsLoading(true);

      generateScreenshot();

      const content: Block[] = editor.topLevelBlocks;
      await axios.put("/api/note", {
        idNote: note.id,
        content: content,
        title: (title.current && title.current.innerText) ?? note.title,
      });

      lastSavedTopLevelBlocks = content;
      setIsLoading(false);
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde automatique : ${error}`);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      saveContent();
    }, 10000);
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

  const customDarkTheme = {
    // @ts-ignore
    type: "dark",
    colors: {
      editor: {
        text: "#ffffff",
        background: colorSelected ?? "#020817",
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

  const customLightTheme = {
    // @ts-ignore
    type: "light",

    colors: {
      editor: {
        text: "#000",
        background: colorSelected ?? "#fff",
      },
      menu: {
        text: "#000",
        background: "#fff",
      },
      tooltip: {
        text: "#000",
        background: "#fff",
      },
      hovered: {
        text: "#000",
        background: "#B3B3B3",
      },
      selected: {
        text: "#000",
        background: "#fff",
      },
      disabled: {
        text: "#9b0000",
        background: "#fff",
      },
      shadow: "#B3B3B3",
      border: "#B3B3B3",
      sideMenu: "#000",
      highlightColors: lightDefaultTheme.colors.highlightColors,
    },
    borderRadius: 4,
    fontFamily: "Helvetica Neue, sans-serif",
  } satisfies Theme;

  const componentStyles = (theme: Theme) => ({
    Editor: {
      '[data-node-type="blockContainer"] *': {
        fontFamily: note.preference?.font ?? theme.fontFamily,
      },
    },
  });

  // Default dark theme with additional component styles.
  const theme = {
    light: {
      ...customLightTheme,
      componentStyles,
    },
    dark: {
      ...customDarkTheme,
      componentStyles,
    },
  } satisfies {
    light: Theme;
    dark: Theme;
  };

  return (
    <div
      style={{ backgroundColor: colorSelected ?? "primary" }}
      className={`w-full h-screen overflow-y-scroll pt-12 md:pt-5`}
      suppressContentEditableWarning={true}
      id="note"
    >
      <div className="z-40 flex w-full md:w-[80%] items-center justify-between fixed top-0 backdrop-blur-sm py-5 px-10 pt-14 md:pt-5">
        <div className="flex items-center">
          <h1
            ref={title}
            className={cn(
              `font-${selectedFont}`,
              "text-3xl md:text-4xl font-bold mr-3"
            )}
            contentEditable={true}
          >
            {note.title}
          </h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger onClick={saveContent}>
                {isLoading ? <BiLoader size={30} /> : <BiSave size={30} />}
              </TooltipTrigger>
              <TooltipContent>
                <p>Enregistré la note manuellement</p>
                <p className="text-gray-500">
                  La note est automatiquement enregistré toutes les 5 sec
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <NavNoteButtons note={note} isOwner={isOwner} />
      </div>
      <BlockNoteView
        className=" mt-28 md:mt-20"
        editor={editor}
        theme={theme}
      />
    </div>
  );
}
