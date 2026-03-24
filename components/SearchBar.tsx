'use client'
import { Search, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { SpinnerCustom } from './ui/spinner'

const SearchBar = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    startTransition(() => {
      router.replace(`/dashboard?${params.toString()}`)
    })
  }, 400)

  return (
    <div className="w-full md:w-auto shrink-0">
      <div className="relative group w-full md:w-[320px]">
        {/* Search Icon: Smoothly brightens when the input is focused */}
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200 z-10 pointer-events-none" />

        <input
          placeholder="Search projects..."
          defaultValue={searchParams.get('q') ?? ''}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-10 w-full rounded-full border border-border/40 bg-background/50 backdrop-blur-md pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none shadow-none transition-all duration-200"
        />

        {/* Minimalist Theme-Aware Spinner */}
        {isPending && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            <SpinnerCustom/>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar
