'use client'

import clsx from 'clsx'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const active = resolvedTheme as 'light' | 'dark'

  const options: { key: 'light' | 'dark'; icon: React.ReactNode; label: string }[] = [
    { key: 'light', icon: <Sun className="size-5" />, label: 'Light' },
    { key: 'dark', icon: <Moon className="size-5" />, label: 'Dark' },
  ]

  const idxActive = options.findIndex((o) => o.key === active)

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const dir = e.key === 'ArrowRight' ? 1 : -1
      const next = (idxActive + dir + options.length) % options.length
      setTheme(options[next].key)
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme mode"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={clsx(
        'relative h-7.5 w-16 rounded-md p-0.5',
        'bg-neutral-300 dark:bg-neutral-500',
        'focus-visible:ring-offset-neutral-0 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:ring-teal-300 dark:focus-visible:ring-offset-teal-950',
      )}
    >
      <div className="relative flex h-full w-full">
        <span
          aria-hidden
          className="bg-neutral-0 absolute top-0 left-0 h-full w-1/2 rounded-md transition-transform duration-200 dark:bg-neutral-600"
          style={{ transform: `translateX(${idxActive * 100}%)` }}
        />
        {options.map((opt, i) => {
          const selected = i === idxActive
          return (
            <button
              key={opt.key}
              role="radio"
              aria-checked={selected}
              aria-label={opt.label}
              onClick={() => setTheme(opt.key)}
              className={clsx(
                'relative z-10 flex flex-1 cursor-pointer items-center justify-center rounded-md',
                'dark:text-neutral-0 text-neutral-800',
                'transition-colors',
                !selected && 'hover:bg-neutral-0 dark:hover:bg-neutral-600',
              )}
            >
              {opt.icon}
            </button>
          )
        })}
      </div>
    </div>
  )
}
