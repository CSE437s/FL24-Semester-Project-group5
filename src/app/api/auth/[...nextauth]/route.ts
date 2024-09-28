import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../../../prisma.js";
import { NextRequest, NextResponse } from "next/server.js";
import { NextApiRequest, NextApiResponse } from "next";

const options: NextAuthOptions = {
  providers: [
    // @ts-ignore
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        const userCredentials = {
          email: credentials.email,
          password: credentials.password,
        };

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/user/login`,
          {
            method: "POST",
            body: JSON.stringify(userCredentials),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const user = await res.json();

        if (res.ok && user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],

  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 24 * 30,
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },

  callbacks: {
    async session({ session, user }: { session: Session; user?: User }) {
      if (user !== null) {
        
        session.user = user;
      }
      return await session;
    },

    async jwt({ token, user }: any) {
       return await token;
    },
  },
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
