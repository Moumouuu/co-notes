import prismadb from "@/lib/prismadb";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response("Email or password needed", { status: 400 });
  }

  const user = await prismadb.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user) {
    return new Response("Email already exists", { status: 400 });
  }

  const newUser = await prismadb.user.create({
    data: {
      email: email,
      password: bcrypt.hashSync(password, 10),
    },
  });

  if (!newUser) {
    return new Response("Error creating user", { status: 500 });
  }

  return new Response("User created", { status: 200 });
}
