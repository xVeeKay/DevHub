import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

type SendEmailParams = {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    await resend.emails.send({
      from: 'DevHub <onboarding@resend.dev>',
      to,
      subject,
      html,
    })
  } catch (error) {
    console.error('Email failed:', error)
    throw new Error('Email sending failed')
  }
}
