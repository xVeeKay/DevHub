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
    const {selectedUsers}=body
    const project=await prisma.project.create({
        data:{
            title:body.title,
            ownerId:session.user.id,
            members:{
                create:[
                    {
                        userId:session.user.id,
                        role:"OWNER"
                    },
                    ...selectedUsers.map((id:any)=>({
                        userId:id,
                        role:"MEMBER"
                    }))
                ]
            }
        }
    })
    return NextResponse.json(project)
}