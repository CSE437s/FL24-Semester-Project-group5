import { SHA256 as sha256 } from "crypto-js";
// We impot our prisma client
import { prisma } from "../../../../../prisma";
// Prisma will help handle and catch errors
import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
export async function POST (req: NextApiRequest, res: NextApiResponse) {
   await createUserHandler(req, res);
   return new Response('Worked!');
}

// We hash the user entered password using crypto.js
export const hashPassword = (string) => {
  return sha256(string).toString();
};
// function to create user in our database
async function createUserHandler(req, res) {
  let errors = [];
  const body = await req.json()
  const { email, password } = body;
  console.log(body)
  console.log(hashPassword(password))
  if (password.length < 6) {
    errors.push("password length should be more than 6 characters");
    return new Response(errors[0], { status: 400})
  }
  const user = await prisma.user.create({
    data: { email, password: hashPassword(password) },
  });
  if (!user) {
    return new Response("Error, user exists", { status: 400})
  }
  return new Response("Success, user created", { status: 200})
}