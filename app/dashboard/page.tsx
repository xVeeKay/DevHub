import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function Dashboard(){
    const session=await getServerSession(authOptions)
    const stats=await prisma.$queryRaw<{status:string,count:number}[]>`
        SELECT status, COUNT(*) as count
        from "Task"
        GROUP BY status
    `
    return (
      <div className="p-10">
        <h1>Dashboard Stats</h1>
        <pre>{JSON.stringify(stats, null, 2)}</pre>
      </div>
    )
}