import { toast } from 'sonner'

import Toast from '../app/_components/toast'

type BookmarkToastType =
  | 'success'
  | 'changes_saved'
  | 'copied'
  | 'pinned'
  | 'archived'
  | 'unarchived'
  | 'deleted'

export async function showBookmarkToast(type: BookmarkToastType) {
  try {
    toast.custom((t) => <Toast type={type} t={t} />)
  } catch {}
}
