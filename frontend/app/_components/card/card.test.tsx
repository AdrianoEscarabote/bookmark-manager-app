/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'

import Card from './index'

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: any) => <img {...props} alt={props.alt} />,
}))

const baseProps = {
  id: '1',
  title: 'GitHub',
  url: 'https://www.github.com/openai',
  favicon: '/favicon.png',
  description: 'The world’s leading platform for version control',
  tags: ['Development', 'Tools'],
  pinned: false,
  isArchived: false,
  visitCount: 42,
  createdAt: '2025-02-15T12:00:00Z',
  lastVisited: '2025-08-16T12:00:00Z',
}

describe('Card', () => {
  it('renders title, favicon and hostname without protocol/www', () => {
    render(<Card bookmark={baseProps} />)

    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'GitHub' })).toHaveAttribute('src', '/favicon.png')
    expect(screen.getByText('github.com')).toBeInTheDocument()
  })

  it('renders description, tags and visit count', () => {
    render(<Card bookmark={baseProps} />)

    expect(screen.getByText('The world’s leading platform for version control')).toBeInTheDocument()

    expect(screen.getByText('Development')).toBeInTheDocument()
    expect(screen.getByText('Tools')).toBeInTheDocument()

    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('formats lastVisited and createdAt as "dd MMM" (en-GB)', () => {
    render(<Card bookmark={baseProps} />)

    expect(screen.getByText('16 Aug')).toBeInTheDocument()
    expect(screen.getByText('15 Feb')).toBeInTheDocument()
  })

  it('shows "-" when lastVisited is null', () => {
    render(<Card bookmark={{ ...baseProps, lastVisited: null }} />)
    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('parses hostname for URLs without protocol', () => {
    render(<Card bookmark={{ ...baseProps, url: 'github.com/openai/repo' }} />)
    expect(screen.getByText('github.com')).toBeInTheDocument()
  })
})
