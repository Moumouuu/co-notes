"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FiShare } from "react-icons/fi";

export default function InvitationDialog() {
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
          {/*TODO */}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
