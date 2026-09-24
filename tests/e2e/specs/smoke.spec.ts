import { expect, test } from '@playwright/test'

test('dashboard is available without horizontal page overflow', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Bonjour Jean/ })).toBeVisible()
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  expect(overflow).toBe(false)
})

test('mobile navigation opens as an accessible panel', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Scénario réservé au projet mobile')
  await page.goto('/')
  const menu = page.getByRole('button', { name: 'Ouvrir le menu' })
  await expect(menu).toBeVisible()
  await menu.click()
  await expect(page.locator('.sidebar.mobile-open')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Fermer le menu' })).toBeVisible()
})
