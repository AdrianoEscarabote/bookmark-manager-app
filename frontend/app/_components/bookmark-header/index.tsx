import { usePathname } from 'next/navigation'

import { useFiltersStore } from '@/app/_store/filters'
import IconSort from '@/components/ui/icons/icon-sort'

import { SortMenu } from '../sort-menu'

const BookmarkHeader = () => {
  const route = usePathname()
  const searchQuery = useFiltersStore((state) => state.searchQuery)

  return (
    <div className="flex w-full items-center justify-between">
      <h2 className="text-preset-1 dark:text-neutral-0 text-neutral-900">
        {route === '/' && searchQuery === '' && 'All Bookmarks'}
        {route === '/archived' && searchQuery === '' && 'Archived bookmarks'}
        {searchQuery !== '' && 'Results for: '}
        {searchQuery !== '' && (
          <span className="text-teal-700 dark:text-neutral-100">{`"${searchQuery}"`}</span>
        )}
      </h2>
      <SortMenu
        trigger={
          <button className="bg-neutral-0 text-preset-3 dark:text-neutral-0 flex cursor-pointer items-center gap-1 rounded-lg border border-neutral-400 px-3 py-2.5 text-neutral-900 dark:bg-neutral-800">
            <IconSort className="size-5" />
            Sort by
          </button>
        }
      />
    </div>
  )
}

export default BookmarkHeader
