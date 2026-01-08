'use client'

import { XIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

import { type Bookmark, useBookmarksStore } from '@/app/_store/bookmarks'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { api } from '@/utils/api'
import { getFaviconUrl } from '@/utils/get-favicon-url'
import { showBookmarkToast } from '@/utils/show-bookmark-toast'

import { BookmarkForm, type BookmarkFormValues } from '../bookmark-form'

interface EditBookmarkDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  bookmark: Bookmark
}

export function EditBookmarkDialog({ open, onOpenChange, bookmark }: EditBookmarkDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const isControlled = open !== undefined
  const isOpen = isControlled ? open : uncontrolledOpen

  const { update } = useBookmarksStore()

  const [loading, setLoading] = useState(false)

  const handleOpenChange = (v: boolean) => {
    if (!v) setFormKey((k) => k + 1)

    if (isControlled) onOpenChange?.(v)
    else setUncontrolledOpen(v)
  }

  const handleSubmit = async (data: BookmarkFormValues) => {
    setLoading(true)
    const tags = data.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    await api.patch('/bookmark/update', {
      bookmarkId: bookmark.id,
      title: data.title,
      description: data.description,
      url: data.url,
      favicon: getFaviconUrl(data.url),
      tags,
    })

    update(bookmark.id, {
      title: data.title,
      description: data.description,
      url: data.url,
      favicon: getFaviconUrl(data.url),
      tags,
    })

    showBookmarkToast('changes_saved')
    setLoading(false)
    handleOpenChange(false)
  }

  const defaultValues = useMemo(
    () => ({
      title: bookmark.title,
      description: bookmark.description,
      url: bookmark.url,
      tags: bookmark.tags.join(', '),
    }),
    [bookmark],
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="bg-neutral-0 flex max-h-screen flex-col gap-5 rounded-2xl p-5 md:max-w-[570px] md:gap-8 md:p-8 dark:bg-neutral-800"
      >
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="text-preset-1 dark:text-neutral-0 text-neutral-900">
            Edit bookmark
          </DialogTitle>
          <DialogDescription className="text-neutral-800 dark:text-neutral-100">
            Update the information for this bookmark.
          </DialogDescription>
        </DialogHeader>

        <BookmarkForm
          key={formKey}
          defaultValues={defaultValues}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
          handleOpenChange={handleOpenChange}
          loading={loading}
        />

        <DialogClose
          className="dark:text-neutral-0 absolute top-3 right-3 grid h-8 w-8 cursor-pointer place-content-center rounded-md border border-neutral-400 text-neutral-900 transition hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:outline-none dark:border-neutral-500 dark:hover:bg-neutral-800 dark:focus-visible:ring-teal-300"
          aria-label="Close"
        >
          <XIcon className="size-5" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
