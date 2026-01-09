import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { BookmarkActionDialog } from './index'

function getConfirmButton(dialog: HTMLElement) {
  const buttons = within(dialog).getAllByRole('button')

  const confirm = buttons.find((b) => {
    const label = b.getAttribute('aria-label') ?? ''
    const text = (b.textContent ?? '').trim()
    return label !== 'Close' && text.toLowerCase() !== 'cancel'
  })

  if (!confirm) throw new Error('Confirm button not found')
  return confirm
}

describe('BookmarkActionDialog', () => {
  it('renders correct title/description/confirm label for Archive', () => {
    render(<BookmarkActionDialog action="archive" open />)

    const dlg = screen.getByRole('dialog')
    expect(within(dlg).getByText('Archive bookmark')).toBeInTheDocument()
    expect(
      within(dlg).getByText('Are you sure you want to archive this bookmark?'),
    ).toBeInTheDocument()
    expect(within(dlg).getByRole('button', { name: 'Archive' })).toBeInTheDocument()
    expect(within(dlg).getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('renders correct title/description/confirm label for Unarchive', () => {
    render(<BookmarkActionDialog action="unarchive" open />)

    const dlg = screen.getByRole('dialog')
    expect(within(dlg).getByText('Unarchive bookmark')).toBeInTheDocument()
    expect(
      within(dlg).getByText('Move this bookmark back to your active list?'),
    ).toBeInTheDocument()
    expect(within(dlg).getByRole('button', { name: 'Unarchive' })).toBeInTheDocument()
  })

  it('renders correct title/description/confirm label for Delete', () => {
    render(<BookmarkActionDialog action="delete" open />)

    const dlg = screen.getByRole('dialog')
    expect(within(dlg).getByText('Delete bookmark')).toBeInTheDocument()
    expect(
      within(dlg).getByText('Are you sure you want to delete this bookmark?'),
    ).toBeInTheDocument()
    expect(within(dlg).getByRole('button', { name: 'Delete permanently' })).toBeInTheDocument()
  })

  it('controlled: clicking Cancel calls onOpenChange(false)', async () => {
    const onOpenChange = jest.fn()
    const user = userEvent.setup()

    render(<BookmarkActionDialog action="archive" open onOpenChange={onOpenChange} />)

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('controlled: clicking Close (X) calls onOpenChange(false)', async () => {
    const onOpenChange = jest.fn()
    const user = userEvent.setup()

    render(<BookmarkActionDialog action="archive" open onOpenChange={onOpenChange} />)

    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('controlled: clicking Confirm awaits onConfirm and then calls onOpenChange(false)', async () => {
    const onOpenChange = jest.fn()
    const onConfirm = jest.fn(async () => undefined)
    const user = userEvent.setup()

    render(
      <BookmarkActionDialog
        action="archive"
        open
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
      />,
    )

    const dlg = screen.getByRole('dialog')
    await user.click(getConfirmButton(dlg))

    await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
  })

  it('disables confirm button when loading', () => {
    render(<BookmarkActionDialog action="delete" open loading />)

    const dlg = screen.getByRole('dialog')
    const confirmBtn = getConfirmButton(dlg)
    expect(confirmBtn).toBeDisabled()
  })
})
