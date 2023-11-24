import { CardFeature } from "@/components/card-feature";
import prismadb from "@/lib/prismadb";
import Image from "next/image";
import { MdOutlineMoneyOffCsred } from "react-icons/md";
export default async function HomePage() {
  const numbersOfUsers = await prismadb.user.count();
  const numbersOfNotes = await prismadb.note.count();

  return (
    <div className="flex flex-col mt-20">
      <div className="flex justify-center">
        <div className="flex flex-col lg:flex-row mx-1 w-[90%] items-center justify-around">
          <h1 className="text-3xl lg:text-5xl text-primary font-bold mb-10 lg:mb-0">
            Collaborate in{" "}
            <span className="bg-primary text-secondary py-1">realtime</span> with your
            team on <span className="underline">shared notes</span>.
          </h1>
          <div className="flex pointsPattern justify-center w-full p-10">
            <Image
              src="/images/co-note-screen.png"
              className=""
              width={600}
              height={500}
              alt="hero"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mt-32">
        <div className="flex items-center">
          <h1 className="text-3xl lg:text-5xl text-primary font-bold mr-2">
            Everythings for{" "}
            <span className="bg-primary text-secondary py-1">free</span>
          </h1>
          <MdOutlineMoneyOffCsred size="80" />
        </div>

        <div className="flex items-center justify-center mt-5">
          <CardFeature />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex items-center pointsPattern p-2 justify-around w-full lg:w-[60%] my-20 font-bold">
          <div className="flex flex-col">
            <h1 className="text-6xl lg:text-8xl bg-primary text-secondary py-1">
              +{numbersOfUsers}
            </h1>
            <span className="text-2xl lg:text-3xl">Users</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-6xl lg:text-8xl bg-primary text-secondary py-1">
              +{numbersOfNotes}
            </h1>
            <span className="text-2xl lg:text-3xl">Notes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
