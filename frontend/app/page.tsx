import { AddBookmarkDialog } from './_components/add-bookmark-dialog'
import { ModeToggle } from './_components/mode-toggle'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <ModeToggle />
      <AddBookmarkDialog />
    </div>
  )
}
