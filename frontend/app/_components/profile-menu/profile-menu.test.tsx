/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ProfileMenu from './index'

const pushMock = jest.fn()
const resetMock = jest.fn()
const apiPostMock = jest.fn()

const setThemeMock = jest.fn()
jest.mock('next-themes', () => ({
  __esModule: true,
  useTheme: () => ({
    resolvedTheme: 'light',
    setTheme: setThemeMock,
  }),
}))

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: () => ({
    push: pushMock,
  }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img alt="Profile" {...props} />
  },
}))

jest.mock('@/utils/api', () => ({
  __esModule: true,
  api: {
    post: (...args: any[]) => apiPostMock(...args),
  },
}))

jest.mock('@/app/_store/bookmarks', () => {
  const fn: any = () => ({})
  fn.getState = () => ({ reset: resetMock })
  return {
    __esModule: true,
    useBookmarksStore: fn,
  }
})

jest.mock('@/components/ui/dropdown-menu', () => {
  const React = require('react') as typeof import('react')

  const Ctx = React.createContext<any>(null)

  function DropdownMenu({ children }: any) {
    const [open, setOpen] = React.useState(false)
    return <Ctx.Provider value={{ open, setOpen }}>{children}</Ctx.Provider>
  }

  function DropdownMenuTrigger({ children, asChild }: any) {
    const ctx = React.useContext(Ctx)
    const child = React.Children.only(children)

    const onClick = (e: any) => {
      child.props?.onClick?.(e)
      ctx.setOpen(true)
    }

    return asChild ? (
      React.cloneElement(child, { onClick })
    ) : (
      <button onClick={onClick}>{children}</button>
    )
  }

  function DropdownMenuContent({ children }: any) {
    const ctx = React.useContext(Ctx)
    if (!ctx.open) return null
    return <div data-testid="dropdown-content">{children}</div>
  }

  return {
    __esModule: true,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup: ({ children }: any) => <div>{children}</div>,
    DropdownMenuSeparator: () => <hr />,
  }
})

jest.mock('@/components/ui/button', () => ({
  __esModule: true,
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}))

jest.mock('@/components/ui/icons/icon-logout', () => ({
  __esModule: true,
  default: (props: any) => <svg data-testid="icon-logout" {...props} />,
}))
jest.mock('@/components/ui/icons/icon-theme', () => ({
  __esModule: true,
  default: (props: any) => <svg data-testid="icon-theme" {...props} />,
}))

jest.mock('../mode-toggle', () => ({
  __esModule: true,
  ModeToggle: () => {
    const { setTheme } = require('next-themes').useTheme()
    return (
      <div>
        <label>
          <input type="radio" name="theme" onChange={() => setTheme('light')} />
          Light
        </label>
        <label>
          <input type="radio" name="theme" onChange={() => setTheme('dark')} />
          Dark
        </label>
      </div>
    )
  },
}))

describe('ProfileMenu', () => {
  beforeEach(() => {
    pushMock.mockClear()
    resetMock.mockClear()
    apiPostMock.mockClear()
    setThemeMock.mockClear()
  })

  it('renders the profile trigger avatar', () => {
    render(<ProfileMenu />)
    expect(screen.getByTestId('profile-trigger')).toBeInTheDocument()
    expect(screen.getByAltText('Profile')).toBeInTheDocument()
  })

  it('opens the dropdown and shows user name + email', async () => {
    const user = userEvent.setup()
    render(<ProfileMenu />)

    await user.click(screen.getByTestId('profile-trigger'))

    expect(await screen.findByText('Emily carter')).toBeInTheDocument()
    expect(await screen.findByText('emily101@gmail.com')).toBeInTheDocument()
  })

  it('shows Theme label and the mode toggle radios when open', async () => {
    const user = userEvent.setup()
    render(<ProfileMenu />)

    await user.click(screen.getByTestId('profile-trigger'))

    expect(await screen.findByText('Theme')).toBeInTheDocument()
    const radios = await screen.findAllByRole('radio')
    expect(radios).toHaveLength(2)
  })

  it('logs out: calls API, resets store and redirects to /sign-in when status is 204', async () => {
    apiPostMock.mockResolvedValueOnce({ status: 204 })

    const user = userEvent.setup()
    render(<ProfileMenu />)

    await user.click(screen.getByTestId('profile-trigger'))
    await user.click(await screen.findByRole('button', { name: /logout/i }))

    expect(apiPostMock).toHaveBeenCalledWith('/auth/logout')
    expect(resetMock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith('/sign-in')
  })

  it('does not reset/redirect if logout status is not 204', async () => {
    apiPostMock.mockResolvedValueOnce({ status: 200 })

    const user = userEvent.setup()
    render(<ProfileMenu />)

    await user.click(screen.getByTestId('profile-trigger'))
    await user.click(await screen.findByRole('button', { name: /logout/i }))

    expect(apiPostMock).toHaveBeenCalledWith('/auth/logout')
    expect(resetMock).not.toHaveBeenCalled()
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('changes theme when selecting Dark', async () => {
    const user = userEvent.setup()
    render(<ProfileMenu />)

    await user.click(screen.getByTestId('profile-trigger'))
    await user.click(await screen.findByLabelText('Dark'))

    expect(setThemeMock).toHaveBeenCalledWith('dark')
  })
})
