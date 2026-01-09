/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'

import BookmarkHeader from './index'

let pathnameState = '/'
let searchQueryState = ''

jest.mock('next/navigation', () => ({
  __esModule: true,
  usePathname: () => pathnameState,
}))

jest.mock('@/app/_store/filters', () => ({
  __esModule: true,
  useFiltersStore: (selector: any) =>
    selector({
      searchQuery: searchQueryState,
    }),
}))

jest.mock('@/components/ui/icons/icon-sort', () => ({
  __esModule: true,
  default: (props: any) => <svg data-testid="icon-sort" {...props} />,
}))

jest.mock('../sort-menu', () => ({
  __esModule: true,
  SortMenu: ({ trigger }: any) => <div data-testid="sort-menu">{trigger}</div>,
}))

describe('BookmarkHeader', () => {
  beforeEach(() => {
    pathnameState = '/'
    searchQueryState = ''
  })

  it('shows "All Bookmarks" on "/" when searchQuery is empty', () => {
    pathnameState = '/'
    searchQueryState = ''

    render(<BookmarkHeader />)

    expect(screen.getByRole('heading', { level: 2, name: 'All Bookmarks' })).toBeInTheDocument()
  })

  it('shows "Archived bookmarks" on "/archived" when searchQuery is empty', () => {
    pathnameState = '/archived'
    searchQueryState = ''

    render(<BookmarkHeader />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Archived bookmarks' }),
    ).toBeInTheDocument()
  })

  it('shows search results header when searchQuery is not empty (regardless of route)', () => {
    pathnameState = '/archived'
    searchQueryState = 'react'

    render(<BookmarkHeader />)

    expect(screen.getByText('Results for:')).toBeInTheDocument()
    expect(screen.getByText('"react"')).toBeInTheDocument()
  })

  it('renders the sort trigger button', () => {
    render(<BookmarkHeader />)

    expect(screen.getByTestId('sort-menu')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sort by/i })).toBeInTheDocument()
    expect(screen.getByTestId('icon-sort')).toBeInTheDocument()
  })
})
