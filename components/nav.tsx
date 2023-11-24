import Image from "next/image";
import Link from "next/link";
import ModeToggle from "./toggle-theme";
import { Button } from "./ui/button";

export default function Nav() {
  return (
    <div className="flex items-center justify-between w-full h-20 sticky top-0 p-2 backdrop-blur">
      <div className="flex items-center">
        <Image
          src="/images/co-notes-logo.png"
          width={70}
          height={70}
          alt="logo co-notes"
          className="rounded-lg mr-3"
        />
        <h1 className="font-extrabold text-2xl lg:text-3xl bg-clip-text  text-transparent bg-gradient-to-r from-purple-500 via-purple-800 to-purple-600">
          Co-Notes
        </h1>
      </div>
      <div className="flex items-center">
        <ModeToggle />
        <Button variant={"purple"} asChild className="ml-2">
          <Link href="/app">Try it now !</Link>
        </Button>
      </div>
    </div>
  );
}
