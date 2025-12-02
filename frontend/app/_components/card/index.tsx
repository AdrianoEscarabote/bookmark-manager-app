import { Calendar, Clock, Eye } from 'lucide-react'
import Image from 'next/image'

import { Separator } from '@/components/ui/separator'

import { BookmarkMenu } from '../bookmark-menu'

interface CardProps {
  id: string
  title: string
  url: string
  favicon: string
  description: string
  tags: string[]
  pinned: boolean
  isArchived: boolean
  visitCount: number
  createdAt: string
  lastVisited: string | null
}

const Card = ({
  createdAt,
  description,
  favicon,
  id,
  isArchived,
  lastVisited,
  pinned,
  tags,
  title,
  url,
  visitCount,
}: CardProps) => {
  const displayUrl = (() => {
    try {
      return new URL(url).hostname.replace(/^www\./, '')
    } catch {
      return url
        .replace(/^[a-z]+:\/\//i, '')
        .replace(/^www\./, '')
        .split('/')[0]
    }
  })()

  const formatDayMonth = (iso: string) => {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return '-'
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(d)
  }

  return (
    <article
      key={id}
      className="bg-neutral-0 flex min-h-68 w-full max-w-84.5 flex-col justify-between rounded-[0.75rem] shadow-sm dark:bg-neutral-800"
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <Image
              alt={title}
              src={favicon}
              width={44}
              height={44}
              className="rounded-xl border border-neutral-100 dark:border-neutral-500"
            />
            <div className="ml-3">
              <h3 className="text-preset-3 dark:text-neutral-0 text-neutral-900">{title}</h3>
              <p className="text-preset-5 text-neutral-800 dark:text-neutral-100">{displayUrl}</p>
            </div>
          </div>

          <BookmarkMenu
            url={url}
            isArchived={isArchived}
            isPinned={pinned}
            onArchiveToggle={() => {}}
          />
        </div>
        <Separator className="my-4 bg-neutral-300 dark:bg-neutral-500" />
        <div>
          <p className="text-preset-4-medium text-neutral-800 dark:text-neutral-100">
            {description}
          </p>
          <div className="mt-4 flex items-center gap-2">
            {tags.map((tag) => (
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
        <div className="flex items-center gap-4 px-4 py-3 text-neutral-800 dark:text-neutral-100">
          <span className="flex items-center gap-1.5">
            <Eye className="size-4" />
            <span className="text-preset-5">{visitCount} </span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" />
            <span className="text-preset-5">{formatDayMonth(lastVisited ?? '')}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            <span className="text-preset-5">{formatDayMonth(createdAt)}</span>
          </span>
        </div>
      </div>
    </article>
  )
}

export default Card
