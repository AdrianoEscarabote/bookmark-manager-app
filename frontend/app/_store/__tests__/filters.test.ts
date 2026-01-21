describe('useFiltersStore', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('toggleTag adds and removes tags', async () => {
    const { useFiltersStore } = await import('../filters')

    expect(useFiltersStore.getState().selectedTags).toEqual([])

    useFiltersStore.getState().toggleTag('react', true)
    expect(useFiltersStore.getState().selectedTags).toEqual(['react'])

    useFiltersStore.getState().toggleTag('react', false)
    expect(useFiltersStore.getState().selectedTags).toEqual([])
  })

  it('toggleTag without checked toggles state', async () => {
    const { useFiltersStore } = await import('../filters')

    useFiltersStore.getState().toggleTag('next') // add
    expect(useFiltersStore.getState().selectedTags).toEqual(['next'])

    useFiltersStore.getState().toggleTag('next') // remove
    expect(useFiltersStore.getState().selectedTags).toEqual([])
  })

  it('clearTags clears everything', async () => {
    const { useFiltersStore } = await import('../filters')

    useFiltersStore.setState({ selectedTags: ['a', 'b'] })
    useFiltersStore.getState().clearTags()
    expect(useFiltersStore.getState().selectedTags).toEqual([])
  })
})
