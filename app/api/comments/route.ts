import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req:Request){
    const session=await getServerSession(authOptions)
    if(!session){
        return NextResponse.json({error:"Unauthorized"},{status:401})
    }
    const body=await req.json()
    const comment=await prisma.comment.create({
        data:{
            content:body.content,
            taskId:body.taskId,
            userId:body.userId
        }
    })
    return NextResponse.json(comment)
}