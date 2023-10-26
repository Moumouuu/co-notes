"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function InvitePage({
  inviteLink,
  idNote,
}: {
  inviteLink: string;
  idNote: string;
}) {
  // fix hydration errors
  const [state, setState] = useState<boolean>(false);
  useEffect(() => {
    setState(true);
  }, []);
  const router = useRouter();

  const joinNote = async () => {
    const res = await axios.post(`/api/note/${idNote}/invite`, {
      inviteLink,
    });
    if (res.status === 200) {
      router.push(`/app/note/${idNote}`);
    }
  };

  if (!state) return null;

  return (
    <Dialog open>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">
            Vous êtes inviter à rejoindre une note
          </DialogTitle>
          <Separator />
          <DialogDescription>
            Vous pouvez rejoindre la note en cliquant sur le bouton ci-dessous.
            Demander à l&apos;administrateur de la note de vous donnez les
            permissions nécessaires pour écrire.
          </DialogDescription>
          <DialogFooter>
            <Button onClick={joinNote} variant={"purple"}>
              Rejoindre
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
