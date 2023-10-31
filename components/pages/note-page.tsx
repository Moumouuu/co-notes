"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { customDarkTheme, customLightTheme, theme } from "@/lib/block-note";
import { Block, BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/style.css";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { Note, Preference, User, UserRightNote } from "@prisma/client";
import axios from "axios";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { BiLoader, BiSave } from "react-icons/bi";
import YPartyKitProvider from "y-partykit/provider";
import * as Y from "yjs";
import NavNoteButtons from "../nav-note-buttons";

interface Props {
  note: Note & {
    users: User[];
    preference: Preference | null;
  };
  currentUser: User;
}

interface UserWithRights extends User {
  userRightNote: UserRightNote[];
}

export default function NotePage({ note, currentUser }: Props) {
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
  generateScreenshot();
  */

  const { resolvedTheme } = useTheme();
  const title = useRef<HTMLHeadingElement | null>(null);

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

  const isOwner = currentUser.id === note.userId;

  const doc = new Y.Doc();

  const provider = new YPartyKitProvider(
    "blocknote-dev.yousefed.partykit.dev",
    // use a unique name as a "room" for your application:
    note.id.toString(),
    doc
  );

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 2; i < 8; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

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

  var lastSavedTopLevelBlocks = note.content ? JSON.parse(note.content) : [];
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const saveContent = async () => {
    const isSaved =
      JSON.stringify(lastSavedTopLevelBlocks) ===
        JSON.stringify(editor.topLevelBlocks) &&
      title.current &&
      title.current.innerText === note.title;

    // Si le contenu n'a pas changé, on ne fait rien
    if (isSaved) return;
    // ! bug : des fois le contenue est reset
    try {
      setIsLoading(true);
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
    }, 5000);
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

  //todo : color background for note
  console.log(note.preference?.colorBg)
  return (
    <div className={`w-full h-screen overflow-y-scroll pt-12 md:pt-5`}>
      <div className="z-40 flex w-full md:w-[80%] items-center justify-between fixed top-0 backdrop-blur-sm py-5 px-10 pt-14 md:pt-5">
        <div className="flex items-center">
          <h1
            ref={title}
            className="text-3xl md:text-4xl font-bold mr-3"
            contentEditable
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
        theme={resolvedTheme === "light" ? customLightTheme : theme}
      />
    </div>
  );
}
