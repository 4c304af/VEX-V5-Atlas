import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.atlasDesktop = {
      platform: 'macos', applicationUpdates: 'manual', automaticUpdatesEnabled: false,
      minimize() {}, maximize() {}, close() {}, openSource: async () => true,
      copyText: async text => { localStorage.setItem('mac-clipboard', text); return true; },
      openApplicationUpdate: () => { localStorage.setItem('mac-download-opened', 'true'); },
      runAutoUpdates: async () => ({ checkedAt: new Date().toISOString(), documents: { status: 'current' }, application: { status: 'available', version: '1.2.0' } }),
    };
    document.addEventListener('DOMContentLoaded', () => {
      document.documentElement.dataset.platform = 'macos';
      document.documentElement.dataset.nativeFrame = 'true';
    });
  });
});

test('Mac shortcuts and native clipboard work without a browser clipboard permission', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.sidebar-search kbd')).toHaveText('⌘ K');
  await expect(page.locator('.shortcut-button kbd')).toHaveText('⌘ K');
  await expect(page.locator('.titlebar')).toBeHidden();
  await page.keyboard.press('Meta+k');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('textbox', { name: '搜索 API' }).fill('spinFor');
  await page.locator('.search-result').filter({ hasText: '电机与电机组' }).click();
  const code = page.locator('.doc-content pre code').first();
  await expect(code).toBeVisible();
  await page.locator('.copy-code').first().click();
  expect(await page.evaluate(() => localStorage.getItem('mac-clipboard'))).toBe(await code.textContent());
  await expect(page.getByRole('status')).toContainText('代码已复制');
});

test('Mac application updates offer a download and never describe a Windows replacement', async ({ page }) => {
  await page.goto('/#updates');
  await expect(page.getByRole('switch', { name: '检查程序更新', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '立即同步并检查新版' }).click();
  await expect(page.locator('.auto-update-results')).toContainText('1.2.0');
  await expect(page.locator('.auto-update-results')).toContainText('应用程序');
  await expect(page.getByRole('button', { name: '重启并更新' })).toHaveCount(0);
  await page.getByRole('button', { name: '下载 Mac 新版' }).click();
  expect(await page.evaluate(() => localStorage.getItem('mac-download-opened'))).toBe('true');
  await expect(page.locator('.update-ready-badge')).toHaveText('新版');
});
