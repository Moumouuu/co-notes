"use client";

import { Note, Preference, User } from "@prisma/client";
import InvitationDialog from "./dialog/invitation-dialog";
import DropdownOptionsNote from "./dropdown-options-note";

interface Props {
  note: Note & {
    users: User[];
    preference: Preference | null;
  };
  isOwner: boolean;
}
export default function NavNoteButtons({ note, isOwner }: Props) {
  return (
    <div className="flex items-center">
      <div className="mx-2">
        <InvitationDialog note={note} isOwner={isOwner} />
      </div>
      <div className="mx-2">
        <DropdownOptionsNote note={note} isOwner={isOwner} />
      </div>
    </div>
  );
}
