"use client";

import { Note } from "@prisma/client";
import InvitationDialog from "./dialog/invitation-dialog";
import DropdownOptionsNote from "./dropdown-options-note";

export default function NavNoteButtons({ note }: { note: Note }) {
  return (
    <div className="flex items-center">
      <div className="mx-2">
        <InvitationDialog />
      </div>
      <div className="mx-2">
        <DropdownOptionsNote note={note} />
      </div>
    </div>
  );
}
