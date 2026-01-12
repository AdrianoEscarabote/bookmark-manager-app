import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { BookmarkForm, type BookmarkFormValues } from './index'

describe('BookmarkForm', () => {
  const renderForm = (props?: Partial<BookmarkFormValues>) => {
    const onSubmit = jest.fn()
    const handleOpenChange = jest.fn()
    render(
      <BookmarkForm
        loading={false}
        defaultValues={props}
        submitLabel="Add Bookmark"
        onSubmit={onSubmit}
        handleOpenChange={handleOpenChange}
      />,
    )
    return { onSubmit, handleOpenChange }
  }

  it('renders all fields and the submit button with the correct label', () => {
    renderForm()

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/website url/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add bookmark/i })).toBeInTheDocument()
  })

  it('fills with defaultValues when provided', () => {
    renderForm({
      title: 'My title',
      description: 'My desc',
      url: 'https://example.com',
      tags: 'one, two',
    })

    expect(screen.getByLabelText<HTMLInputElement>(/title/i).value).toBe('My title')
    expect(screen.getByLabelText<HTMLTextAreaElement>(/description/i).value).toBe('My desc')
    expect(screen.getByLabelText<HTMLInputElement>(/website url/i).value).toBe(
      'https://example.com',
    )
    expect(screen.getByLabelText<HTMLInputElement>(/tags/i).value).toBe('one, two')
  })

  it('calls onSubmit with valid values on submit', async () => {
    const { onSubmit } = renderForm()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/title/i), 'Title')
    await user.type(screen.getByLabelText(/description/i), 'Some description')
    await user.type(screen.getByLabelText(/website url/i), 'https://example.com')
    await user.type(screen.getByLabelText(/tags/i), 'design')

    await user.click(screen.getByRole('button', { name: /add bookmark/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)

      const [values] = onSubmit.mock.calls[0]
      expect(values).toEqual({
        title: 'Title',
        description: 'Some description',
        url: 'https://example.com',
        tags: 'design',
      })
    })
  })

  it('shows error messages when required fields are empty', async () => {
    renderForm()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /add bookmark/i }))

    expect(await screen.findAllByRole('alert')).not.toHaveLength(0)
    expect(screen.getByText(/title is required/i)).toBeInTheDocument()
    expect(screen.getByText(/description is required/i)).toBeInTheDocument()
    expect(screen.getByText(/url is required/i)).toBeInTheDocument()
    expect(screen.getByText(/at least one tag is required/i)).toBeInTheDocument()
  })

  it('formats the tags field by inserting a comma when pressing space', async () => {
    renderForm()
    const user = userEvent.setup()
    const tagsInput = screen.getByLabelText<HTMLInputElement>(/tags/i)

    await user.type(tagsInput, 'design ')
    expect(tagsInput.value).toBe('design, ')
  })

  it('calls handleOpenChange(false) when clicking Cancel', async () => {
    const { handleOpenChange } = renderForm()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(handleOpenChange).toHaveBeenCalledWith(false)
  })
})
