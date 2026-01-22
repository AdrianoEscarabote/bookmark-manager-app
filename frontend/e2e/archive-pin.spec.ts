import { expect, Locator, Page, test } from '@playwright/test'

import { enterDemo } from './helpers/demo'

function getFirstCard(page: Page) {
  return page.locator('article').first()
}

async function getCardTitle(page: Page) {
  const card = getFirstCard(page)
  await expect(card).toBeVisible()

  const heading = card.locator('h1,h2,h3,h4').first()
  const t = (await heading.textContent())?.trim()
  if (!t) throw new Error('Could not derive a card title from the first card.')
  return t
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
  const card = getFirstCard(page)
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

type TryPinResult = { kind: 'pinned' } | { kind: 'disabled' } | { kind: 'alreadyPinned' }

async function tryPinByIndex(page: Page, index: number): Promise<TryPinResult> {
  const card = page.locator('article').nth(index)
  await expect(card).toBeVisible()

  await openMenu(card)

  const pinItem = page.getByRole('menuitem', { name: /^Pin$/i })
  const unpinItem = page.getByRole('menuitem', { name: /^Unpin$/i })

  if (await unpinItem.count()) {
    await page.keyboard.press('Escape')
    return { kind: 'alreadyPinned' }
  }

  await expect(pinItem).toBeVisible()

  const ariaDisabled = await pinItem.getAttribute('aria-disabled')
  const dataDisabled = await pinItem.getAttribute('data-disabled')

  if (ariaDisabled === 'true' || dataDisabled !== null) {
    await page.keyboard.press('Escape')
    return { kind: 'disabled' }
  }

  await pinItem.click()
  return { kind: 'pinned' }
}

async function expectPinDisabledOnSomeCard(page: Page, startIndex = 0) {
  for (let i = startIndex; i < startIndex + 12; i++) {
    const card = page.locator('article').nth(i)
    if (!(await card.count())) break

    await openMenu(card)

    const pinItem = page.getByRole('menuitem', { name: /^Pin$/i })
    const unpinItem = page.getByRole('menuitem', { name: /^Unpin$/i })

    if (await unpinItem.count()) {
      await page.keyboard.press('Escape')
      continue
    }

    if (!(await pinItem.count())) {
      await page.keyboard.press('Escape')
      continue
    }

    const ariaDisabled = await pinItem.getAttribute('aria-disabled')
    const dataDisabled = await pinItem.getAttribute('data-disabled')

    expect(ariaDisabled === 'true' || dataDisabled !== null).toBe(true)
    await page.keyboard.press('Escape')
    return
  }

  throw new Error(
    'Could not find a non-pinned card with a visible Pin item to assert disabled state.',
  )
}

test('archives on home and appears in /archived; then unarchives and returns', async ({ page }) => {
  await enterDemo(page)

  const title = await getCardTitle(page)

  await archiveFirstCard(page)

  await page.goto('/archived')
  await expect(page.locator('article').first()).toBeVisible()
  await expect(page.locator('article', { hasText: title }).first()).toBeVisible()

  await unarchiveByTitle(page, title)
  await expect(page.locator('article', { hasText: title })).toHaveCount(0)

  await page.goto('/')

  await expect(page.locator('article', { hasText: title }).first()).toBeVisible()
})

test('enforces pin limit (PIN_LIMIT=3) by disabling the "Pin" menuitem', async ({ page }) => {
  await enterDemo(page)

  let pinned = 0
  let idx = 0

  while (pinned < 3 && idx < 12) {
    const res = await tryPinByIndex(page, idx)
    if (res.kind === 'pinned') pinned++
    idx++
  }

  await expectPinDisabledOnSomeCard(page, 0)
})
