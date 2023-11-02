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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BsBorderStyle } from "react-icons/bs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { Note, Preference, User } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { Button } from "../ui/button";

import { fonts } from "@/lib/font";
import { cn } from "@/lib/utils";
import { useToast } from "../ui/use-toast";

interface NoteWithUsers {
  note: Note & {
    users: User[];
    preference: Preference | null;
  };
}

export default function PersonalizationDialog({ note }: NoteWithUsers) {
  // todo : color doesn't work
  const { toast } = useToast();

  const [color, setColor] = useState<string>(
    note.preference?.colorBg ?? "#ffffff"
  );
  const [fontFamily, setFontFamily] = useState<string>(
    note.preference?.font ?? ""
  );

  const selectedFont = fonts.find(
    (font) => font.name === note.preference?.font
  )?.name;

  const onSubmit = async () => {
    try {
      await axios.put(`/api/note/${note.id}/preference`, {
        colorBg: color,
        font: fontFamily,
      });
      toast({
        title: "Note mise à jour",
        description:
          "Les informations concernant la couleur et la police ont été mises à jour.",
      });
    } catch (e) {
      console.log(`Error during update note (font, color) : ${e}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex items-center hover:bg-primary/10 p-3 cursor-pointer ">
          <BsBorderStyle size={25} />
          <span className="ml-3 font-semibold">Personnalisation</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Personnalisation de la note</DialogTitle>
          <DialogDescription>
            Personnalisez votre note en changeant la couleur de fond, la police
            d&apos;écriture etc.
            <br />
            Ces changements ne seront visibles que sur cette note.
          </DialogDescription>

          <Label className="text-lg pt-3" htmlFor="color">
            Couleur du fond de la note
          </Label>
          <Input
            onChange={(e) => setColor(e.target.value)}
            type="color"
            id="color"
            defaultValue={note.preference?.colorBg ?? "#ffffff"}
          />
          <Label className="text-lg pt-3" htmlFor="font">
            Police d&apos;écriture
          </Label>

          <Select onValueChange={(e: any) => setFontFamily(e)}>
            <SelectTrigger className={cn(`font-${selectedFont}`, "w-[180px]")}>
              <SelectValue
                placeholder={note.preference?.font ? "Bonjour !" : "Police"}
              />
            </SelectTrigger>
            {/* Cannot map because tailwind canno't take css with variable*/}
            <SelectContent>
              <SelectItem value={"Pixel"}>
                <span className={`font-Pixel`}>Bonjour !</span>
              </SelectItem>

              <SelectItem value="Cholten">
                <span className={`font-Cholten`}>Bonjour !</span>
              </SelectItem>

              <SelectItem value="NaturalPrecision">
                <span className={`font-NaturalPrecision`}>Bonjour !</span>
              </SelectItem>

              <SelectItem value="Oserif">
                <span className={`font-Oserif`}>Bonjour !</span>
              </SelectItem>

              <SelectItem value="Reiswar">
                <span className={`font-Reiswar`}>Bonjour !</span>
              </SelectItem>
              <SelectItem value="RokunaAlenthush">
                <span className={`font-RokunaAlenthush`}>Bonjour !</span>
              </SelectItem>
              <SelectItem value="RukishytrialRegular">
                <span className={`font-RukishytrialRegular`}>Bonjour !</span>
              </SelectItem>
              <SelectItem value="SnowyChrista">
                <span className={`font-SnowyChrista`}>Bonjour !</span>
              </SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={onSubmit} variant={"purple"}>
              Enregistré
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
