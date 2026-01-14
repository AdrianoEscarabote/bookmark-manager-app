import { Calendar, Clock, Eye, Pin } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

import { isDemoModeClient } from '@/app/_lib/demo-bookmarks'
import { Bookmark, useBookmarksStore } from '@/app/_store/bookmarks'
import { Separator } from '@/components/ui/separator'
import { api } from '@/utils/api'
import { formatDayMonth } from '@/utils/format-day-month'
import { getDisplayHostname } from '@/utils/get-display-host-name'
import { showBookmarkToast } from '@/utils/show-bookmark-toast'

import { BookmarkActionDialog } from '../bookmark-action-dialog'
import { BookmarkMenu } from '../bookmark-menu'
import { EditBookmarkDialog } from '../edit-bookmark-dialog'

interface CardProps {
  bookmark: Bookmark
}

const PIN_LIMIT = 3

const Card = ({ bookmark }: CardProps) => {
  const { toggleArchive, remove, togglePin, incrementVisit } = useBookmarksStore()

  const [showArchiveDialog, setShowArchiveDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showUnarchiveDialog, setShowUnarchiveDialog] = useState(false)

  const [loading, setLoading] = useState(false)

  const pinnedCount = useBookmarksStore((s) => s.items.filter((b) => b.pinned).length)
  const canPinMore = pinnedCount < PIN_LIMIT

  return (
    <>
      <BookmarkActionDialog
        action="unarchive"
        open={showUnarchiveDialog}
        onOpenChange={() => setShowUnarchiveDialog(!showUnarchiveDialog)}
        onConfirm={async () => {
          setLoading(true)

          if (isDemoModeClient()) {
            toggleArchive(bookmark.id)
            showBookmarkToast('unarchived')
            setTimeout(() => setLoading(false), 300)
            return
          }

          await api.patch('/bookmark/archive', { bookmarkId: bookmark.id })
          showBookmarkToast('unarchived')
          toggleArchive(bookmark.id)
          setTimeout(() => setLoading(false), 500)
        }}
        loading={loading}
      />
      <BookmarkActionDialog
        action="archive"
        open={showArchiveDialog}
        onOpenChange={() => setShowArchiveDialog(!showArchiveDialog)}
        onConfirm={async () => {
          setLoading(true)

          if (isDemoModeClient()) {
            toggleArchive(bookmark.id)
            showBookmarkToast('archived')
            setTimeout(() => setLoading(false), 300)
            return
          }

          await api.patch('/bookmark/archive', { bookmarkId: bookmark.id })
          showBookmarkToast('archived')
          toggleArchive(bookmark.id)
          setTimeout(() => setLoading(false), 500)
        }}
        loading={loading}
      />
      <BookmarkActionDialog
        action="delete"
        open={showDeleteDialog}
        onOpenChange={() => setShowDeleteDialog(!showDeleteDialog)}
        onConfirm={async () => {
          setLoading(true)

          if (isDemoModeClient()) {
            remove(bookmark.id)
            showBookmarkToast('deleted')
            setTimeout(() => setLoading(false), 300)
            return
          }

          await api.delete('/bookmark/delete', { data: { bookmarkId: bookmark.id } })
          showBookmarkToast('deleted')
          remove(bookmark.id)
          setTimeout(() => setLoading(false), 500)
        }}
        loading={loading}
      />
      <EditBookmarkDialog
        bookmark={bookmark}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <article
        key={bookmark.id}
        className="bg-neutral-0 flex max-h-68 min-h-68 w-full max-w-[390px] flex-col justify-between rounded-[0.75rem] shadow-sm md:max-w-84.5 md:min-w-[338px] dark:bg-neutral-800"
      >
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <Image
                alt={bookmark.title}
                src={bookmark.favicon}
                width={44}
                height={44}
                className="rounded-xl border border-neutral-100 dark:border-neutral-500"
              />
              <div className="ml-3">
                <h3 className="text-preset-3 dark:text-neutral-0 text-neutral-900">
                  {bookmark.title}
                </h3>
                <p className="text-preset-5 text-neutral-800 dark:text-neutral-100">
                  {getDisplayHostname(bookmark.url)}
                </p>
              </div>
            </div>

            <BookmarkMenu
              bookmark={bookmark}
              onArchive={() => setShowArchiveDialog(!showArchiveDialog)}
              onUnarchive={() => setShowUnarchiveDialog(!showUnarchiveDialog)}
              onVisit={async () => {
                if (isDemoModeClient()) {
                  incrementVisit(bookmark.id)
                  return
                }

                await api.patch('/bookmark/update', {
                  bookmarkId: bookmark.id,
                  action: 'visit',
                })
                incrementVisit(bookmark.id)
              }}
              onEdit={() => setShowEditDialog(!showEditDialog)}
              onDelete={() => setShowDeleteDialog(!showDeleteDialog)}
              canPin={canPinMore}
              onPin={async () => {
                const willPin = !bookmark.pinned

                if (willPin && pinnedCount >= PIN_LIMIT) {
                  toast.error(`You can only pin up to ${PIN_LIMIT} bookmarks.`)
                  return false
                }

                const okToToggle = togglePin(bookmark.id)
                if (!okToToggle) {
                  toast.error(`You can only pin up to ${PIN_LIMIT} bookmarks.`)
                  return false
                }

                // demo: não chama backend
                if (isDemoModeClient()) {
                  if (!bookmark.pinned) showBookmarkToast('pinned')
                  return true
                }

                try {
                  await api.patch('/bookmark/update', {
                    bookmarkId: bookmark.id,
                    pinned: willPin,
                  })

                  if (!bookmark.pinned) showBookmarkToast('pinned')
                  return true
                } catch {
                  togglePin(bookmark.id)
                  toast.error('Failed to update pin')
                  return false
                }
              }}
            />
          </div>
          <Separator className="my-4 bg-neutral-300 dark:bg-neutral-500" />
          <div>
            <p
              className="text-preset-4-medium text-neutral-800 dark:text-neutral-100"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {bookmark.description}
            </p>
            <div className="mt-4 flex items-center gap-2">
              {bookmark.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-preset-5 rounded-sm bg-neutral-100 px-2 py-0.5 text-neutral-800 dark:bg-neutral-600 dark:text-neutral-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col">
          <Separator className="bg-neutral-300 dark:bg-neutral-500" />
          <div className="relative flex items-center gap-4 px-4 py-3 text-neutral-800 dark:text-neutral-100">
            <span className="flex items-center gap-1.5">
              <Eye className="size-4" />
              <span className="text-preset-5">{bookmark.visitCount} </span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              <span className="text-preset-5">{formatDayMonth(bookmark.lastVisited ?? '')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              <span className="text-preset-5">{formatDayMonth(bookmark.createdAt)}</span>
            </span>

            <span className="absolute right-4 ml-1 text-neutral-800 dark:text-neutral-100">
              {bookmark.pinned ? <Pin className="size-4" /> : ''}
            </span>
          </div>
        </div>
      </article>
    </>
  )
}

export default Card
