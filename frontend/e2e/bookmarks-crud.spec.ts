/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, Locator, Page, test } from '@playwright/test'

import { enterDemo } from './helpers/demo'

async function clickFirst(page: Page, candidates: Array<() => Locator | any>) {
  for (const getLocator of candidates) {
    const loc = getLocator() as any
    if (await loc.count().catch(() => 0)) {
      await loc.first().click()
      return
    }
  }
  throw new Error('Could not find any matching clickable element for the provided candidates.')
}

async function fillFirst(page: Page, candidates: Array<() => Locator | any>, value: string) {
  for (const getLocator of candidates) {
    const loc = getLocator() as any
    if (await loc.count().catch(() => 0)) {
      await loc.first().fill(value)
      return
    }
  }
  throw new Error('Could not find any matching input for the provided candidates.')
}

async function waitForCards(page: Page) {
  await expect(page.locator('article').first()).toBeVisible()
}

function cardByTitle(page: Page, title: string) {
  return page.locator('article', { hasText: title }).first()
}

async function openAddBookmark(page: Page) {
  await clickFirst(page, [
    () => page.getByRole('button', { name: /add bookmark/i }),
    () => page.getByRole('button', { name: /add/i }),
  ])
  await expect(page.getByRole('dialog')).toBeVisible()
}

async function submitDialog(page: Page) {
  await clickFirst(page, [
    () => page.getByRole('button', { name: /^Add Bookmark$/i }),
    () => page.getByRole('button', { name: /^Save changes$/i }),
    () => page.getByRole('button', { name: /^Save$/i }),
  ])
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

async function confirmDialog(page: Page, buttonLabel: RegExp) {
  const dlg = page.getByRole('dialog')
  await expect(dlg).toBeVisible()
  await dlg.getByRole('button', { name: buttonLabel }).click()
  await expect(dlg).toHaveCount(0)
}

test('creates, edits, archives and removes a bookmark (demo mode)', async ({ page }) => {
  await enterDemo(page)
  await waitForCards(page)

  const unique = Date.now()
  const title = `Playwright Bookmark ${unique}`
  const url = `https://example.com/${unique}`
  const description = 'Created by Playwright e2e'
  const tags = 'playwright, e2e'

  await openAddBookmark(page)

  const dlg = page.getByRole('dialog')
  await expect(dlg).toBeVisible()

  await dlg.getByTestId('bookmark-title').fill(title)
  await dlg.getByTestId('bookmark-url').fill(url)

  if (await dlg.getByTestId('bookmark-description').count()) {
    await dlg.getByTestId('bookmark-description').fill(description)
  }
  if (await dlg.getByTestId('bookmark-tags').count()) {
    await dlg.getByTestId('bookmark-tags').fill(tags)
  }

  await submitDialog(page)

  await expect(cardByTitle(page, title)).toBeVisible()

  const editedTitle = `${title} (edited)`

  {
    const card = cardByTitle(page, title)
    await openMenu(card)
    await clickMenuItem(page, /^Edit$/i)

    await expect(page.getByRole('dialog')).toBeVisible()
    await fillFirst(
      page,
      [() => page.getByLabel(/title/i), () => page.getByPlaceholder(/title/i)],
      editedTitle,
    )
    await submitDialog(page)
  }

  await expect(cardByTitle(page, editedTitle)).toBeVisible()

  {
    const card = cardByTitle(page, editedTitle)
    await openMenu(card)
    await clickMenuItem(page, /^Archive$/i)
    await confirmDialog(page, /^Archive$/i)
  }

  await expect(cardByTitle(page, editedTitle)).toHaveCount(0)

  await page.goto('/archived')
  await waitForCards(page)
  await expect(cardByTitle(page, editedTitle)).toBeVisible()

  {
    const card = cardByTitle(page, editedTitle)
    await openMenu(card)
    await clickMenuItem(page, /^Delete Permanently$/i)
    await confirmDialog(page, /^Delete permanently$/i)
  }

  await expect(cardByTitle(page, editedTitle)).toHaveCount(0)
})
