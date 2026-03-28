'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { SpinnerCustom } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2Icon, AlertCircleIcon, Code2 } from 'lucide-react'
import Image from 'next/image'

// The inner form component that uses useSearchParams
function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const params = useSearchParams()
  const token = params.get('token')

  type ErrorState = {
    title: string
    description: string
    type: 'default' | 'destructive' | null | undefined
    show: boolean
  }

  const [error, setError] = useState<ErrorState>({
    title: '',
    description: '',
    type: 'default',
    show: false,
  })

  async function handleSubmit(e: any) {
    e.preventDefault()

    if (!token) {
      setError({
        title: 'Missing Token',
        description: 'Reset token is missing from the URL.',
        type: 'destructive',
        show: true,
      })
      return
    }

    setLoading(true)
    setError({ ...error, show: false }) // Hide previous errors

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, token }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setError({
          title: 'Success',
          description: 'Password updated successfully. You can now sign in.',
          type: 'default',
          show: true,
        })
        setPassword('') // Clear password field on success
      } else {
        // FIXED: Set type to 'destructive' instead of 'default'
        setError({
          title: 'Error',
          description:
            data.message ||
            'Failed to reset password. The link might be expired.',
          type: 'destructive',
          show: true,
        })
      }
    } catch (error) {
      console.error('Error while resetting password ', error)
      setError({
        title: 'Server Error',
        description: 'Unable to connect. Please try again later.',
        type: 'destructive', // FIXED
        show: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[400px] bg-card border border-border/40 rounded-2xl shadow-2xl p-6 sm:p-8">
      {/* Card Header */}
      <div className="flex flex-col items-center space-y-2 mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
          Set new password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below to regain access to your account.
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
            htmlFor="password"
            className="text-[13px] font-medium text-card-foreground"
          >
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-[14px] text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !token}
          className="flex w-full items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <SpinnerCustom/>
              <span>Updating...</span>
            </div>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>

      {/* Back to Sign In (especially useful after successful reset) */}
      <div className="mt-6 text-center text-[13px]">
        <Link
          href="/signin"
          className="text-muted-foreground hover:text-card-foreground hover:underline underline-offset-4 transition-all"
        >
          Return to Sign In
        </Link>
      </div>
    </div>
  )
}

// Main page export wrapped in Suspense
export default function ResetPassword() {
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

      <Suspense
        fallback={
          <div className="flex items-center justify-center p-8">
            <SpinnerCustom />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
