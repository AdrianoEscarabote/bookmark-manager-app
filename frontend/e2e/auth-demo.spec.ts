import { expect, test } from '@playwright/test'

import { enterDemo, exitDemo } from './helpers/demo'

test('enters demo mode and accesses the home page', async ({ page }) => {
  await enterDemo(page)

  await expect(page).toHaveURL(/\/(?!sign-in)/)
})

test('exits demo mode and requires auth again', async ({ page }) => {
  await enterDemo(page)
  await exitDemo(page)

  await page.goto('/')
  await expect(page).toHaveURL(/\/sign-in/i)
})
