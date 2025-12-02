import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useFiltersStore } from '@/app/_store/filters'

import { SortMenu } from './index'

describe('SortMenu', () => {
  const resetStore = () => useFiltersStore.setState({ sort: 'recently_added' })

  beforeEach(() => {
    resetStore()
  })

  function setup() {
    render(<SortMenu trigger={<button data-testid="sort-trigger">Sort</button>} />)
  }

  it('renders the trigger', () => {
    setup()
    expect(screen.getByTestId('sort-trigger')).toBeInTheDocument()
  })

  it('opens and lists all sort options', async () => {
    setup()

    const user = userEvent.setup()
    await user.click(screen.getByTestId('sort-trigger'))

    expect(await screen.findByText('Recently added')).toBeInTheDocument()
    expect(screen.getByText('Recently visited')).toBeInTheDocument()
    expect(screen.getByText('Most visited')).toBeInTheDocument()
  })

  it('calls onChange when selecting Recently visited', async () => {
    setup()

    const user = userEvent.setup()

    await user.click(screen.getByTestId('sort-trigger'))
    await user.click(await screen.findByText('Recently visited'))

    expect(useFiltersStore.getState().sort).toBe('recently_visited')
  })

  it('changes to most_visited when selecting Most visited', async () => {
    setup()

    const user = userEvent.setup()
    await user.click(screen.getByTestId('sort-trigger'))
    await user.click(await screen.findByText('Most visited'))

    expect(useFiltersStore.getState().sort).toBe('most_visited')
  })

  it('keeps current value highlighted (check icon) after open', async () => {
    setup()

    const user = userEvent.setup()
    await user.click(screen.getByTestId('sort-trigger'))

    expect(await screen.findByText('Recently added')).toBeInTheDocument()
  })
})
