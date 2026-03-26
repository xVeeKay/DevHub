'use client'

import React, { useState, useEffect } from 'react'
import { ResetPassword } from '@/components/ResetPassword'
import { Mail, ArrowLeft, LogOut } from 'lucide-react'
import { SpinnerCustom } from '@/components/ui/spinner'
import { updateProfile } from './actions'
import { toast } from 'sonner'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <SpinnerCustom />
      </div>
    )
  }

  const [firstName = '', lastName = ''] = session?.user?.name?.split(' ') ?? []
  const email = session?.user?.email ?? ''

  const handleInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      await updateProfile(formData)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/signin')
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased selection:bg-primary selection:text-primary-foreground">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top Navigation Header */}
        <header className="flex items-center justify-between pb-6 border-b border-border">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </header>

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Manage your personal information and workspace preferences.
          </p>
        </div>

        {/* Personal Info Card */}
        <div className="bg-card text-card-foreground border border-border rounded-xl overflow-hidden shadow-sm transition-all">
          <div className="p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-base font-semibold text-foreground">
                Profile Information
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                This information will be displayed publicly across the platform.
              </p>
            </div>

            <form
              id="profile-form"
              className="space-y-5 max-w-2xl"
              onSubmit={handleInfoSubmit}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-foreground"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    defaultValue={firstName}
                    required
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-foreground"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    defaultValue={lastName}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5 transition-colors group-hover:text-foreground" />
                  <input
                    type="email"
                    disabled
                    defaultValue={email}
                    className="w-full bg-muted border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Card Footer */}
          <div className="px-6 md:px-8 py-4 bg-muted/50 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground hidden sm:block">
              Please contact support to change your email address.
            </p>
            <button
              form="profile-form"
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <SpinnerCustom />
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>

        {/* Modular Password Component Container */}
        {/* <div className="bg-card text-card-foreground border border-border rounded-xl overflow-hidden shadow-sm p-6 md:p-8">
          
        </div> */}
        <ResetPassword />
      </div>
    </div>
  )
}
