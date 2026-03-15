import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials:any) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email?.toLowerCase(),
          },
        })
        if (!user) {
          console.log('User not found')
          return null
        }
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )
        if (!isValid) return null
        console.log("Password matched")
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge:30*24*60*60
  },
  callbacks:{
    async jwt({token,user}){
        if(user){
            token.id=user.id
        }
        return token
    },
    async session({session,token}){
        if(session.user){
            session.user.id=token.id as string
        }
        return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}