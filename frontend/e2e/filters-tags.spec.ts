import { expect, Page, test } from '@playwright/test'

import { enterDemo } from './helpers/demo'

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function waitForCards(page: Page) {
  await expect(page.locator('article').first()).toBeVisible()
}

async function getFirstCardTitle(page: Page) {
  const first = page.locator('article').first()
  await expect(first).toBeVisible()
  const title = (await first.locator('h3').first().textContent())?.trim()
  if (!title) throw new Error('Could not read first card title (h3).')
  return title
}

async function getFirstCardTag(page: Page) {
  const first = page.locator('article').first()
  await expect(first).toBeVisible()

  const tag = (await first.locator('span.rounded-sm').first().textContent())?.trim()
  if (!tag) throw new Error('Could not read first card tag (span.rounded-sm).')
  return tag
}

async function fillSearch(page: Page, value: string) {
  const candidates = [
    page.getByRole('textbox', { name: /search/i }),
    page.getByPlaceholder(/search/i),
    page.locator('input[type="search"]'),
    page.locator('input').filter({ hasText: '' }).first(),
  ]

  for (const loc of candidates) {
    if (await loc.count().catch(() => 0)) {
      await loc.first().fill(value)
      return
    }
  }

  throw new Error(
    'Search input not found. Add aria-label="Search" or placeholder containing "Search" to the search input.',
  )
}

async function clearSearch(page: Page) {
  await fillSearch(page, '')
}

async function checkSidebarTag(page: Page, tag: string) {
  const rx = new RegExp(`^${escapeRegExp(tag)}$`, 'i')

  const checkbox = page.getByRole('checkbox', { name: rx })
  if (await checkbox.count().catch(() => 0)) {
    await checkbox.first().check({ force: true })
    return
  }

  const tagText = page.getByText(rx).first()
  if (await tagText.count().catch(() => 0)) {
    await tagText.click({ force: true })
    return
  }

  throw new Error(
    `Could not find tag "${tag}" in sidebar. Consider adding accessible label or data-testid to Tag component.`,
  )
}

async function waitUntilAllCardsHaveTag(page: Page, tag: string) {
  await expect
    .poll(async () => {
      const cards = page.locator('article')
      const count = await cards.count()
      if (count === 0) return false

      for (let i = 0; i < count; i++) {
        const hasTag = await cards
          .nth(i)
          .locator('[data-testid="card-tag"]', { hasText: tag })
          .count()
        if (hasTag === 0) return false
      }
      return true
    })
    .toBe(true)
}

test('search filters cards and clearing search restores', async ({ page }) => {
  await enterDemo(page)
  await waitForCards(page)

  const initialCount = await page.locator('article').count()
  expect(initialCount).toBeGreaterThan(0)

  const title = await getFirstCardTitle(page)

  const query = title.slice(0, Math.min(6, title.length))
  await fillSearch(page, query)

  await expect(page.locator('article', { hasText: title }).first()).toBeVisible()

  const filteredCount = await page.locator('article').count()
  expect(filteredCount).toBeGreaterThan(0)
  expect(filteredCount).toBeLessThanOrEqual(initialCount)

  await clearSearch(page)
  await waitForCards(page)

  const restoredCount = await page.locator('article').count()
  expect(restoredCount).toBeGreaterThan(0)
})

test('selecting a tag filters cards to contain the tag', async ({ page }) => {
  await enterDemo(page)
  await waitForCards(page)

  const tag = await getFirstCardTag(page)

  await checkSidebarTag(page, tag)
  await waitForCards(page)

  await waitUntilAllCardsHaveTag(page, tag)
})
