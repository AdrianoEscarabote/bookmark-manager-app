import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useBookmarksStore } from '@/app/_store/bookmarks'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import IconLogout from '@/components/ui/icons/icon-logout'
import IconTheme from '@/components/ui/icons/icon-theme'
import { api } from '@/utils/api'

import { ModeToggle } from '../mode-toggle'

const ProfileMenu = () => {
  const router = useRouter()

  const handleLogout = async () => {
    const response = await api.post('/auth/logout')
    if (response.status === 204) {
      useBookmarksStore.getState().reset()
      router.push('/sign-in')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          data-testid="profile-trigger"
          className="cursor-pointer rounded-full bg-transparent"
          size={'icon-lg'}
        >
          <Image src={'/images/image-avatar.webp'} width={40} height={40} alt="Profile" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-neutral-0 w-full min-w-62 rounded-xl border border-neutral-100 p-0 dark:border-neutral-500 dark:bg-neutral-600"
        align="end"
      >
        <DropdownMenuGroup className="w-full">
          <div className="flex items-center gap-3 px-4 py-3">
            <Image src={'/images/image-avatar.webp'} width={40} height={40} alt="" />
            <div>
              <p className="text-preset-4 dark:text-neutral-0 max-w-35 truncate text-neutral-900">
                Emily carter
              </p>
              <p className="text-preset-4-medium max-w-40 truncate text-neutral-800 dark:text-neutral-100">
                emily101@gmail.com
              </p>
            </div>
          </div>
          <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-500" />
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-preset-4 flex items-center gap-2 text-neutral-800 dark:text-neutral-100">
              <IconTheme className="text-neutral-800 dark:text-neutral-100" />
              Theme
            </p>
            <ModeToggle />
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <Button
          className="text-preset-4 w-full cursor-pointer justify-start rounded-none px-4 text-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-800"
          size="icon-lg"
          variant="ghost"
          onClick={handleLogout}
        >
          <IconLogout className="block size-5 text-inherit" />
          Logout
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileMenu
