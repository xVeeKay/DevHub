'use client'

import { MoreVertical, Eye, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition,useState } from 'react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SpinnerCustom } from './ui/spinner'

export const ProjectActions = ({ projectId }: { projectId: string }) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/projects/${projectId}`)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDeleting(true)
    startTransition(async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`, {
          method: 'DELETE',
        })

        const data = await res.json()

        if (!res.ok){
            toast.error("Error while deleting!")
            return
        }

        toast.success('Project deleted')

        router.refresh()
      } catch (err) {
        toast.error('Delete failed')
      }finally{
        setIsDeleting(false)
      }
    })
  }

  return (
    <DropdownMenu>
      {/* Removed `asChild`. The trigger itself now acts as the button. 
        All colors here map directly to your globals.css (muted-foreground, primary, etc.)
      */}
      <DropdownMenuTrigger
        onClick={(e) => e.preventDefault()}
        className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted/80 hover:text-foreground data-[state=open]:bg-muted/80 data-[state=open]:text-foreground opacity-0 group-hover:opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 relative z-10"
      >
        <MoreVertical className="size-4" />
      </DropdownMenuTrigger>

      {/* Swapped hardcoded RGBA shadow for a dynamic primary shadow tied to your global theme */}
      <DropdownMenuContent
        align="end"
        className="w-44 border border-border/40 bg-card/60 backdrop-blur-xl shadow-lg shadow-primary/10 rounded-xl p-1.5"
      >
        <DropdownMenuItem
          onClick={handleView}
          className="cursor-pointer group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground focus:bg-primary/10 focus:text-primary transition-colors duration-200"
        >
          <Eye className="size-4 transition-colors group-focus:text-primary" />
          <span className="font-medium">View</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-border/40" />

        {/* Swapped raw red-500 for the 'destructive' CSS variable from globals.css */}
        <DropdownMenuItem
          onClick={handleDelete}
          className="cursor-pointer group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-destructive/80 focus:text-destructive focus:bg-destructive/10 transition-colors duration-200"
        >
          {isDeleting ? (
            <SpinnerCustom/>
          ) : (
            <Trash className="size-4 transition-colors group-focus:text-destructive" />
          )}
          <span className="font-medium">
            {isDeleting ? 'Deleting...' : 'Delete Project'}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
