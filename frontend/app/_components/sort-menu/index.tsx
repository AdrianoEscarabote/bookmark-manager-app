'use client'

import clsx from 'clsx'
import { Check } from 'lucide-react'

import { useFiltersStore } from '@/app/_store/filters'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export type SortValue = 'recently_added' | 'recently_visited' | 'most_visited'

export function SortMenu({ trigger }: { trigger: React.ReactNode }) {
  const storeValue = useFiltersStore((s) => s.sort)
  const setStoreValue = useFiltersStore((s) => s.setSort)

  const radioItemCls =
    'text-preset-4 flex cursor-pointer items-center justify-between rounded-md p-2 pl-2 text-neutral-800 ' +
    'dark:text-neutral-100 dark:focus:bg-neutral-500'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={clsx(
          'bg-neutral-0 w-full min-w-50 rounded-2xl border border-neutral-100 p-2',
          'dark:border-neutral-500 dark:bg-neutral-600',
        )}
      >
        <DropdownMenuRadioGroup
          value={storeValue}
          onValueChange={(v) => setStoreValue(v as SortValue)}
          className="space-y-1"
        >
          <DropdownMenuRadioItem value="recently_added" className={clsx(radioItemCls)}>
            Recently added
            {storeValue === 'recently_added' && <Check className="size-4" />}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="recently_visited" className={clsx(radioItemCls)}>
            Recently visited
            {storeValue === 'recently_visited' && <Check className="size-4" />}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="most_visited" className={clsx(radioItemCls)}>
            Most visited
            {storeValue === 'most_visited' && <Check className="size-4" />}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
