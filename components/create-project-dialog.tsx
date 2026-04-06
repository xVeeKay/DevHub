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
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'

interface CreateProjectDialogProps {
  trigger?: React.ReactElement // Accepts any custom button element
}

export default function CreateProjectDialog({
  trigger,
}: CreateProjectDialogProps) {
  const router = useRouter()
  // 1. Add the hydration state
  const [isMounted, setIsMounted] = useState(false)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [project, setProject] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [selectedUsers, setSelectedUsers] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  // 2. Set mounted to true once the browser takes over
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(()=>{
    const delay=setTimeout(async()=>{
      if(!search.trim()){
        setResults([]);
        return
      }
      setSearching(true)
      try {
        const res=await fetch(`/api/user/search?q=${search}`)
        const data=await res.json()
        setResults(data)
      } catch (error) {
        console.error(error)
      } finally{
        setSearching(false)
      }
    },400)
    return ()=>clearTimeout(delay)
  },[search])

  function addUser(user:any){
    if(selectedUsers.find(u=> u.id===user.id)) return
    setSelectedUsers(prev=>[...prev,user])
    setSearch("")
    setResults([])
  }

  function removeUser(id:string){
    setSelectedUsers(prev=>prev.filter(u=>u.id!==id))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title,selectedUsers:selectedUsers.map(u=>u.id) }),
      })
      if (!res.ok) throw new Error('Failed to fetch project data!')

      const data = await res.json()
      setProject(data)
      setTitle('')
      router.push(`/projects/${data.id}`)
    } catch (error) {
      console.error('Failed to create project', error)
    } finally {
      setLoading(false)
    }
  }

  const defaultTrigger = (
    <Button
      className="
        group relative w-full flex items-center justify-center gap-2 
        bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-medium
        border border-zinc-800 hover:border-zinc-700 
        shadow-[0_1px_2px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]
        rounded-lg transition-all duration-200 overflow-hidden
        group-data-[collapsible=icon]:aspect-square group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0
      "
    >
      <Plus className="size-4 shrink-0 text-zinc-400 group-hover:text-zinc-100 transition-all duration-300 group-hover:rotate-90" />
      <span className="group-data-[collapsible=icon]:hidden">
        Create Project
      </span>
    </Button>
  )

  const activeTrigger = trigger ? trigger : defaultTrigger

  // 3. Hydration Safety Catch
  // During SSR, we return JUST the button. This prevents ID generation on the server
  // and completely eliminates the hydration mismatch, while keeping the UI visually perfect.
  if (!isMounted) {
    return <>{activeTrigger}</>
  }

  return (
    <Dialog>
      <DialogTrigger render={activeTrigger} />

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Add title of your project here.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4 space-y-5">
            {/* TITLE */}
            <Field>
              <Label htmlFor="project-title">Title</Label>
              <Input
                id="project-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. My Awesome SaaS"
                required
              />
            </Field>

            {/* ADD MEMBERS */}
            <Field className="space-y-2">
              <Label>Add Members</Label>

              <div className="relative">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search teammates..."
                  className="pr-10"
                />

                {searching && (
                  <div className="absolute right-3 top-2.5">
                    <SpinnerCustom />
                  </div>
                )}
              </div>

              {/* SEARCH RESULTS */}
              {results.length > 0 && (
                <div
                  className="
                    mt-2 max-h-40 overflow-y-auto rounded-md
                    border border-zinc-800 bg-zinc-900
                  "
                >
                  {results.map((user) => (
                    <button
                      type="button"
                      key={user.id}
                      onClick={() => addUser(user)}
                      className="
              w-full text-left px-3 py-2
              hover:bg-zinc-800 transition
              text-sm flex justify-between
            "
                    >
                      <span>{user.name}</span>
                      <span className="text-zinc-500 text-xs">
                        {user.email}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* SELECTED USERS */}
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="
              flex items-center gap-2
              bg-zinc-800 text-zinc-200
              px-3 py-1 rounded-full text-sm
            "
                    >
                      {user.name}

                      <button
                        type="button"
                        onClick={() => removeUser(user.id)}
                        className="text-zinc-400 hover:text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
  )
}
