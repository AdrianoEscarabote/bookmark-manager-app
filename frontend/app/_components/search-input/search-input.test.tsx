/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import SearchInput from './index'

const setSearchQueryMock = jest.fn()

jest.mock('@/app/_store/filters', () => {
  let state = { searchQuery: 'Flexbox' }
  const listeners = new Set<() => void>()

  const setSearchQuery = (value: string) => {
    setSearchQueryMock(value)
    state = { ...state, searchQuery: value }
    listeners.forEach((l) => l())
  }

  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  const getSnapshot = () => state

  return {
    __esModule: true,
    useFiltersStore: (selector: any) => {
      const snap = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
      return selector({ ...snap, setSearchQuery })
    },
  }
})

jest.mock('../input', () => ({
  __esModule: true,
  default: ({ value, onChange, placeholder }: any) => (
    <input value={value} onChange={onChange} placeholder={placeholder} />
  ),
}))

describe('SearchInput', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with placeholder', () => {
    render(<SearchInput />)
    expect(screen.getByPlaceholderText('Search by title...')).toBeInTheDocument()
  })

  it('uses the value from filters store', () => {
    render(<SearchInput />)
    expect(screen.getByPlaceholderText('Search by title...')).toHaveValue('Flexbox')
  })

  it('calls setSearchQuery when user types', async () => {
    const user = userEvent.setup()
    render(<SearchInput />)

    const input = screen.getByPlaceholderText('Search by title...')
    await user.clear(input)
    await user.type(input, 'AI')

    expect(setSearchQueryMock).toHaveBeenLastCalledWith('AI')
  })
})
