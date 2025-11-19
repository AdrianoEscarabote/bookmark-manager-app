'use client'

import clsx from 'clsx'
import {
  Archive,
  ArchiveRestore,
  Copy,
  ExternalLink,
  Pencil,
  Pin,
  PinOff,
  Trash2,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import IconMenuBookmark from '@/components/ui/icons/icon-menu-bookmark'

const itemCls =
  'group relative flex cursor-pointer items-center gap-2.5 rounded-lg p-2 text-sm outline-none ' +
  'data-[highlighted]:bg-neutral-100 dark:data-[highlighted]:bg-teal-800 '

export type BookmarkMenuProps = {
  url: string
  isArchived?: boolean
  isPinned?: boolean
  onVisit?: () => void
  onCopyUrl?: () => void
  onPinToggle?: (next: boolean) => void
  onEdit?: () => void
  onArchiveToggle?: (next: boolean) => void
  onDelete?: () => void
}

export function BookmarkMenu({
  url,
  isArchived,
  isPinned,
  onVisit,
  onCopyUrl,
  onPinToggle,
  onEdit,
  onArchiveToggle,
  onDelete,
}: BookmarkMenuProps) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      onCopyUrl?.()
    } catch {}
  }

  const PinIcon = isPinned ? PinOff : Pin
  const ArchiveIcon = isArchived ? ArchiveRestore : Archive
  const archiveLabel = isArchived ? 'Unarchive' : 'Archive'
  const pinLabel = isPinned ? 'Unpin' : 'Pin'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="dark:text-neutral-0 grid h-8 w-8 cursor-pointer place-content-center rounded-md border border-neutral-400 px-3 py-2 text-neutral-900 dark:border-neutral-500">
          <IconMenuBookmark />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={clsx(
          'flex w-[200px] flex-col gap-1 rounded-md border border-neutral-100 p-2 dark:bg-neutral-600',
          'dark:border-neutral-500',
        )}
      >
        <DropdownMenuItem className={itemCls} onSelect={(e) => (e.preventDefault(), onVisit?.())}>
          <ExternalLink className="size-4 text-neutral-800 dark:text-neutral-100" />
          <span>Visit</span>
        </DropdownMenuItem>
        <DropdownMenuItem className={itemCls} onSelect={(e) => (e.preventDefault(), handleCopy())}>
          <Copy className="size-4 text-neutral-800 dark:text-neutral-100" />
          <span>Copy URL</span>
        </DropdownMenuItem>

        {!isArchived && (
          <>
            <DropdownMenuItem
              className={itemCls}
              onSelect={(e) => (e.preventDefault(), onPinToggle?.(!isPinned))}
            >
              <PinIcon className="size-4 text-neutral-800 dark:text-neutral-100" />
              <span>{pinLabel}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className={itemCls}
              onSelect={(e) => (e.preventDefault(), onEdit?.())}
            >
              <Pencil className="size-4 text-neutral-800 dark:text-neutral-100" />
              <span>Edit</span>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem
          className={itemCls}
          onSelect={(e) => (e.preventDefault(), onArchiveToggle?.(!isArchived))}
        >
          <ArchiveIcon className="size-4 text-neutral-800 dark:text-neutral-100" />
          <span>{archiveLabel}</span>
        </DropdownMenuItem>

        {isArchived && (
          <DropdownMenuItem
            className={itemCls}
            onSelect={(e) => (e.preventDefault(), onDelete?.())}
          >
            <Trash2 className="size-4 text-neutral-800 dark:text-neutral-100" />
            <span>Delete Permanently</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
