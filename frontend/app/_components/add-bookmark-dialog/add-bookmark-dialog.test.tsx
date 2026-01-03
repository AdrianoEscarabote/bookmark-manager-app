import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useBookmarksStore } from '@/app/_store/bookmarks'
import { api } from '@/utils/api'

import { AddBookmarkDialog } from './index'

jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}))

jest.mock('@/utils/api', () => ({
  __esModule: true,
  api: {
    post: jest.fn(),
  },
}))

describe('AddBookmarkDialog', () => {
  const resetStore = () =>
    useBookmarksStore.setState({
      items: [],
      loading: false,
      error: undefined,
    })

  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalCrypto = (global as any).crypto || {}
    Object.defineProperty(global, 'crypto', {
      value: {
        ...originalCrypto,
        randomUUID: jest.fn(() => 'test-id'),
      },
    })
  })

  beforeEach(() => {
    resetStore()
    jest.clearAllMocks()
  })

  it('renders the default trigger button', () => {
    render(<AddBookmarkDialog />)

    expect(screen.getByRole('button', { name: /add bookmark/i })).toBeInTheDocument()
  })

  it('opens the dialog when trigger is clicked', async () => {
    render(<AddBookmarkDialog />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /add bookmark/i }))

    expect(await screen.findByRole('heading', { name: /add a bookmark/i })).toBeInTheDocument()
  })

  it('shows required errors on empty submit', async () => {
    render(<AddBookmarkDialog />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /add bookmark/i }))

    const dialog = await screen.findByRole('dialog')
    const submitButton = within(dialog).getByRole('button', { name: /add bookmark/i })

    await user.click(submitButton)

    expect(await screen.findByText('Title is required')).toBeInTheDocument()
    expect(screen.getByText('Description is required')).toBeInTheDocument()
    expect(screen.getByText('URL is required')).toBeInTheDocument()
    expect(screen.getByText('At least one tag is required')).toBeInTheDocument()
  })

  it('adds a bookmark to the store and closes on valid submit', async () => {
    ;(api.post as jest.Mock).mockResolvedValueOnce({ data: { id: 'test-id' } })

    render(<AddBookmarkDialog />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /add bookmark/i }))

    const dialog = await screen.findByRole('dialog')

    await user.type(within(dialog).getByLabelText(/title/i), 'My bookmark')
    await user.type(within(dialog).getByLabelText(/description/i), 'Some useful description')
    await user.type(within(dialog).getByLabelText(/website url/i), 'https://example.com')
    await user.type(within(dialog).getByLabelText(/tags/i), 'design, tools')

    await user.click(within(dialog).getByRole('button', { name: /add bookmark/i }))

    await waitFor(() => expect(api.post).toHaveBeenCalled())

    await waitFor(() => {
      const items = useBookmarksStore.getState().items
      expect(items).toHaveLength(1)
      expect(items[0]).toEqual(
        expect.objectContaining({
          id: 'test-id',
          title: 'My bookmark',
          description: 'Some useful description',
          url: 'https://example.com',
          tags: ['design', 'tools'],
          pinned: false,
          isArchived: false,
          visitCount: 0,
          lastVisited: null,
        }),
      )
    })

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('formats tags input by inserting comma when space is pressed', async () => {
    render(<AddBookmarkDialog />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /add bookmark/i }))

    const dialog = await screen.findByRole('dialog')
    const tagsInput = within(dialog).getByLabelText(/tags/i) as HTMLInputElement

    await user.type(tagsInput, 'design')
    fireEvent.keyDown(tagsInput, { key: ' ', code: 'Space', charCode: 32 })

    expect(tagsInput.value).toBe('design, ')
  })

  it('resets the form when dialog is closed and reopened (uncontrolled)', async () => {
    render(<AddBookmarkDialog />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /add bookmark/i }))
    let dialog = await screen.findByRole('dialog')

    const titleInput = within(dialog).getByLabelText(/title/i) as HTMLInputElement
    await user.type(titleInput, 'Temporary title')

    const cancelButton = within(dialog).getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /add bookmark/i }))
    dialog = await screen.findByRole('dialog')

    const titleInputAfter = within(dialog).getByLabelText(/title/i) as HTMLInputElement
    expect(titleInputAfter.value).toBe('')
  })

  it('controlled mode: calls onOpenChange when closing', async () => {
    const onOpenChange = jest.fn()
    render(<AddBookmarkDialog open onOpenChange={onOpenChange} />)

    const dialog = screen.getByRole('dialog')
    const user = userEvent.setup()

    const cancelButton = within(dialog).getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)
    expect(onOpenChange).toHaveBeenCalledWith(false)

    await user.click(screen.getByLabelText('Close'))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('accepts a custom trigger', () => {
    render(<AddBookmarkDialog trigger={<button data-testid="open-add">Open</button>} />)

    expect(screen.getByTestId('open-add')).toBeInTheDocument()
  })
})
