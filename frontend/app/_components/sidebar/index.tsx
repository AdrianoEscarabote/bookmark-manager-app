'use client'

import { Archive, Home, X } from 'lucide-react'

import { useBookmarksStore } from '@/app/_store/bookmarks'
import { useFiltersStore } from '@/app/_store/filters'
import Logo from '@/components/ui/icons/logo'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import useBookmarkTags from '@/hooks/use-bookmark-tags'

import NavItem from '../nav-item'
import Tag from '../tag'
import TagSkeleton from '../tag/tag-skeleton'

export function AppSidebar() {
  const tags = useBookmarkTags()
  const selectedTags = useFiltersStore((s) => s.selectedTags)
  const toggleTag = useFiltersStore((s) => s.toggleTag)
  const { toggleSidebar } = useSidebar()

  const hydrated = useBookmarksStore((s) => s.hydrated)
  const loading = useBookmarksStore((s) => s.loading)

  return (
    <Sidebar className="w-full max-w-74 border-r border-neutral-300 dark:border-neutral-600">
      <SidebarContent className="bg-neutral-0 relative w-full max-w-74 overflow-hidden dark:bg-neutral-800">
        <SidebarHeader className="p-5 pb-2.5">
          <Logo className="dark:text-neutral-0 text-neutral-900" />
          <button
            onClick={toggleSidebar}
            className="absolute top-3 right-3 grid h-8 w-8 cursor-pointer place-content-center md:hidden"
            data-testid="close-button"
          >
            <X className="dark:text-neutral-0 size-5 text-neutral-900" />
          </button>
        </SidebarHeader>

        <SidebarGroup className="flex flex-col gap-4 p-4 pt-0 pb-5">
          <SidebarMenu className="flex flex-col gap-0.5">
            <SidebarMenuItem>
              <div
                onClick={() => {
                  if (typeof window !== 'undefined' && window.innerWidth < 768) toggleSidebar()
                }}
                className="block"
              >
                <NavItem href={'/'} icon={<Home className="size-5" />} label="Home" />
              </div>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <div
                onClick={() => {
                  if (typeof window !== 'undefined' && window.innerWidth < 768) toggleSidebar()
                }}
                className="block"
              >
                <NavItem
                  href={'/archived'}
                  icon={<Archive className="size-5" />}
                  label="Archived"
                />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarGroupContent className="flex flex-col gap-0.5">
            <SidebarGroupLabel className="text-preset-5 text-neutral-900 uppercase dark:text-neutral-100">
              Tags
            </SidebarGroupLabel>

            <ScrollArea className="max-h-[calc(100vh-13.75rem)]">
              {!hydrated || loading ? (
                <div className="flex flex-col gap-0.5">
                  <TagSkeleton labelWidthClassName="w-16" />
                  <TagSkeleton labelWidthClassName="w-24" />
                  <TagSkeleton labelWidthClassName="w-20" />
                  <TagSkeleton labelWidthClassName="w-28" />
                  <TagSkeleton labelWidthClassName="w-14" />
                  <TagSkeleton labelWidthClassName="w-16" />
                  <TagSkeleton labelWidthClassName="w-24" />
                  <TagSkeleton labelWidthClassName="w-16" />
                  <TagSkeleton labelWidthClassName="w-24" />
                  <TagSkeleton labelWidthClassName="w-20" />
                  <TagSkeleton labelWidthClassName="w-14" />
                  <TagSkeleton labelWidthClassName="w-16" />
                  <TagSkeleton labelWidthClassName="w-24" />
                  <TagSkeleton labelWidthClassName="w-20" />
                  <TagSkeleton labelWidthClassName="w-28" />
                  <TagSkeleton labelWidthClassName="w-14" />
                </div>
              ) : (
                tags.map((t) => (
                  <Tag
                    key={t.label}
                    label={t.label}
                    count={t.count}
                    checked={selectedTags.includes(t.label)}
                    onCheckedChange={(checked) => toggleTag(t.label, checked)}
                  />
                ))
              )}
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
