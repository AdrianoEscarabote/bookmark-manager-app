import clsx from 'clsx'
import React from 'react'

type TagSkeletonProps = {
  className?: string
  labelWidthClassName?: string
  showCount?: boolean
}

export default function TagSkeleton({
  className,
  labelWidthClassName = 'w-24',
  showCount = true,
}: TagSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        'group flex w-full items-center gap-2 rounded-lg px-3 py-2',
        'text-neutral-800 dark:text-neutral-100',
        className,
      )}
    >
      <div
        className={clsx(
          'h-4 w-4 rounded-sm border',
          'border-neutral-300 bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-700',
          'motion-safe:animate-pulse motion-reduce:animate-none',
        )}
      />

      <div
        className={clsx(
          'h-4 rounded',
          labelWidthClassName,
          'bg-neutral-100 dark:bg-neutral-700',
          'motion-safe:animate-pulse motion-reduce:animate-none',
        )}
      />

      {showCount && (
        <div
          className={clsx(
            'ml-auto h-6 w-6 rounded-full border',
            'border-neutral-300 bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-700',
            'motion-safe:animate-pulse motion-reduce:animate-none',
          )}
        />
      )}
    </div>
  )
}
