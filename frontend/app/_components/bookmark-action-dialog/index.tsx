'use client'

import { Loader2Icon, X } from 'lucide-react'
import { useState } from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import Button from '../button'

type ActionType = 'archive' | 'unarchive' | 'delete'

interface BookmarkActionDialogProps {
  action: ActionType
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onConfirm?: () => Promise<void> | void
  loading?: boolean
}

const COPY: Record<
  ActionType,
  {
    title: string
    description: string
    confirmLabel: string
    confirmHierarchy: 'primary' | 'secondary'
    confirmError?: boolean
  }
> = {
  archive: {
    title: 'Archive bookmark',
    description: 'Are you sure you want to archive this bookmark?',
    confirmLabel: 'Archive',
    confirmHierarchy: 'primary',
  },
  unarchive: {
    title: 'Unarchive bookmark',
    description: 'Move this bookmark back to your active list?',
    confirmLabel: 'Unarchive',
    confirmHierarchy: 'primary',
  },
  delete: {
    title: 'Delete bookmark',
    description: 'Are you sure you want to delete this bookmark?',
    confirmLabel: 'Delete permanently',
    confirmHierarchy: 'primary',
    confirmError: true,
  },
}

export function BookmarkActionDialog({
  action,
  open,
  onOpenChange,
  onConfirm,
  loading,
}: BookmarkActionDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : uncontrolledOpen
  const handleOpenChange = (v: boolean) => {
    if (isControlled) onOpenChange?.(v)
    else setUncontrolledOpen(v)
  }

  const c = COPY[action]

  async function handleConfirm() {
    await onConfirm?.()
    handleOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        style={{ maxWidth: '28rem' }}
        className="border-border bg-neutral-0 w-full max-w-md gap-6 rounded-lg dark:bg-neutral-800"
      >
        <DialogHeader className="flex flex-col gap-2 text-left">
          <DialogTitle className="text-preset-1 dark:text-neutral-0 text-neutral-900">
            {c.title}
          </DialogTitle>
          <DialogDescription className="text-preset-4-medium text-neutral-800 dark:text-neutral-100">
            {c.description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-4">
          <DialogClose asChild>
            <Button hierarchy="secondary" size="sm" type="button" showIcon={false}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            hierarchy={c.confirmHierarchy}
            size="sm"
            error={c.confirmError}
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            showIcon={false}
          >
            {loading ? <Loader2Icon className="size-4 animate-spin" /> : c.confirmLabel}
          </Button>
        </DialogFooter>

        <DialogClose
          className="dark:text-neutral-0 absolute top-3 right-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-neutral-900 transition hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:outline-none dark:hover:bg-teal-800"
          aria-label="Close"
        >
          <X className="size-5" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
