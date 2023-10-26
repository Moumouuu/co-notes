"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Note, User } from "@prisma/client";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
import { FiShare } from "react-icons/fi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useState } from "react";

interface NoteWithUsers {
  note: Note & {
    users: User[];
  };
}

export default function InvitationDialog({ note : noteAsProps }: NoteWithUsers) {
  const { toast } = useToast();
  const [note, setNote] = useState(noteAsProps)
  const invitationLink: string = `${process.env.NEXT_PUBLIC_APP_URL}/app/note/invite/${note.linkInvitation}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(invitationLink);
    toast({
      title: "Lien d'invitation",
      description: "Le lien d'invitation a été copié dans votre presse-papier",
    });
  };

  const deleteUser = async (userId: string) => {
    try {
      await axios.delete(`/api/note/${note.id}/user/${userId}`);
      toast({
        title: "Utilisateur supprimé",
        description:
          "L'utilisateur a été supprimé de la note et n'aura plus accès à celle-ci.",
      });
      setNote({
        ...note,
        users: note.users.filter((u) => u.id !== userId),
      });
    } catch (e) {
      console.log(`Error deleting user ${userId}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="cursor-pointer p-3">
          <FiShare size={25} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitation à la note</DialogTitle>
          <DialogDescription>
            Ici vous pouvez inviter des personnes, voir qui est déjà invité et
            gérer les droits d&apos;accès.
          </DialogDescription>
          <Separator />
          <Label htmlFor="invite">Lien d&apos;invitation</Label>
          <div className="flex flex-col">
            <div className={"flex items-center"}>
              <Input id="invite" value={invitationLink} disabled />
              <div
                onClick={copyToClipboard}
                className="cursor-pointer p-2 border ml-3 rounded-md"
              >
                <span>Copie</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span>Vos collabotateurs</span>
              <ScrollArea className="flex flex-col h-[250px] w-full rounded-md">
                {note.users.map((user:User) => (
                  <div
                    key={user.id}
                    className="px-3 py-1 my-2 border rounded-md w-full flex items-center justify-between"
                  >
                    <span>{user.name ?? user.email.split("@")[0]}</span>
                    <div className="flex items-center">
                      <div className="flex items-center cursor-pointer p-2 border rounded-md">
                        <span>Rôles</span>
                      </div>
                      <Button
                        disabled={user.id === note.userId}
                        variant={"outline"}
                        onClick={() => deleteUser(user.id)}
                        className="flex items-center p-2 ml-3 "
                      >
                        <AiFillDelete size="20" color="red" />
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
