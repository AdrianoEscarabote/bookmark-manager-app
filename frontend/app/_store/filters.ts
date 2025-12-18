import { create } from 'zustand'

export type SortValue = 'recently_added' | 'recently_visited' | 'most_visited'

export type FiltersState = {
  searchQuery: string
  sort: SortValue
  setSort: (v: SortValue) => void
  setSearchQuery: (q: string) => void

  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
  toggleTag: (tag: string, checked?: boolean) => void
  clearTags: () => void
}

export const useFiltersStore = create<FiltersState>()((set, get) => ({
  searchQuery: '',
  sort: 'recently_added',
  setSort: (sort) => set({ sort }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  selectedTags: [],
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  clearTags: () => set({ selectedTags: [] }),

  toggleTag: (tag, checked) => {
    const { selectedTags } = get()
    const isSelected = selectedTags.includes(tag)
    const nextChecked = checked ?? !isSelected

    set({
      selectedTags: nextChecked
        ? Array.from(new Set([...selectedTags, tag]))
        : selectedTags.filter((t) => t !== tag),
    })
  },
}))
