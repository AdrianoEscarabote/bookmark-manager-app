import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { BookmarkActionDialog } from './index'

describe('BookmarkActionDialog', () => {
  const openDialog = async (name: string | RegExp) => {
    const user = userEvent.setup()
    await user.click(await screen.findByRole('button', { name }))
    return user
  }

  it('renders default trigger with correct label for each action', () => {
    const { rerender } = render(<BookmarkActionDialog action="archive" />)
    expect(screen.getByRole('button', { name: 'Archive' })).toBeInTheDocument()

    rerender(<BookmarkActionDialog action="unarchive" />)
    expect(screen.getByRole('button', { name: 'Unarchive' })).toBeInTheDocument()

    rerender(<BookmarkActionDialog action="delete" />)
    expect(screen.getByRole('button', { name: 'Delete permanently' })).toBeInTheDocument()
  })

  it('opens and shows title/description for Archive', async () => {
    render(<BookmarkActionDialog action="archive" />)
    const user = await openDialog('Archive')

    expect(await screen.findByText('Archive bookmark')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to archive this bookmark?')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(screen.queryByText('Archive bookmark')).not.toBeInTheDocument())
  })

  it('calls onConfirm and closes (uncontrolled)', async () => {
    const onConfirm = jest.fn()
    render(<BookmarkActionDialog action="archive" onConfirm={onConfirm} />)

    const user = await openDialog('Archive')

    await user.click(screen.getByRole('button', { name: 'Archive' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)

    await waitFor(() => expect(screen.queryByText('Archive bookmark')).not.toBeInTheDocument())
  })

  it('closes when clicking the X button', async () => {
    render(<BookmarkActionDialog action="archive" />)
    const user = await openDialog('Archive')

    await user.click(screen.getByLabelText('Close'))
    await waitFor(() => expect(screen.queryByText('Archive bookmark')).not.toBeInTheDocument())
  })

  it('disables confirm button when loading', () => {
    render(<BookmarkActionDialog action="delete" open loading />)

    const dlg = screen.getByRole('dialog')
    expect(within(dlg).getByText('Delete bookmark')).toBeInTheDocument()

    const confirmBtn = within(dlg).getByRole('button', { name: 'Processing…' })
    expect(confirmBtn).toBeDisabled()
  })

  it('controlled mode: calls onOpenChange when closing', async () => {
    const onOpenChange = jest.fn()
    render(<BookmarkActionDialog action="unarchive" open onOpenChange={onOpenChange} />)

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)

    await user.click(screen.getByLabelText('Close'))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('accepts custom trigger', async () => {
    render(
      <BookmarkActionDialog
        action="archive"
        trigger={<button data-testid="open-archive">Open</button>}
      />,
    )
  })
})
