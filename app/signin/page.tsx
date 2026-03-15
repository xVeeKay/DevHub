import Image from "next/image"

import { LoginForm } from '@/components/auth/signin-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
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
        <LoginForm />
      </div>
    </div>
  )
}
