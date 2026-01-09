/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom'

import { fireEvent, render, screen } from '@testing-library/react'

import { ModeToggle } from './index'

const setThemeMock = jest.fn()

let resolvedThemeState: 'light' | 'dark' = 'light'

jest.mock('next-themes', () => ({
  __esModule: true,
  useTheme: () => ({
    resolvedTheme: resolvedThemeState,
    setTheme: setThemeMock,
  }),
}))

jest.mock('lucide-react', () => ({
  __esModule: true,
  Sun: (props: any) => <svg data-testid="sun-icon" {...props} />,
  Moon: (props: any) => <svg data-testid="moon-icon" {...props} />,
}))

describe('ModeToggle', () => {
  beforeEach(() => {
    setThemeMock.mockClear()
    resolvedThemeState = 'light'
  })

  it('renders a radiogroup with two radio buttons (Light/Dark)', () => {
    render(<ModeToggle />)

    expect(screen.getByRole('radiogroup', { name: /theme mode/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /light/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /dark/i })).toBeInTheDocument()

    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
  })

  it('marks the active option as aria-checked=true (light)', () => {
    resolvedThemeState = 'light'
    render(<ModeToggle />)

    expect(screen.getByRole('radio', { name: /light/i })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: /dark/i })).toHaveAttribute('aria-checked', 'false')
  })

  it('marks the active option as aria-checked=true (dark)', () => {
    resolvedThemeState = 'dark'
    render(<ModeToggle />)

    expect(screen.getByRole('radio', { name: /dark/i })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: /light/i })).toHaveAttribute('aria-checked', 'false')
  })

  it('calls setTheme("dark") when clicking Dark', () => {
    resolvedThemeState = 'light'
    render(<ModeToggle />)

    fireEvent.click(screen.getByRole('radio', { name: /dark/i }))
    expect(setThemeMock).toHaveBeenCalledWith('dark')
  })

  it('calls setTheme("light") when clicking Light', () => {
    resolvedThemeState = 'dark'
    render(<ModeToggle />)

    fireEvent.click(screen.getByRole('radio', { name: /light/i }))
    expect(setThemeMock).toHaveBeenCalledWith('light')
  })

  it('ArrowRight/ArrowLeft changes theme (keyboard)', () => {
    resolvedThemeState = 'light'
    render(<ModeToggle />)

    const group = screen.getByRole('radiogroup', { name: /theme mode/i })

    fireEvent.keyDown(group, { key: 'ArrowRight' })
    expect(setThemeMock).toHaveBeenCalledWith('dark')

    setThemeMock.mockClear()

    fireEvent.keyDown(group, { key: 'ArrowLeft' })
    expect(setThemeMock).toHaveBeenCalledWith('dark')
  })

  it('ArrowRight/ArrowLeft from dark changes theme to light', () => {
    resolvedThemeState = 'dark'
    render(<ModeToggle />)

    const group = screen.getByRole('radiogroup', { name: /theme mode/i })

    fireEvent.keyDown(group, { key: 'ArrowRight' })
    expect(setThemeMock).toHaveBeenCalledWith('light')
  })

  it('ignores other keys', () => {
    resolvedThemeState = 'light'
    render(<ModeToggle />)

    const group = screen.getByRole('radiogroup', { name: /theme mode/i })
    fireEvent.keyDown(group, { key: 'Enter' })

    expect(setThemeMock).not.toHaveBeenCalled()
  })
})
