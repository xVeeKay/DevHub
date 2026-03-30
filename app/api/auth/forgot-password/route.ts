import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from 'crypto'
import { sendEmail } from "@/lib/email";

export async function POST(req:Request){
    try {
        const { email } = await req.json()
        const user = await prisma.user.findUnique({
          where: { email },
        })
        if (!user) {
          return NextResponse.json(
            { message: 'Invalid email!' },
            { status: 400 }
          )
        }
        const token = crypto.randomBytes(32).toString('hex')
        const expiry = new Date(Date.now() + 1000 * 60 * 15)

        await prisma.user.update({
          where: { email },
          data: {
            resetToken: token,
            resetTokenExpiry: expiry,
          },
        })
        const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
        await sendEmail({
          to: user.email,
          subject: 'Reset your password',
          html: `
                <h2>Reset Password</h2>
                <p>Click below to reset password:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>This link expires in 15 minutes.</p>
            `,
        })
        return NextResponse.json(
          { message: 'Reset link sent successfully' },
          { status: 200 }
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
          { message: 'Error while resetting password' },
          { status: 500 }
        )
    }
}