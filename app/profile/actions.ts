"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function updateProfile(formData:FormData){
    const session=await getServerSession(authOptions)
    if(!session?.user?.email){
        throw new Error("Unauthorized")
    }
    const firstName=formData.get("firstName") as string
    const lastName=formData.get("lastName") as string
    const fullName=`${firstName} ${lastName}`.trim()
    await prisma.user.update({
        where:{
            email:session.user.email
        },
        data:{
            name:fullName
        }
    })
    return {success:true}
}