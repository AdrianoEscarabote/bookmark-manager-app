/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Bookmark } from '../../_store/bookmarks'

const mockApiGet = jest.fn()

jest.mock('@/utils/api', () => ({
  api: {
    get: (...args: any[]) => mockApiGet(...args),
  },
}))

const mockIsDemoModeClient = jest.fn()
const mockHydrateDemoBookmarks = jest.fn()
const mockSaveDemoBookmarks = jest.fn()

jest.mock('@/app/_lib/demo-bookmarks', () => ({
  isDemoModeClient: () => mockIsDemoModeClient(),
  hydrateDemoBookmarks: () => mockHydrateDemoBookmarks(),
  saveDemoBookmarks: (...args: any[]) => mockSaveDemoBookmarks(...args),
}))

describe('useBookmarksStore', () => {
  beforeEach(() => {
    jest.resetModules()
    mockApiGet.mockReset()
    mockIsDemoModeClient.mockReset()
    mockHydrateDemoBookmarks.mockReset()
    mockSaveDemoBookmarks.mockReset()
  })

  it('fetch() in demo mode hydrates from local storage and sets source=demo', async () => {
    mockIsDemoModeClient.mockReturnValue(true)

    const demoItems: Bookmark[] = [
      {
        id: '1',
        title: 'Demo',
        url: 'https://example.com',
        favicon: 'x',
        description: 'd',
        tags: ['t1'],
        pinned: false,
        isArchived: false,
        visitCount: 0,
        createdAt: new Date().toISOString(),
        lastVisited: null,
      },
    ]

    mockHydrateDemoBookmarks.mockResolvedValue(demoItems)

    const { useBookmarksStore } = await import('../bookmarks')

    await useBookmarksStore.getState().fetch()

    const s = useBookmarksStore.getState()
    expect(s.loading).toBe(false)
    expect(s.hydrated).toBe(true)
    expect(s.source).toBe('demo')
    expect(s.items).toEqual(demoItems)
    expect(mockApiGet).not.toHaveBeenCalled()
  })

  it('fetch() in api mode calls /bookmark/list and sets source=api', async () => {
    mockIsDemoModeClient.mockReturnValue(false)

    const apiItems: Bookmark[] = [
      {
        id: '1',
        title: 'API',
        url: 'https://example.com',
        favicon: 'x',
        description: 'd',
        tags: ['t1', 't2'],
        pinned: false,
        isArchived: false,
        visitCount: 2,
        createdAt: new Date().toISOString(),
        lastVisited: null,
      },
    ]

    mockApiGet.mockResolvedValue({ data: apiItems })

    const { useBookmarksStore } = await import('../bookmarks')

    await useBookmarksStore.getState().fetch()

    const s = useBookmarksStore.getState()
    expect(mockApiGet).toHaveBeenCalledWith('/bookmark/list')
    expect(s.loading).toBe(false)
    expect(s.hydrated).toBe(true)
    expect(s.source).toBe('api')
    expect(s.items).toEqual(apiItems)
  })

  it('fetch() with 401 resets hydrated=false (to allow app redirect)', async () => {
    mockIsDemoModeClient.mockReturnValue(false)
    mockApiGet.mockRejectedValue({ response: { status: 401 } })

    const { useBookmarksStore } = await import('../bookmarks')

    useBookmarksStore.setState({
      items: [
        {
          id: 'x',
          title: 'x',
          url: 'https://x.com',
          favicon: 'x',
          description: 'x',
          tags: [],
          pinned: false,
          isArchived: false,
          visitCount: 0,
          createdAt: new Date().toISOString(),
          lastVisited: null,
        },
      ],
      hydrated: false,
      source: undefined,
      loading: false,
      error: 'old',
    })

    await useBookmarksStore.getState().fetch()

    const s = useBookmarksStore.getState()
    expect(s.loading).toBe(false)
    expect(s.hydrated).toBe(false)
    expect(s.error).toBeUndefined()
    expect(s.source).toBeUndefined()
  })

  it('togglePin respects PIN_LIMIT', async () => {
    const { useBookmarksStore, PIN_LIMIT } = await import('../bookmarks')

    const now = new Date().toISOString()
    const items: Bookmark[] = Array.from({ length: PIN_LIMIT + 1 }).map((_, i) => ({
      id: String(i + 1),
      title: `B${i + 1}`,
      url: 'https://example.com',
      favicon: 'x',
      description: 'd',
      tags: [],
      pinned: i < PIN_LIMIT,
      isArchived: false,
      visitCount: 0,
      createdAt: now,
      lastVisited: null,
    }))

    useBookmarksStore.setState({ items })

    const canPin = useBookmarksStore.getState().togglePin(String(PIN_LIMIT + 1))
    expect(canPin).toBe(false)

    const s = useBookmarksStore.getState()
    const pinnedCount = s.items.filter((b) => b.pinned).length
    expect(pinnedCount).toBe(PIN_LIMIT)
  })

  it('selectTags counts and sorts tags by label', async () => {
    const { selectTags } = await import('../bookmarks')

    const state = {
      items: [
        { id: '1', tags: ['z', 'a', 'a'] },
        { id: '2', tags: ['b', 'a'] },
      ],
    } as any

    expect(selectTags(state)).toEqual([
      { label: 'a', count: 3 },
      { label: 'b', count: 1 },
      { label: 'z', count: 1 },
    ])
  })
})
