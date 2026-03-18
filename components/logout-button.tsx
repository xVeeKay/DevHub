'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export function LogoutButton() {
  return (
    <DropdownMenuItem
      onClick={() => signOut({ callbackUrl: '/signin' })} // Add your desired redirect path here
      className="gap-2 px-2 py-2 cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-950/30 focus:bg-red-950/30 rounded-lg transition-colors"
    >
      <LogOut className="size-4" />
      <span>Log out</span>
    </DropdownMenuItem>
  )
}
