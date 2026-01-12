/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { BookmarkMenu } from './index'

const writeTextMock = jest.fn()

beforeAll(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: writeTextMock },
    configurable: true,
  })
})

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

jest.mock('@/utils/show-bookmark-toast', () => ({
  __esModule: true,
  showBookmarkToast: jest.fn(),
}))

jest.mock('@/app/_store/bookmarks', () => ({
  __esModule: true,
  useBookmarksStore: () => ({}),
}))

jest.mock('@/components/ui/dropdown-menu', () => ({
  __esModule: true,
  DropdownMenu: ({ children }: any) => <div data-testid="dropdown-root">{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div data-testid="dropdown-trigger">{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, onSelect, disabled, asChild, className }: any) => {
    if (asChild) {
      return (
        <div
          className={className}
          aria-disabled={disabled ? 'true' : 'false'}
          onClick={(e) => {
            if (disabled) return
            onSelect?.(e)
          }}
        >
          {children}
        </div>
      )
    }

    return (
      <button
        type="button"
        className={className}
        disabled={disabled}
        onClick={(e) => {
          if (disabled) return
          onSelect?.(e)
        }}
      >
        {children}
      </button>
    )
  },
}))

describe('BookmarkMenu', () => {
  const defaultBookmark = {
    id: '1',
    title: 'Test Bookmark',
    url: 'https://example.com',
    description: 'A test bookmark',
    favicon: 'https://example.com/favicon.ico',
    tags: ['test', 'example'],
    pinned: false,
    isArchived: false,
    visitCount: 0,
    lastVisited: null,
    createdAt: new Date().toISOString(),
  }

  const defaultProps = {
    bookmark: defaultBookmark,
    canPin: true,
    onArchive: jest.fn(),
    onUnarchive: jest.fn(),
    onVisit: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onPin: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    writeTextMock.mockReset()
  })

  it('renders the trigger button', () => {
    render(<BookmarkMenu {...defaultProps} />)
    expect(screen.getByTestId('trigger-button')).toBeInTheDocument()
  })

  it('shows all menu items for a normal bookmark', async () => {
    render(<BookmarkMenu {...defaultProps} />)
    const user = userEvent.setup()

    await user.click(screen.getByTestId('trigger-button'))

    expect(screen.getByText('Visit')).toBeInTheDocument()
    expect(screen.getByText('Copy URL')).toBeInTheDocument()
    expect(screen.getByText(/Pin|Unpin/)).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Archive')).toBeInTheDocument()
    expect(screen.queryByText('Delete Permanently')).not.toBeInTheDocument()
  })

  it('shows correct menu items for an archived bookmark', async () => {
    render(<BookmarkMenu {...defaultProps} bookmark={{ ...defaultBookmark, isArchived: true }} />)

    const user = userEvent.setup()
    await user.click(screen.getByTestId('trigger-button'))

    expect(screen.getByText('Visit')).toBeInTheDocument()
    expect(screen.getByText('Copy URL')).toBeInTheDocument()

    expect(screen.queryByText(/Pin|Unpin/)).not.toBeInTheDocument()
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()

    expect(screen.getByText('Unarchive')).toBeInTheDocument()
    expect(screen.getByText('Delete Permanently')).toBeInTheDocument()
  })

  it('calls onVisit when Visit is clicked', async () => {
    render(<BookmarkMenu {...defaultProps} />)
    const user = userEvent.setup()

    await user.click(screen.getByTestId('trigger-button'))
    await user.click(screen.getByText('Visit'))

    expect(defaultProps.onVisit).toHaveBeenCalledTimes(1)
  })

  it('calls onPin with toggled value when Pin is clicked', async () => {
    render(
      <BookmarkMenu
        {...defaultProps}
        canPin={true}
        bookmark={{ ...defaultBookmark, pinned: false, isArchived: false }}
      />,
    )

    const user = userEvent.setup()
    await user.click(screen.getByTestId('trigger-button'))
    await user.click(screen.getByText('Pin'))

    expect(defaultProps.onPin).toHaveBeenCalledTimes(1)
    expect(defaultProps.onPin).toHaveBeenCalledWith(true)
  })

  it('calls onPin with toggled value when Unpin is clicked', async () => {
    render(
      <BookmarkMenu
        {...defaultProps}
        canPin={true}
        bookmark={{ ...defaultBookmark, pinned: true, isArchived: false }}
      />,
    )

    const user = userEvent.setup()
    await user.click(screen.getByTestId('trigger-button'))
    await user.click(screen.getByText('Unpin'))

    expect(defaultProps.onPin).toHaveBeenCalledTimes(1)
    expect(defaultProps.onPin).toHaveBeenCalledWith(false)
  })

  it('disables Pin when canPin=false and bookmark is not pinned', async () => {
    render(
      <BookmarkMenu
        {...defaultProps}
        canPin={false}
        bookmark={{ ...defaultBookmark, pinned: false, isArchived: false }}
      />,
    )

    const user = userEvent.setup()
    await user.click(screen.getByTestId('trigger-button'))

    await user.click(screen.getByText('Pin'))
    expect(defaultProps.onPin).not.toHaveBeenCalled()
  })

  it('calls onEdit when Edit is clicked', async () => {
    render(<BookmarkMenu {...defaultProps} />)
    const user = userEvent.setup()

    await user.click(screen.getByTestId('trigger-button'))
    await user.click(screen.getByText('Edit'))

    expect(defaultProps.onEdit).toHaveBeenCalledTimes(1)
  })

  it('calls onArchive when Archive is clicked (not archived)', async () => {
    render(<BookmarkMenu {...defaultProps} bookmark={{ ...defaultBookmark, isArchived: false }} />)

    const user = userEvent.setup()
    await user.click(screen.getByTestId('trigger-button'))
    await user.click(screen.getByText('Archive'))

    expect(defaultProps.onArchive).toHaveBeenCalledTimes(1)
    expect(defaultProps.onUnarchive).not.toHaveBeenCalled()
  })

  it('calls onUnarchive when Unarchive is clicked (archived)', async () => {
    render(<BookmarkMenu {...defaultProps} bookmark={{ ...defaultBookmark, isArchived: true }} />)

    const user = userEvent.setup()
    await user.click(screen.getByTestId('trigger-button'))
    await user.click(screen.getByText('Unarchive'))

    expect(defaultProps.onUnarchive).toHaveBeenCalledTimes(1)
    expect(defaultProps.onArchive).not.toHaveBeenCalled()
  })

  it('calls onDelete when Delete Permanently is clicked (archived)', async () => {
    render(<BookmarkMenu {...defaultProps} bookmark={{ ...defaultBookmark, isArchived: true }} />)

    const user = userEvent.setup()
    await user.click(screen.getByTestId('trigger-button'))
    await user.click(screen.getByText('Delete Permanently'))

    expect(defaultProps.onDelete).toHaveBeenCalledTimes(1)
  })
})
