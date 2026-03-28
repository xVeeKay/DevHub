'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { SpinnerCustom } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2Icon, AlertCircleIcon, Code2 } from 'lucide-react'
import Image from "next/image"

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  type ErrorState = {
    title: string
    description: string
    type: 'default' | 'destructive' | null | undefined
    show: boolean
  }

  const [error, setError] = useState<ErrorState>({
    title: 'Error',
    description: 'Error while signup!',
    type: 'default',
    show: false,
  })

  async function handleSubmit(e: any) {
    e.preventDefault()
    setLoading(true)
    setError({ ...error, show: false }) // Hide previous errors on new submission

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (res.ok) {
        setError({
          title: 'Check your email',
          description:
            data.message || 'A reset link has been sent to your email address.',
          type: 'default',
          show: true,
        })
        setEmail('') // Clear input on success
      } else {
        setError({
          title: 'Error',
          description:
            data.message || 'Something went wrong. Please try again.',
          type: 'destructive',
          show: true,
        })
      }
    } catch (error) {
      console.error(error)
      setError({
        title: 'Server Error',
        description: 'Unable to connect to the server. Please try again later.',
        type: 'destructive',
        show: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 font-sans">
      {/* DevHub Brand Header */}
      <div className="flex items-center justify-center gap-2 mb-8 text-zinc-100">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-secondary text-primary-foreground">
            <Image
              className="bg-transparent"
              src={'/logo(transparent).png'}
              alt="DevHub Logo"
              width={52}
              height={52}
            />
          </div>
          DevHub
        </a>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[400px] bg-card border border-border/40 rounded-2xl shadow-2xl p-6 sm:p-8">
        {/* Card Header */}
        <div className="flex flex-col items-center space-y-2 mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we'll send you a link to reset your password
          </p>
        </div>

        {/* Status Alert */}
        {error.show && (
          <Alert variant={error.type} className="mb-6 bg-background/50">
            {error.type === 'default' ? (
              <CheckCircle2Icon className="size-4 text-green-500" />
            ) : (
              <AlertCircleIcon className="size-4 text-red-500" />
            )}
            <AlertTitle className="font-medium">{error.title}</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              {error.description}
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-[13px] font-medium text-card-foreground"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="m@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-[14px] text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            // Note: 'bg-primary' will pull from your global.css.
            // If your primary is not red, replace 'bg-primary hover:bg-primary/90'
            // with 'bg-red-500 hover:bg-red-600' to perfectly match the image.
            className="flex w-full items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <SpinnerCustom />
                <span>Sending...</span>
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-6 text-center text-[13px]">
          <span className="text-muted-foreground">
            Remember your password?{' '}
          </span>
          <Link
            href="/signin"
            className="text-card-foreground hover:underline underline-offset-4 transition-all"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
