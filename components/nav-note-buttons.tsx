"use client";

import { Note, User } from "@prisma/client";
import InvitationDialog from "./dialog/invitation-dialog";
import DropdownOptionsNote from "./dropdown-options-note";

interface Props {
  note: Note & {
    users: User[];
  };
}
export default function NavNoteButtons({ note }: Props) {
  return (
    <div className="flex items-center">
      <div className="mx-2">
        <InvitationDialog note={note} />
      </div>
      <div className="mx-2">
        <DropdownOptionsNote note={note} />
      </div>
    </div>
  );
}
