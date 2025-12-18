'use client'

import clsx from 'clsx'
import {
  ArchiveIcon,
  CheckIcon,
  CopyIcon,
  PinIcon,
  Trash2Icon,
  Undo2Icon,
  XIcon,
} from 'lucide-react'
import { toast } from 'sonner'

export type ToastPresetType =
  | 'success'
  | 'changes_saved'
  | 'copied'
  | 'pinned'
  | 'archived'
  | 'unarchived'
  | 'deleted'

export interface ToastPresetInterface {
  type: 'success' | 'changes_saved' | 'copied' | 'pinned' | 'archived' | 'unarchived' | 'deleted'
  t?: string | number | undefined
}

const toastPresets: Record<
  ToastPresetType,
  { icon: React.ReactNode; message: string; type?: 'success' | 'info' | 'error' }
> = {
  success: {
    icon: <CheckIcon className="dark:text-neutral-0 size-5 text-teal-700" />,
    message: 'Bookmark added successfully.',
    type: 'success',
  },
  changes_saved: {
    icon: <CheckIcon className="dark:text-neutral-0 size-5 text-teal-700" />,
    message: 'Changes saved.',
    type: 'success',
  },
  copied: {
    icon: <CopyIcon className="dark:text-neutral-0 size-5 text-teal-700" />,
    message: 'Link copied to clipboard.',
  },
  pinned: {
    icon: <PinIcon className="dark:text-neutral-0 size-5 text-teal-700" />,
    message: 'Bookmark pinned to top.',
  },
  archived: {
    icon: <ArchiveIcon className="dark:text-neutral-0 size-5 text-teal-700" />,
    message: 'Bookmark archived.',
  },
  unarchived: {
    icon: <Undo2Icon className="dark:text-neutral-0 size-5 text-teal-700" />,
    message: 'Bookmark restored.',
  },
  deleted: {
    icon: <Trash2Icon className="dark:text-neutral-0 size-5 text-teal-700" />,
    message: 'Bookmark deleted.',
  },
}

const Toast = ({ type, t }: ToastPresetInterface) => {
  return (
    <div
      className={clsx(
        'bg-neutral-0 flex min-h-10.25 w-full min-w-85 items-center justify-between rounded-lg border border-neutral-300 px-3 py-2.5' +
          'dark:border-neutral-400 dark:bg-neutral-500',
      )}
    >
      <div className="flex items-center gap-2">
        {toastPresets[type].icon}

        <p className={clsx('text-preset-4-medium text-neutral-900' + 'text-neutral-0')}>
          {toastPresets[type].message}
        </p>
      </div>
      <button
        onClick={() => (t ? toast.dismiss(t) : toast.dismiss())}
        className="ml-auto cursor-pointer rounded px-2 py-1 text-xs"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  )
}

export default Toast
