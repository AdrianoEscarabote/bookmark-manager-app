/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { getFaviconUrl } from '@/utils/get-favicon-url'

import { EditBookmarkDialog } from './index'

const updateMock = jest.fn()
const patchMock = jest.fn()
const toastMock = jest.fn()

jest.mock('@/app/_store/bookmarks', () => ({
  __esModule: true,
  useBookmarksStore: () => ({
    update: updateMock,
  }),
}))

jest.mock('@/utils/api', () => ({
  __esModule: true,
  api: {
    patch: (...args: any[]) => patchMock(...args),
  },
}))

jest.mock('@/utils/show-bookmark-toast', () => ({
  __esModule: true,
  showBookmarkToast: (...args: any[]) => toastMock(...args),
}))

jest.mock('@/components/ui/dialog', () => {
  const React = require('react')
  return {
    __esModule: true,
    Dialog: ({ children }: any) => <div data-testid="dialog-root">{children}</div>,
    DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
    DialogHeader: ({ children }: any) => <div>{children}</div>,
    DialogTitle: ({ children }: any) => <h2>{children}</h2>,
    DialogDescription: ({ children }: any) => <p>{children}</p>,
    DialogClose: ({ children, ...props }: any) => (
      <button type="button" {...props}>
        {children}
      </button>
    ),
  }
})

jest.mock('../bookmark-form', () => {
  const React = require('react')
  const BookmarkForm = ({ defaultValues, submitLabel, onSubmit }: any) => (
    <div>
      <div data-testid="default-title">{defaultValues?.title}</div>
      <button
        type="button"
        onClick={() =>
          onSubmit({
            title: 'Updated title',
            description: 'Updated description',
            url: 'https://updated.dev',
            tags: 'tag1, tag2',
          })
        }
      >
        {submitLabel}
      </button>
    </div>
  )

  return {
    __esModule: true,
    BookmarkForm,
  }
})

const bookmark = {
  id: '1',
  title: 'Original title',
  description: 'Original description',
  url: 'https://example.com',
  favicon: 'https://icons.duckduckgo.com/ip3/example.com.ico',
  tags: ['one', 'two'],
  pinned: false,
  isArchived: false,
  visitCount: 0,
  createdAt: '2024-01-01T00:00:00.000Z',
  lastVisited: null,
}

describe('EditBookmarkDialog', () => {
  beforeEach(() => {
    updateMock.mockClear()
    patchMock.mockClear()
    toastMock.mockClear()

    patchMock.mockResolvedValue({ status: 200, data: {} })
  })

  it('renders the dialog with the bookmark initial values', () => {
    render(<EditBookmarkDialog open bookmark={bookmark} />)

    expect(screen.getByRole('heading', { name: /edit bookmark/i })).toBeInTheDocument()
    expect(screen.getByTestId('default-title')).toHaveTextContent('Original title')
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
  })

  it('PATCHes, updates the store, shows a toast, and closes via onOpenChange(false)', async () => {
    const user = userEvent.setup()
    const onOpenChange = jest.fn()

    render(<EditBookmarkDialog open onOpenChange={onOpenChange} bookmark={bookmark} />)

    await user.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(patchMock).toHaveBeenCalledTimes(1)
    })

    expect(patchMock).toHaveBeenCalledWith('/bookmark/update', {
      bookmarkId: bookmark.id,
      title: 'Updated title',
      description: 'Updated description',
      url: 'https://updated.dev',
      favicon: getFaviconUrl('https://updated.dev'),
      tags: ['tag1', 'tag2'],
    })

    expect(updateMock).toHaveBeenCalledTimes(1)
    expect(updateMock).toHaveBeenCalledWith(bookmark.id, {
      title: 'Updated title',
      description: 'Updated description',
      url: 'https://updated.dev',
      favicon: getFaviconUrl('https://updated.dev'),
      tags: ['tag1', 'tag2'],
    })

    expect(toastMock).toHaveBeenCalledWith('changes_saved')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('removes empty tags and trims correctly', async () => {
    const user = userEvent.setup()

    const FormModule = await import('../bookmark-form')

    function BookmarkFormMock({ submitLabel, onSubmit }: any) {
      return (
        <button
          type="button"
          onClick={() =>
            onSubmit({
              title: 't',
              description: 'd',
              url: 'https://x.dev',
              tags: ' tag1,  , tag2  ,',
            })
          }
        >
          {submitLabel}
        </button>
      )
    }
    BookmarkFormMock.displayName = 'BookmarkFormMock'
    ;(FormModule as any).BookmarkForm = BookmarkFormMock

    render(<EditBookmarkDialog open bookmark={bookmark} />)

    await user.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(patchMock).toHaveBeenCalled()
    })

    const [, payload] = patchMock.mock.calls[0]
    expect(payload.tags).toEqual(['tag1', 'tag2'])
  })
})
