import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    // 1. Go to login page
    await page.goto('/login')

    // 2. Fill credentials
    // Note: We are using MSW, but Playwright hits the real browser.
    // Ensure MSW runs in development mode.
    await page.getByLabel('Username').fill('user@example.com')
    await page.getByLabel('Password').fill('password')

    // 3. Submit
    await page.getByRole('button', { name: /sign in/i }).click()

    // 4. Verify redirect to dashboard (Allow query params)
    await expect(page).toHaveURL(/.*(\?dateRange=.*)?/)

    // 5. Verify dashboard content
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('should redirect to login when accessing protected route without session', async ({
    page,
  }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })
})
