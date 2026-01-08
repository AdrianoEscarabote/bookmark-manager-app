import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'

import { AddBookmarkDialog } from '../add-bookmark-dialog'
import ProfileMenu from '../profile-menu'
import SearchInput from '../search-input'

const Header = () => {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="fixed top-0 right-0 left-0 z-50 md:left-74">
      <div className="bg-neutral-0 w-full border-b border-neutral-300 px-4 py-3 md:px-8 md:py-4 dark:border-neutral-500 dark:bg-neutral-800">
        <div className="flex items-center justify-between gap-2.5 md:gap-0">
          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              className="bg-neutral-0 dark:text-neutral-0 block h-10 max-h-10 w-10 cursor-pointer border border-neutral-400 text-neutral-900 md:hidden dark:border-neutral-400 dark:bg-neutral-800"
              onClick={toggleSidebar}
            >
              <Menu className="size-5" />
            </Button>
            <SearchInput />
          </div>
          <div className="flex items-center gap-4">
            <AddBookmarkDialog />
            <ProfileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
