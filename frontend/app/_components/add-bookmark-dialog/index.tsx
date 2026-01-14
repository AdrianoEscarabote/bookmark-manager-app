'use client'

import { Plus, XIcon } from 'lucide-react'
import * as React from 'react'

import { isDemoModeClient } from '@/app/_lib/demo-bookmarks'
import { useBookmarksStore } from '@/app/_store/bookmarks'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useIsMobile } from '@/hooks/use-mobile'
import { api } from '@/utils/api'
import { getFaviconUrl } from '@/utils/get-favicon-url'
import { showBookmarkToast } from '@/utils/show-bookmark-toast'

import { BookmarkForm, BookmarkFormValues } from '../bookmark-form'
import Button from '../button'

interface AddBookmarkDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export function AddBookmarkDialog({ open, onOpenChange, trigger }: AddBookmarkDialogProps) {
  const [loading, setLoading] = React.useState(false)
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const [formKey, setFormKey] = React.useState(0)

  const isControlled = open !== undefined
  const isOpen = isControlled ? open : uncontrolledOpen
  const isMobile = useIsMobile()

  const { addBookmark } = useBookmarksStore()

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

    const formattedData = {
      title: data.title,
      url: data.url,
      favicon: getFaviconUrl(data.url),
      description: data.description,
      tags,
      pinned: false,
      isArchived: false,
      visitCount: 0,
      createdAt: new Date().toISOString(),
      lastVisited: null,
    }

    try {
      if (isDemoModeClient()) {
        const id =
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `demo-${Date.now()}`

        addBookmark({ ...formattedData, id })
        showBookmarkToast('success')
        handleOpenChange(false)
        setLoading(false)
        return
      }

      const response = await api.post('/bookmark/create', formattedData)
      addBookmark({ ...formattedData, id: response.data.id })
      showBookmarkToast('success')
      handleOpenChange(false)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button hierarchy="primary" size="sm" type="button">
            <Plus className="size-5" /> {isMobile ? '' : 'Add bookmark'}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="bg-neutral-0 flex max-h-screen flex-col gap-5 rounded-2xl p-5 md:max-w-[570px] md:gap-8 md:p-8 dark:bg-neutral-800"
      >
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="text-preset-1 dark:text-neutral-0 text-neutral-900">
            Add a Bookmark
          </DialogTitle>
          <DialogDescription className="text-neutral-4-medium text-neutral-800 dark:text-neutral-100">
            Save a link with details to keep your collection organized.
          </DialogDescription>
        </DialogHeader>

        <BookmarkForm
          loading={loading}
          key={formKey}
          submitLabel="Add Bookmark"
          onSubmit={handleSubmit}
          handleOpenChange={handleOpenChange}
        />

        <DialogClose
          className="dark:text-neutral-0 absolute top-3 right-3 grid h-8 w-8 cursor-pointer place-content-center rounded-md border border-neutral-400 text-neutral-900 transition hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:outline-none dark:border-neutral-500 dark:hover:bg-neutral-800 dark:focus-visible:ring-teal-300"
          aria-label="Close"
          onClick={() => setLoading(false)}
        >
          <XIcon className="size-5" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
