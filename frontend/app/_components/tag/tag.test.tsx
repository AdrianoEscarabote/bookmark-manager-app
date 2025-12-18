import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Tag from './index'

describe('Tag', () => {
  it('renders the label text', () => {
    render(<Tag label="CSS" />)
    expect(screen.getByText('CSS')).toBeInTheDocument()
  })

  it('renders the counter when count is provided', () => {
    render(<Tag label="CSS" count={12} />)
    const badge = screen.getByLabelText('12 bookmarks')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('12')
  })

  it('does not render the counter when count is not provided', () => {
    render(<Tag label="CSS" />)
    expect(screen.queryByLabelText(/bookmarks/i)).not.toBeInTheDocument()
  })

  it('calls onCheckedChange when checked/unchecked', async () => {
    const user = userEvent.setup()
    const onCheckedChange = jest.fn()

    render(<Tag label="CSS" defaultChecked={false} onCheckedChange={onCheckedChange} />)

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    expect(onCheckedChange).toHaveBeenLastCalledWith(true)

    await user.click(checkbox)
    expect(onCheckedChange).toHaveBeenLastCalledWith(false)
  })

  it('does not call onCheckedChange when disabled', async () => {
    const user = userEvent.setup()
    const onCheckedChange = jest.fn()

    render(<Tag label="CSS" disabled onCheckedChange={onCheckedChange} />)

    await user.click(screen.getByRole('checkbox'))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
