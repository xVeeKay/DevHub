import React from 'react'

export default function Loading() {
  return (
    // The container fills the remaining space below your layout's header and to the right of your sidebar
    <div className="flex-1 flex flex-col h-full w-full bg-background overflow-hidden min-w-0">
      
      {/* 1. Page Title Area */}
      <div className="px-8 py-8 flex items-center gap-4 shrink-0">
        <div className="h-8 w-80 rounded-lg bg-muted animate-pulse" />
        <div className="h-6 w-16 rounded-full bg-muted/40 animate-pulse" />
      </div>

      {/* 2. Kanban Board Area */}
      <div className="flex-1 overflow-auto px-8 pb-8">
        <div className="flex gap-6 h-full items-start">
          {/* Render 3 Skeleton Columns */}
          {[1, 2, 3].map((colIndex) => (
            <div key={colIndex} className="w-[320px] shrink-0 flex flex-col gap-4">
              {/* Column Header */}
              <div className="flex items-center gap-2 mb-2">
                <div className="h-4 w-4 rounded-full bg-muted animate-pulse" />
                <div className="h-4 w-20 rounded bg-muted/60 animate-pulse" />
                <div className="h-4 w-6 rounded bg-muted/40 animate-pulse ml-2" />
              </div>

              {/* Column Cards (2 skeleton cards per column) */}
              {[1, 2].map((cardIndex) => (
                <div 
                  key={cardIndex} 
                  className="bg-card border border-border/50 rounded-xl p-4 flex flex-col gap-6"
                >
                  {/* Card Title */}
                  <div className="flex items-start gap-3">
                    <div className="h-4 w-4 rounded-full bg-muted/60 animate-pulse shrink-0 mt-0.5" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-full rounded bg-muted/60 animate-pulse" />
                      <div className="h-4 w-2/3 rounded bg-muted/40 animate-pulse" />
                    </div>
                  </div>
                  
                  {/* Card Footer (Icons & Avatar) */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex gap-3">
                      <div className="h-4 w-8 rounded bg-muted/40 animate-pulse" />
                      <div className="h-4 w-4 rounded bg-muted/40 animate-pulse" />
                    </div>
                    <div className="h-6 w-6 rounded-full bg-muted animate-pulse" />
                  </div>
                </div>
              ))}

              {/* New Task Button Placeholder */}
              <div className="flex items-center gap-2 mt-2 px-2">
                <div className="h-3 w-3 rounded bg-muted/40 animate-pulse" />
                <div className="h-3 w-16 rounded bg-muted/40 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}