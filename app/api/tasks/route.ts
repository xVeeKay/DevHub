import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    const body=await req.json()
    const task = await prisma.task.create({
      data: {
        title: body.title,
        projectId: body.projectId,
        assignedTo:body.assignedTo
      },
    })
    return NextResponse.json(task)
}