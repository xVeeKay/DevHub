import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    const body=await req.json()
    const project=await prisma.project.create({
        data:{
            title:body.title,
            ownerId:body.ownerId
        }
    })
    return NextResponse.json(project)
}