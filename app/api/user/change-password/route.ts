import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {prisma} from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req:Request){
    try {
        const session=await getServerSession(authOptions)
        if(!session?.user?.email){
            return NextResponse.json({message:"Unauthorized"},{status:401})
        }
        const {newPassword,currentPassword,confirmPassword}=await req.json()
        if (!currentPassword || !newPassword || !confirmPassword) {
          return NextResponse.json(
            { message: 'All fields required' },
            { status: 400 }
          )
        }
        if (newPassword !== confirmPassword) {
          return NextResponse.json(
            { message: 'Passwords do not match' },
            { status: 400 }
          )
        }
        const user=await prisma.user.findUnique({
            where:{email:session.user.email}
        })
        if (!user || !user.password) {
          return NextResponse.json(
            { message: 'User not found' },
            { status: 404 }
          )
        }
        const isValid=await bcrypt.compare(currentPassword,user.password)
        if(!isValid){
            return NextResponse.json({message:"Current password is incorrect"},{status:401})
        }
        const hashedPassword=await bcrypt.hash(newPassword,10)
        await prisma.user.update({
            where:{email:session.user.email},
            data:{password:hashedPassword}
        })
        return NextResponse.json({message:"Password updated successfully"})
    } catch (error) {
        console.error("Error while resetting password")
        return NextResponse.json({message:"Server error"},{status:500})
    }
}