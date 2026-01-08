import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Header from './index'

const toggleSidebarMock = jest.fn()

jest.mock('@/components/ui/sidebar', () => ({
  __esModule: true,
  useSidebar: () => ({
    toggleSidebar: toggleSidebarMock,
  }),
}))

jest.mock('@/components/ui/button', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}))

jest.mock('../search-input', () => ({
  __esModule: true,
  default: () => <div data-testid="search-input" />,
}))

jest.mock('../add-bookmark-dialog', () => ({
  __esModule: true,
  AddBookmarkDialog: () => <div data-testid="add-bookmark-dialog" />,
}))

jest.mock('../profile-menu', () => ({
  __esModule: true,
  default: () => <div data-testid="profile-menu" />,
}))

describe('Header', () => {
  beforeEach(() => {
    toggleSidebarMock.mockClear()
  })

  it('renders header with search input, add bookmark dialog and profile menu', () => {
    render(<Header />)

    expect(screen.getByTestId('search-input')).toBeInTheDocument()
    expect(screen.getByTestId('add-bookmark-dialog')).toBeInTheDocument()
    expect(screen.getByTestId('profile-menu')).toBeInTheDocument()
  })

  it('calls toggleSidebar when menu button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header />)

    const menuButton = screen.getByRole('button')
    await user.click(menuButton)

    expect(toggleSidebarMock).toHaveBeenCalledTimes(1)
  })
})
