import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Input from './index'

describe('Input', () => {
  it('renders label and input with correct association', () => {
    render(<Input label="Name" helperText="" />)

    const input = screen.getByLabelText(/name/i)
    expect(input).toBeInTheDocument()
  })

  it('uses the id passed via props in the label htmlFor', () => {
    render(<Input label="Email" id="email-input" helperText="" />)

    const label = screen.getByText(/email/i)
    const input = screen.getByLabelText(/email/i)

    expect(label).toHaveAttribute('for', 'email-input')
    expect(input).toHaveAttribute('id', 'email-input')
  })

  it('shows required field asterisk next to the label', () => {
    render(<Input label="Title" helperText="" />)

    expect(screen.getByText(/\*/)).toBeInTheDocument()
  })

  it('displays helperText when showHelperText is true', () => {
    render(<Input label="Title" helperText="This field is required" showHelperText />)

    const helper = screen.getByRole('alert')
    expect(helper).toHaveTextContent('This field is required')
  })

  it('does not display helperText when showHelperText is false', () => {
    render(<Input label="Title" helperText="This field is required" showHelperText={false} />)

    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('renders search icon when showSearchIcon is true', () => {
    render(<Input label="Search" helperText="" showSearchIcon />)

    expect(screen.getByTestId('search-icon')).toBeInTheDocument()
  })

  it('applies error class when error is true', () => {
    render(<Input label="Title" helperText="" error />)

    const input = screen.getByLabelText(/title/i)
    expect(input).toHaveClass('border-red-700')
  })

  it('allows passing extra className and triggers onChange', async () => {
    const onChange = jest.fn()
    render(<Input label="Title" helperText="" className="extra-class" onChange={onChange} />)

    const input = screen.getByLabelText(/title/i)
    expect(input).toHaveClass('extra-class')

    const user = userEvent.setup()
    await user.type(input, 'Hello')

    expect(onChange).toHaveBeenCalled()
  })
})
