import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs"

export const authOptions:AuthOptions={
    providers:[
        Credentials({
            name:"credentials",
            credentials:{
                email:{},
                password:{},
            },
            async authorize(credentials:any){
                const user=await prisma.user.findUnique({where:{email:credentials.email}})
                if(!user) return null;
                const isValid=await bcrypt.compare(credentials.password,user.password)
                if(!isValid) return null
                return {
                    id:user.id,
                    email:user.email,
                    name:user.name,
                }
            }
        })
    ],
    session:{
        strategy:"jwt",
    },
    secret:process.env.NEXTAUTH_SECRET
}