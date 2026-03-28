import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from 'crypto'

export async function POST(req:Request){
    const {email}=await req.json()
    const user=await prisma.user.findUnique({
        where:{email}
    })
    if(!user){
        return NextResponse.json({message:"Invalid email!"},{status:400})
    }
    const token=crypto.randomBytes(32).toString("hex")
    const expiry=new Date(Date.now()+1000*60*15)

    await prisma.user.update({
        where:{email},
        data:{
            resetToken:token,
            resetTokenExpiry:expiry
        }
    })
    const resetLink=`${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
    console.log("Reset link:", resetLink)
    return NextResponse.json({message:"Reset link sent successfully"},{status:200})
}