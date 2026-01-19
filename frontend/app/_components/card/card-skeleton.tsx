import React from 'react'

export function CardSkeleton() {
  return (
    <article className="bg-neutral-0 flex max-h-68 min-h-68 w-full max-w-97.5 flex-col justify-between rounded-[12px] shadow-sm md:max-w-84.5 md:min-w-84.5 dark:bg-neutral-800">
      <div className="p-4">
        <div className="motion-safe:animate-pulse motion-reduce:animate-none">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="h-11 w-11 rounded-xl border border-neutral-100 bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-700" />

              <div className="ml-3 flex flex-col gap-2">
                <div className="h-4 w-40 rounded bg-neutral-100 dark:bg-neutral-700" />
                <div className="h-3 w-28 rounded bg-neutral-100 dark:bg-neutral-700" />
              </div>
            </div>

            <div className="h-8 w-8 rounded-md bg-neutral-100 dark:bg-neutral-700" />
          </div>

          <div className="my-4 h-px w-full bg-neutral-300 dark:bg-neutral-500" />

          <div className="flex flex-col gap-2">
            <div className="h-3 w-full rounded bg-neutral-100 dark:bg-neutral-700" />
            <div className="h-3 w-[92%] rounded bg-neutral-100 dark:bg-neutral-700" />
            <div className="h-3 w-[80%] rounded bg-neutral-100 dark:bg-neutral-700" />
            <div className="h-3 w-[65%] rounded bg-neutral-100 dark:bg-neutral-700" />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="h-5 w-14 rounded-sm bg-neutral-100 dark:bg-neutral-700" />
            <div className="h-5 w-16 rounded-sm bg-neutral-100 dark:bg-neutral-700" />
            <div className="h-5 w-12 rounded-sm bg-neutral-100 dark:bg-neutral-700" />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col">
        <div className="h-px w-full bg-neutral-300 dark:bg-neutral-500" />
        <div className="relative flex items-center gap-4 px-4 py-3 motion-safe:animate-pulse motion-reduce:animate-none">
          <div className="h-4 w-10 rounded bg-neutral-100 dark:bg-neutral-700" />
          <div className="h-4 w-14 rounded bg-neutral-100 dark:bg-neutral-700" />
          <div className="h-4 w-12 rounded bg-neutral-100 dark:bg-neutral-700" />

          <div className="absolute right-4 h-4 w-4 rounded bg-neutral-100 dark:bg-neutral-700" />
        </div>
      </div>
    </article>
  )
}
