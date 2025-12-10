import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Button from './index'

describe('Button', () => {
  it('renders as a button with the given text', () => {
    render(
      <Button hierarchy="primary" size="md">
        Click me
      </Button>,
    )

    const btn = screen.getByRole('button', { name: /click me/i })
    expect(btn).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = jest.fn()
    render(
      <Button hierarchy="primary" size="md" onClick={onClick}>
        Click
      </Button>,
    )

    await userEvent.click(screen.getByRole('button', { name: /click/i }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies correct size classes (sm, md, icon)', () => {
    const { rerender } = render(
      <Button hierarchy="primary" size="sm">
        Small
      </Button>,
    )
    let btn = screen.getByRole('button', { name: /small/i })
    expect(btn.className).toContain('px-3')
    expect(btn.className).toContain('py-2.5')

    rerender(
      <Button hierarchy="primary" size="md">
        Medium
      </Button>,
    )
    btn = screen.getByRole('button', { name: /medium/i })
    expect(btn.className).toContain('px-4')
    expect(btn.className).toContain('py-3')

    rerender(<Button hierarchy="primary" size="icon" aria-label="icon button" />)
    btn = screen.getByRole('button', { name: /icon button/i })
    expect(btn.className).toContain('size-8')
  })

  it('uses different visual variants for primary and secondary', () => {
    const { rerender } = render(
      <Button hierarchy="primary" size="md">
        Primary
      </Button>,
    )
    let btn = screen.getByRole('button', { name: /primary/i })
    expect(btn.className).toContain('bg-teal-700')

    rerender(
      <Button hierarchy="secondary" size="md">
        Secondary
      </Button>,
    )
    btn = screen.getByRole('button', { name: /secondary/i })
    expect(btn.className).toContain('border-neutral-400')
  })

  it('applies error styles when error=true', () => {
    const { rerender } = render(
      <Button hierarchy="primary" size="md" error>
        Primary error
      </Button>,
    )
    let btn = screen.getByRole('button', { name: /primary error/i })
    expect(btn.className).toContain('bg-red-700')

    rerender(
      <Button hierarchy="secondary" size="md" error>
        Secondary error
      </Button>,
    )
    btn = screen.getByRole('button', { name: /secondary error/i })
    expect(btn.className).toContain('border-red-800')
  })

  it('does not show icon when size != "icon" and showIcon=false', () => {
    render(
      <Button hierarchy="primary" size="md" showIcon={false}>
        No icon
      </Button>,
    )
    expect(screen.queryByTestId('icon-add')).toBeNull()
  })
})
