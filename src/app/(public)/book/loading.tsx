import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Skeleton */}
      <div className="h-16 border-b border-slate-200 bg-white/95 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-6 w-36 rounded-md" />
        </div>
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>

      {/* Progress Bar Skeleton */}
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 pt-3 pb-3">
        <div className="flex justify-between mb-2">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      {/* Main Wizard Content Skeleton */}
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 sm:px-6 py-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
          <div className="space-y-3 pt-2">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        </div>
      </main>
    </div>
  );
}
