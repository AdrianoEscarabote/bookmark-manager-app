/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'

import Toast from './index'

jest.mock('lucide-react', () => ({
  __esModule: true,
  ArchiveIcon: (props: any) => <svg data-testid="ArchiveIcon" {...props} />,
  CheckIcon: (props: any) => <svg data-testid="CheckIcon" {...props} />,
  CopyIcon: (props: any) => <svg data-testid="CopyIcon" {...props} />,
  PinIcon: (props: any) => <svg data-testid="PinIcon" {...props} />,
  Trash2Icon: (props: any) => <svg data-testid="Trash2Icon" {...props} />,
  Undo2Icon: (props: any) => <svg data-testid="Undo2Icon" {...props} />,
  XIcon: (props: any) => <svg data-testid="XIcon" {...props} />,
}))

jest.mock('sonner', () => {
  const toastFn = Object.assign(jest.fn(), { dismiss: jest.fn() })
  return {
    __esModule: true,
    toast: toastFn,
  }
})

describe('Toast', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders preset message and icon', () => {
    render(<Toast type="copied" />)

    expect(screen.getByText('Link copied to clipboard.')).toBeInTheDocument()
    expect(screen.getByTestId('CopyIcon')).toBeInTheDocument()
    expect(screen.getByTestId('XIcon')).toBeInTheDocument()
  })

  it('dismisses by id when t is provided', async () => {
    const user = userEvent.setup()
    render(<Toast type="copied" t="toast-id" />)

    await user.click(screen.getByRole('button'))
    expect((toast as any).dismiss).toHaveBeenCalledWith('toast-id')
  })

  it('dismisses without id when t is not provided', async () => {
    const user = userEvent.setup()
    render(<Toast type="copied" />)

    await user.click(screen.getByRole('button'))
    expect((toast as any).dismiss).toHaveBeenCalledWith()
  })
})
