import { useFiltersStore } from '@/app/_store/filters'

import Input from '../input'

const SearchInput = () => {
  const searchQuery = useFiltersStore((state) => state.searchQuery)
  const setSearchQuery = useFiltersStore((state) => state.setSearchQuery)

  return (
    <Input
      helperText=""
      label=""
      showSearchIcon
      placeholder="Search by title..."
      className="max-w-[20rem]"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  )
}

export default SearchInput
