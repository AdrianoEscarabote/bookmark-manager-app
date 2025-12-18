import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import DescriptionField from './index'

describe('DescriptionField', () => {
  it('renders label and textarea wired by default id ("description")', () => {
    render(
      <DescriptionField
        label="Description"
        maxLength={120}
        currentLength={0}
        value=""
        onChange={() => {}}
      />,
    )

    expect(screen.getByText('Description')).toBeInTheDocument()

    const textarea = screen.getByLabelText('Description')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveAttribute('id', 'description')
    expect(textarea).toHaveAttribute('maxLength', '120')
  })

  it('supports custom id and passes props to the textarea', () => {
    const onChange = jest.fn()

    render(
      <DescriptionField
        id="custom-desc"
        label="Description"
        maxLength={50}
        currentLength={10}
        placeholder="Type here..."
        value="hello"
        onChange={onChange}
      />,
    )

    const textarea = screen.getByLabelText('Description')
    expect(textarea).toHaveAttribute('id', 'custom-desc')
    expect(textarea).toHaveAttribute('placeholder', 'Type here...')
    expect(textarea).toHaveValue('hello')
  })

  it('calls onChange when user types', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()

    render(
      <DescriptionField
        label="Description"
        maxLength={200}
        currentLength={0}
        value=""
        onChange={onChange}
      />,
    )

    const textarea = screen.getByLabelText('Description')
    await user.type(textarea, 'abc')

    expect(onChange).toHaveBeenCalled()
  })

  it('shows error message and applies error border classes when error is provided', () => {
    render(
      <DescriptionField
        label="Description"
        maxLength={120}
        currentLength={0}
        error="Required"
        value=""
        onChange={() => {}}
      />,
    )

    const error = screen.getByText('Required')
    expect(error).toHaveAttribute('aria-live', 'assertive')
    expect(error.className).toContain('text-red-600')
    expect(error.className).not.toContain('opacity-0')

    const textarea = screen.getByLabelText('Description')
    expect(textarea.className).toContain('border-red-700')
  })

  it('renders the error placeholder when no error and hides it with opacity', () => {
    render(
      <DescriptionField
        label="Description"
        maxLength={120}
        currentLength={0}
        value=""
        onChange={() => {}}
      />,
    )

    const placeholder = screen.getByText('placeholder')
    expect(placeholder).toHaveAttribute('aria-live', 'assertive')
    expect(placeholder.className).toContain('opacity-0')
  })

  it('renders the currentLength/maxLength counter', () => {
    render(
      <DescriptionField
        label="Description"
        maxLength={120}
        currentLength={34}
        value=""
        onChange={() => {}}
      />,
    )

    expect(screen.getByText('34/120')).toBeInTheDocument()
  })

  it('forwards ref to the underlying textarea element', () => {
    const ref = React.createRef<HTMLTextAreaElement>()

    render(
      <DescriptionField
        ref={ref}
        label="Description"
        maxLength={120}
        currentLength={0}
        value=""
        onChange={() => {}}
      />,
    )

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
    expect(ref.current).toHaveAttribute('id', 'description')
  })
})
