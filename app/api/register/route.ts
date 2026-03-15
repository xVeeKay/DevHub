import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"

export async function POST(req:Request){
    const body=await req.json()
    if (!body.email || !body.password || !body.name) {
        return NextResponse.json(
            { error: "All fields are required" },
            { status: 400 }
        );
    }
    const existingUser = await prisma.user.findUnique({
        where: { email: body.email },
    });

    if (existingUser) {
        return NextResponse.json(
            { error: "User already exists" },
            { status: 400 }
        );
    }
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