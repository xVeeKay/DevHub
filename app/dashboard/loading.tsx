import React from 'react'

export default function DashboardLoading() {
  return (
    // Max-width container to match your dashboard's padding and alignment
    <div className="w-full max-w-7xl mx-auto p-6 md:p-8 space-y-8">
      {/* 1. Header & Actions Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* Welcome Text */}
        <div className="space-y-3">
          <div className="h-8 w-64 sm:w-80 rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-72 sm:w-96 rounded-md bg-muted/40 animate-pulse" />
        </div>

        {/* Search & New Project Button */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Search Input Skeleton */}
          <div className="h-10 w-full md:w-64 rounded-lg bg-muted/20 border border-border/40 animate-pulse" />
          {/* Primary Button Skeleton */}
          <div className="h-10 w-32 rounded-lg bg-muted/60 animate-pulse shrink-0" />
        </div>
      </div>

      {/* 2. Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* "Create New Project" Dashed Card Skeleton */}
        <div className="h-[180px] rounded-2xl border border-dashed border-border/60 bg-muted/5 flex flex-col items-center justify-center gap-4 animate-pulse">
          <div className="h-10 w-10 rounded-full bg-muted/40" />
          <div className="h-4 w-32 rounded bg-muted/40" />
        </div>

        {/* Render 5 Standard Project Card Skeletons */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-[180px] rounded-2xl border border-border/40 bg-card p-6 flex flex-col"
          >
            {/* Card Header: Icon + Title + Tasks */}
            <div className="flex items-start gap-4">
              {/* Folder Icon Placeholder */}
              <div className="h-11 w-11 rounded-xl bg-muted/40 animate-pulse shrink-0" />

              {/* Title & Subtitle */}
              <div className="space-y-2.5 w-full mt-1">
                <div className="h-5 w-3/4 rounded-md bg-muted animate-pulse" />
                <div className="h-3 w-1/3 rounded-md bg-muted/40 animate-pulse" />
              </div>
            </div>

            {/* Card Footer: Last Updated */}
            <div className="mt-auto pt-5 border-t border-border/30 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-muted/40 animate-pulse" />
              <div className="h-3 w-32 rounded bg-muted/40 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
