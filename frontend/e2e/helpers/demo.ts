import { expect, Page } from '@playwright/test'

export async function enterDemo(page: Page) {
  await page.context().clearCookies()
  await page.goto('/sign-in')
  await page.evaluate(() => localStorage.clear())

  await page.getByRole('link', { name: /try demo mode/i }).click()
  await expect(page).not.toHaveURL(/\/sign-in/i)
}

export async function exitDemo(page: Page) {
  await page.goto('/demo/exit')
}
