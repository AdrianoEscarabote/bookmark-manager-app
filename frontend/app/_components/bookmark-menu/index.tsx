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
import Link from 'next/link'
import { useState } from 'react'

import { Bookmark, useBookmarksStore } from '@/app/_store/bookmarks'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import IconMenuBookmark from '@/components/ui/icons/icon-menu-bookmark'
import { showBookmarkToast } from '@/utils/show-bookmark-toast'

const itemCls =
  'group relative flex cursor-pointer items-center gap-2.5 rounded-lg p-2 text-sm outline-none ' +
  'data-[highlighted]:bg-neutral-100 dark:data-[highlighted]:bg-teal-800 '

export type BookmarkMenuProps = {
  bookmark: Bookmark
  onVisit: () => void
  onPin: (next: boolean) => void
  canPin: boolean
  onEdit: () => void
  onArchive: () => void
  onUnarchive: () => void
  onDelete: () => void
}

export function BookmarkMenu({
  bookmark,
  onVisit,
  onPin,
  canPin,
  onEdit,
  onArchive,
  onUnarchive,
  onDelete,
}: BookmarkMenuProps) {
  const {} = useBookmarksStore()

  const PinIcon = bookmark.pinned ? PinOff : Pin
  const ArchiveIcon = bookmark.isArchived ? ArchiveRestore : Archive
  const archiveLabel = bookmark.isArchived ? 'Unarchive' : 'Archive'
  const pinLabel = bookmark.pinned ? 'Unpin' : 'Pin'

  const [dropdownOpen, setDropdownOpen] = useState(false)

  const pinDisabled = !bookmark.pinned && !canPin

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <button
          data-testid="trigger-button"
          className="dark:text-neutral-0 grid h-8 w-8 cursor-pointer place-content-center rounded-md border border-neutral-400 px-3 py-2 text-neutral-900 hover:bg-neutral-100 dark:border-neutral-500"
        >
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
        <DropdownMenuItem asChild className={itemCls}>
          <Link
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onVisit()}
            aria-label="Open link in new tab"
            title="Open in new tab"
            className="flex w-full items-center gap-2.5"
          >
            <ExternalLink className="size-4 text-neutral-800 dark:text-neutral-100" />
            <span>Visit</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          className={itemCls}
          onSelect={async () => {
            await navigator.clipboard.writeText(bookmark.url)
            showBookmarkToast('copied')
          }}
        >
          <Copy className="size-4 text-neutral-800 dark:text-neutral-100" />
          <span>Copy URL</span>
        </DropdownMenuItem>

        {!bookmark.isArchived && (
          <>
            <DropdownMenuItem
              className={itemCls}
              disabled={pinDisabled}
              onSelect={async () => {
                if (pinDisabled) return
                onPin(!bookmark.pinned)
              }}
            >
              <PinIcon className="size-4 text-neutral-800 dark:text-neutral-100" />
              <span>{pinLabel}</span>
            </DropdownMenuItem>

            <DropdownMenuItem className={itemCls} onSelect={() => onEdit()}>
              <Pencil className="size-4 text-neutral-800 dark:text-neutral-100" />
              <span>Edit</span>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem
          className={itemCls}
          onSelect={() => {
            if (!bookmark.isArchived) {
              onArchive()
            } else {
              onUnarchive()
            }
          }}
        >
          <ArchiveIcon className="size-4 text-neutral-800 dark:text-neutral-100" />
          <span>{archiveLabel}</span>
        </DropdownMenuItem>

        {bookmark.isArchived && (
          <DropdownMenuItem className={itemCls} onSelect={() => onDelete()}>
            <Trash2 className="size-4 text-neutral-800 dark:text-neutral-100" />
            <span>Delete Permanently</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
