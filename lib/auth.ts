import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials: any) {
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
          user.password!
        )
        if (!isValid) return null
        console.log('Password matched')
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
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({user,account}){
      if(account?.provider==="google"){
        const existingUser=await prisma.user.findUnique({
          where:{email:user.email!}
        })
        if (existingUser) {
          user.id = existingUser.id
          return true
        }
        if(!existingUser){
          await prisma.user.create({
            data:{
              email:user.email!,
              name:user.name
            }
          })
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}