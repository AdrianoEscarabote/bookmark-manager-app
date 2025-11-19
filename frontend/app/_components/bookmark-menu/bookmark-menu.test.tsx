import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { BookmarkMenu } from './index'

describe('BookmarkMenu', () => {
  const defaultProps = {
    url: 'https://example.com',
    onVisit: jest.fn(),
    onCopyUrl: jest.fn(),
    onPinToggle: jest.fn(),
    onEdit: jest.fn(),
    onArchiveToggle: jest.fn(),
    onDelete: jest.fn(),
  }

  it('renders the trigger button', () => {
    render(<BookmarkMenu {...defaultProps} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows all menu items for a normal bookmark', async () => {
    render(<BookmarkMenu {...defaultProps} />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button'))
    expect(await screen.findByText('Visit')).toBeInTheDocument()
    expect(screen.getByText('Copy URL')).toBeInTheDocument()
    expect(screen.getByText(/Pin|Unpin/)).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText(/Archive/)).toBeInTheDocument()
    expect(screen.queryByText('Delete Permanently')).not.toBeInTheDocument()
  })

  it('shows correct menu items for an archived bookmark', async () => {
    render(<BookmarkMenu {...defaultProps} isArchived />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button'))
    expect(await screen.findByText('Visit')).toBeInTheDocument()
    expect(screen.getByText('Copy URL')).toBeInTheDocument()
    expect(screen.queryByText(/Pin|Unpin/)).not.toBeInTheDocument()
    expect(screen.getByText(/Unarchive/)).toBeInTheDocument()
    expect(screen.getByText('Delete Permanently')).toBeInTheDocument()
  })

  it('calls onVisit when Visit is clicked', async () => {
    render(<BookmarkMenu {...defaultProps} />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button'))
    await user.click(await screen.findByText('Visit'))
    expect(defaultProps.onVisit).toHaveBeenCalled()
  })

  it('calls onCopyUrl when Copy URL is clicked', async () => {
    render(<BookmarkMenu {...defaultProps} />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button'))
    await user.click(await screen.findByText('Copy URL'))
    expect(defaultProps.onCopyUrl).toHaveBeenCalled()
  })

  it('calls onPinToggle when Pin/Unpin is clicked', async () => {
    render(<BookmarkMenu {...defaultProps} isPinned={false} />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button'))
    await user.click(await screen.findByText('Pin'))
    expect(defaultProps.onPinToggle).toHaveBeenCalledWith(true)
  })

  it('calls onEdit when Edit is clicked', async () => {
    render(<BookmarkMenu {...defaultProps} />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button'))
    await user.click(await screen.findByText('Edit'))
    expect(defaultProps.onEdit).toHaveBeenCalled()
  })

  it('calls onArchiveToggle when Archive/Unarchive is clicked', async () => {
    render(<BookmarkMenu {...defaultProps} isArchived={false} />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button'))
    await user.click(await screen.findByText('Archive'))
    expect(defaultProps.onArchiveToggle).toHaveBeenCalledWith(true)
  })

  it('calls onDelete when Delete Permanently is clicked', async () => {
    render(<BookmarkMenu {...defaultProps} isArchived />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button'))
    await user.click(await screen.findByText('Delete Permanently'))
    expect(defaultProps.onDelete).toHaveBeenCalled()
  })
})
