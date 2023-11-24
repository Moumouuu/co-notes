import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

const feature = [
  {
    title: "Share notes with the world !",
    description: "Manage access rights to your notes.",
  },
  {
    title: "Custom your notes",
    description: "Change background & font to have fun.",
  },
  {
    title: "Be a creator",
    description: "You can set your note as TEMPLATE to share it with others.",
  },
];

type CardProps = React.ComponentProps<typeof Card>;

export function CardFeature({ className, ...props }: CardProps) {
  return (
    <Card className={cn("w-[380px]", className)} {...props}>
      <CardHeader>
        <CardTitle className="text-2xl">Features</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          {feature.map((notification, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-xl font-medium leading-none">
                  {notification.title}
                </p>
                <p className="text-md text-muted-foreground">
                  {notification.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant={"purple"} className="w-full" asChild>
          <Link href="/app">Try it now !</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
