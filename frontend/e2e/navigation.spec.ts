import { expect, Locator, Page, test } from '@playwright/test'

import { enterDemo } from './helpers/demo'

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

async function openMenu(card: Locator) {
  const trigger = card.locator('[data-testid="trigger-button"]').first()
  await expect(trigger).toBeVisible()
  await trigger.click()
}

async function clickMenuItem(page: Page, name: RegExp) {
  const item = page.getByRole('menuitem', { name })
  await expect(item).toBeVisible()
  await item.click()
}

async function archiveFirstCard(page: Page) {
  const card = page.locator('article').first()
  await expect(card).toBeVisible()

  await openMenu(card)
  await clickMenuItem(page, /^Archive$/i)

  await page.getByRole('button', { name: /^Archive$/i }).click()
}

async function unarchiveByTitle(page: Page, title: string) {
  const card = page.locator('article', { hasText: title }).first()
  await expect(card).toBeVisible()

  await openMenu(card)
  await clickMenuItem(page, /^Unarchive$/i)

  await page.getByRole('button', { name: /^Unarchive$/i }).click()
}

test('home -> archived -> home (via URLs) with archive/unarchive', async ({ page }) => {
  await enterDemo(page)

  await page.goto('/')
  await waitForCards(page)

  const title = await getFirstCardTitle(page)

  await archiveFirstCard(page)

  await page.goto('/archived')
  await waitForCards(page)
  await expect(page.locator('article', { hasText: title }).first()).toBeVisible()

  await unarchiveByTitle(page, title)
  await expect(page.locator('article', { hasText: title })).toHaveCount(0)

  await page.goto('/')
  await waitForCards(page)
  await expect(page.locator('article', { hasText: title }).first()).toBeVisible()
})
