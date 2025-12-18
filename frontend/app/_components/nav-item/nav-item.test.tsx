import { render, screen } from '@testing-library/react'

import NavItem from './index'

const usePathnameMock = jest.fn()
jest.mock('next/navigation', () => ({
  __esModule: true,
  usePathname: () => usePathnameMock(),
}))

describe('NavItem', () => {
  beforeEach(() => {
    usePathnameMock.mockReset()
  })

  const baseProps = {
    href: '/bookmarks',
    icon: <span data-testid="icon">I</span>,
    label: 'Bookmarks',
  }

  it('renders label and icon', () => {
    usePathnameMock.mockReturnValue('/any')
    render(<NavItem {...baseProps} />)

    expect(screen.getByText('Bookmarks')).toBeInTheDocument()
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('renders the link with the correct href', () => {
    usePathnameMock.mockReturnValue('/any')
    render(<NavItem {...baseProps} />)

    expect(screen.getByTestId('nav-item')).toHaveAttribute('href', '/bookmarks')
  })

  it('does not render count when not provided', () => {
    usePathnameMock.mockReturnValue('/any')
    render(<NavItem {...baseProps} />)

    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument()
  })

  it('renders count when it is a number', () => {
    usePathnameMock.mockReturnValue('/any')
    render(<NavItem {...baseProps} count={12} />)

    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('applies active classes when pathname === href', () => {
    usePathnameMock.mockReturnValue('/bookmarks')
    render(<NavItem {...baseProps} />)

    const link = screen.getByTestId('nav-item')
    expect(link.className).toContain('bg-neutral-100')
    expect(link.className).toContain('text-neutral-900')
    expect(link.className).toContain('dark:bg-neutral-600')
    expect(link.className).toContain('dark:text-neutral-0')
  })

  it('applies inactive classes when pathname !== href', () => {
    usePathnameMock.mockReturnValue('/other')
    render(<NavItem {...baseProps} />)

    const link = screen.getByTestId('nav-item')
    expect(link.className).toContain('bg-neutral-0')
    expect(link.className).toContain('text-neutral-800')
    expect(link.className).toContain('dark:bg-neutral-800')
    expect(link.className).toContain('dark:text-neutral-100')
  })

  it('concatenates extra className', () => {
    usePathnameMock.mockReturnValue('/other')
    render(<NavItem {...baseProps} className="custom-class" />)

    const link = screen.getByTestId('nav-item')
    expect(link.className).toContain('custom-class')
  })
})
