import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try {
        const { token, password } = await req.json()
        const user = await prisma.user.findFirst({
          where: {
            resetToken: token,
            resetTokenExpiry: {
              gt: new Date(),
            },
          },
        })
        if (!user) {
          return NextResponse.json({ message: 'Invalid User' }, { status: 401 })
        }
        const hashed = await bcrypt.hash(password, 10)
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            password: hashed,
            resetToken: null,
            resetTokenExpiry: null,
          },
        })
        return NextResponse.json(
          { message: 'Resetting successfull' },
          { status: 200 }
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"Server error while resetting password"},{status:500})
    }
}