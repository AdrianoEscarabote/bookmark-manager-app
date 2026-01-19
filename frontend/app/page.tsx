'use client'

import { AnimatePresence, LayoutGroup, motion, Transition, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'

import { useBookmarksStore } from '@/app/_store/bookmarks'
import { ScrollArea } from '@/components/ui/scroll-area'
import useBookmarks from '@/hooks/use-bookmarks'
import { getVisibleBookmarks } from '@/utils/get-visible-bookmarks'

import BookmarkHeader from './_components/bookmark-header'
import Card from './_components/card'
import { CardSkeleton } from './_components/card/card-skeleton'
import Header from './_components/header'
import { AppSidebar } from './_components/sidebar'
import { useFiltersStore } from './_store/filters'

export default function Home() {
  const { data: bookmarks, loading, error } = useBookmarks({ archived: false })
  const hydrated = useBookmarksStore((s) => s.hydrated)

  const sort = useFiltersStore((s) => s.sort)
  const searchQuery = useFiltersStore((s) => s.searchQuery)
  const selectedTags = useFiltersStore((s) => s.selectedTags)
  const normalizedQuery = searchQuery.trim().toLowerCase()

  const visibleBookmarks = useMemo(() => {
    const base = getVisibleBookmarks(bookmarks ?? [], {
      sort,
      searchQuery,
      selectedTags,
    })

    return [...base].sort((a, b) => Number(b.pinned) - Number(a.pinned))
  }, [bookmarks, sort, searchQuery, selectedTags])

  const reduce = useReducedMotion()
  const transition: Transition = reduce
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 420, damping: 32 }

  return (
    <LayoutGroup>
      <div className="flex w-full">
        <AppSidebar />

        <div className="flex w-full flex-col">
          <Header />

          <ScrollArea className="mt-20 max-h-[calc(100vh-5rem)]">
            <section className="flex flex-wrap items-center gap-5 p-4 md:p-8">
              <BookmarkHeader />
              <div className="mx-auto grid items-center gap-8 sm:grid-cols-2 md:mx-0 md:flex md:flex-wrap md:items-start">
                <AnimatePresence mode="popLayout">
                  {(!hydrated || loading) &&
                    Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={`card-skeleton-${i}`}
                        layout="position"
                        initial={false} // <- aparece na hora (sem fade-in)
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                        transition={transition}
                        className="transform-gpu will-change-transform"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <CardSkeleton />
                      </motion.div>
                    ))}

                  {hydrated && !loading && !error && visibleBookmarks.length === 0 && (
                    <motion.p
                      key="no-results"
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      transition={transition}
                      className="text-preset-4 w-full text-neutral-600 dark:text-neutral-200"
                    >
                      No results found
                      {normalizedQuery ? (
                        <>
                          {' '}
                          for: <span className="font-semibold">“{searchQuery.trim()}”</span>
                        </>
                      ) : null}
                    </motion.p>
                  )}

                  {hydrated &&
                    !loading &&
                    !error &&
                    visibleBookmarks.map((b) => (
                      <motion.div
                        key={b.id}
                        layout="position"
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                        transition={transition}
                        className="transform-gpu will-change-transform"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <Card bookmark={b} {...b} />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </section>
          </ScrollArea>
        </div>
      </div>
    </LayoutGroup>
  )
}
