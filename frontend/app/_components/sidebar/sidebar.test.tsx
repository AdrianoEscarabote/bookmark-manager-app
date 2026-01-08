/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AppSidebar } from './index'

const mockToggleSidebar = jest.fn()
const mockToggleTag = jest.fn()

const mockTags = [
  { label: 'design', count: 2 },
  { label: 'tools', count: 5 },
]

let selectedTagsState: string[] = []

jest.mock('@/hooks/use-bookmark-tags', () => ({
  __esModule: true,
  default: jest.fn(() => mockTags),
}))

jest.mock('@/app/_store/filters', () => ({
  __esModule: true,
  useFiltersStore: (selector: any) =>
    selector({
      selectedTags: selectedTagsState,
      toggleTag: mockToggleTag,
    }),
}))

jest.mock('@/components/ui/icons/logo', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="logo" {...props} />,
}))

jest.mock('@/components/ui/scroll-area', () => ({
  __esModule: true,
  ScrollArea: ({ children }: any) => <div data-testid="scroll-area">{children}</div>,
}))

jest.mock('@/components/ui/sidebar', () => ({
  __esModule: true,
  Sidebar: ({ children }: any) => <aside data-testid="sidebar">{children}</aside>,
  SidebarContent: ({ children }: any) => <div data-testid="sidebar-content">{children}</div>,
  SidebarGroup: ({ children }: any) => <div data-testid="sidebar-group">{children}</div>,
  SidebarGroupContent: ({ children }: any) => (
    <div data-testid="sidebar-group-content">{children}</div>
  ),
  SidebarGroupLabel: ({ children }: any) => <div>{children}</div>,
  SidebarHeader: ({ children }: any) => <header>{children}</header>,
  SidebarMenu: ({ children }: any) => <nav>{children}</nav>,
  SidebarMenuItem: ({ children }: any) => <div>{children}</div>,
  useSidebar: () => ({ toggleSidebar: mockToggleSidebar }),
}))

jest.mock('../nav-item', () => ({
  __esModule: true,
  default: ({ href, label }: any) => (
    <a
      href={href}
      aria-label={label}
      onClick={(e) => {
        e.preventDefault()
      }}
    >
      {label}
    </a>
  ),
}))

jest.mock('../tag', () => ({
  __esModule: true,
  default: ({ label, count, checked, onCheckedChange }: any) => (
    <button
      type="button"
      aria-label={`tag-${label}`}
      data-checked={checked ? 'true' : 'false'}
      onClick={() => onCheckedChange(!checked)}
    >
      {label} ({count})
    </button>
  ),
}))

describe('AppSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    selectedTagsState = []
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true })
  })

  it('renders logo and main navigation links', () => {
    render(<AppSidebar />)

    expect(screen.getByTestId('logo')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Archived' })).toHaveAttribute('href', '/archived')

    expect(screen.getByText(/tags/i)).toBeInTheDocument()
  })

  it('renders tags from hook and marks selected tags as checked', () => {
    selectedTagsState = ['tools']

    render(<AppSidebar />)

    const design = screen.getByRole('button', { name: 'tag-design' })
    const tools = screen.getByRole('button', { name: 'tag-tools' })

    expect(design).toHaveAttribute('data-checked', 'false')
    expect(tools).toHaveAttribute('data-checked', 'true')

    expect(screen.getByText('design (2)')).toBeInTheDocument()
    expect(screen.getByText('tools (5)')).toBeInTheDocument()
  })

  it('calls toggleTag(label, checked) when a tag is toggled', async () => {
    selectedTagsState = [] // nenhum selecionado
    const user = userEvent.setup()

    render(<AppSidebar />)

    await user.click(screen.getByRole('button', { name: 'tag-design' }))

    expect(mockToggleTag).toHaveBeenCalledTimes(1)
    expect(mockToggleTag).toHaveBeenCalledWith('design', true)
  })

  it('calls toggleSidebar when close button is clicked', async () => {
    const user = userEvent.setup()

    render(<AppSidebar />)

    await user.click(screen.getByTestId('close-button'))

    expect(mockToggleSidebar).toHaveBeenCalledTimes(1)
  })

  it('toggles sidebar on nav click only on mobile (< 768px)', async () => {
    const user = userEvent.setup()

    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true })
    const { unmount } = render(<AppSidebar />)

    await user.click(screen.getByRole('link', { name: 'Home' }))
    expect(mockToggleSidebar).toHaveBeenCalledTimes(0)

    unmount()

    Object.defineProperty(window, 'innerWidth', { value: 375, writable: true })
    render(<AppSidebar />)

    await user.click(screen.getByRole('link', { name: 'Archived' }))
    expect(mockToggleSidebar).toHaveBeenCalledTimes(1)
  })
})
