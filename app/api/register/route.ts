import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"

export async function POST(req:Request){
    const body=await req.json()
    const hashedPassword=await bcrypt.hash(body.password,10)
    const user=await prisma.user.create({
        data:{
            email:body.email,
            password:hashedPassword,
            name:body.name,
        },
    })
    return NextResponse.json(user)
}