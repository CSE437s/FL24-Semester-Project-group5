import { SHA256 as sha256 } from "crypto-js";
// We impot our prisma client
import { prisma } from "../../../../../prisma";
// Prisma will help handle and catch errors
import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
export async function POST (req: NextApiRequest, res: NextApiResponse) {
  console.log(req.method)
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
  console.log(email, password)
  if (password.length < 6) {
    errors.push("password length should be more than 6 characters");
    // return Response.json({ error: errors }, { status: 400 });
  }
  const user = await prisma.user.create({
    data: { ...req.body, password: hashPassword(req.body.password) },
  });
  // return Response.json({ user }, { status: 201 });
}