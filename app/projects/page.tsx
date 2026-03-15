'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { SpinnerCustom } from '@/components/ui/spinner'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProjectsPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [project,setProject]=useState<any>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return // Prevent empty submissions

    setLoading(true)

    try {
      const res=await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      })
      if(!res.ok) throw new Error("Failed to fetch project data!")
      const data=await res.json()
      setProject(data)
      setTitle('') // Clear input on success
      router.push(`/projects/${data.id}`) 
    } catch (error) {
      console.error('Failed to create project', error)
    } finally {
      setLoading(false)
      // Note: You will need to handle closing the dialog state here programmatically
      // if you aren't using an internal Dialog state or DialogClose component.
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center flex-col">
      <h1 className="text-muted-foreground text-4xl p-2">Welcome to DevHub!</h1>
      <p className="text-muted-foreground p-2">
        Select a project from sidebar or create new.
      </p>

      <Dialog>
        <DialogTrigger
          render={
            <Button variant="outline" className="p-2">
              Create Project
            </Button>
          }
        />
        <DialogContent className="sm:max-w-sm">
          {/* Move the form INSIDE the DialogContent */}
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>
                Add title of your project here.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup className="py-4">
              <Field>
                <Label htmlFor="name-1">Title</Label>
                <Input
                  id="name-1"
                  name="name"
                  value={title} // Changed to controlled input
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. My Awesome SaaS"
                  required
                />
              </Field>
            </FieldGroup>

            <DialogFooter>
              <DialogClose
                render={
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                }
              />
              <Button type="submit" disabled={loading}>
                {loading && <SpinnerCustom />}
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
