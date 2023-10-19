import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";

export async function getUser() {
  const session = await getServerSession(authOptions);

  if (!session) return;

  if (!session?.user?.email) return;

  const userEmail = session.user.email;

  const user = await prismadb.user.findFirst({
    where: {
      email: userEmail,
    },
  });

  // account create with google auth => need to create user
  if (!user) {
    const newUser = await prismadb.user.create({
      data: {
        email: userEmail,
        name: session.user.name,
        image: session.user.image,
      },
    });
    return newUser;
  }

  return user;
}
