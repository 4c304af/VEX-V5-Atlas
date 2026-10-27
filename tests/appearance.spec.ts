import { test, expect, type Locator } from '@playwright/test';
import { ACCENTS, accentPalette, contrast } from '../src/theme';

async function textContrast(locator: Locator) {
  return locator.evaluateAll(elements => elements.map(element => {
    const rgb = (value: string) => (value.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
    const luminance = (value: string) => rgb(value).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
      .reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
    let parent: Element | null = element;
    let background = 'rgba(0, 0, 0, 0)';
    while (parent) {
      background = getComputedStyle(parent).backgroundColor;
      if (background !== 'rgba(0, 0, 0, 0)') break;
      parent = parent.parentElement;
    }
    const fg = luminance(getComputedStyle(element).color), bg = luminance(background);
    return { text: element.textContent?.slice(0, 50), ratio: (Math.max(fg, bg) + .05) / (Math.min(fg, bg) + .05) };
  }));
}

test('preset and custom palettes keep text and buttons above 4.5:1 in both themes', () => {
  const seeds = ['#000000', '#ffffff', '#ffff00', '#00ff00', '#0000ff', '#ff00ff', '#808080', '#fa12ab'];
  for (const dark of [false, true]) {
    for (const [accent, color] of [...ACCENTS.map(a => [a.id, a.color]), ...seeds.map(color => ['custom', color])]) {
      const palette = accentPalette(accent, color, dark);
      for (const bg of [palette['--primary-container'], palette['--primary-soft'], dark ? '#26352a' : '#ebeee5', dark ? '#1b2720' : '#fffefa']) {
        expect(contrast(palette['--primary'], bg), `${accent}/${color}/${dark}`).toBeGreaterThanOrEqual(4.5);
      }
      expect(contrast(palette['--primary'], palette['--on-primary'])).toBeGreaterThanOrEqual(4.5);
    }
  }
});

test('dark headings, labels and all code token colors remain readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#settings');
  await page.getByRole('button', { name: '深色', exact: true }).click();
  await expect(page.locator('html')).toHaveCSS('color', 'rgb(224, 232, 217)');
  for (const preset of ['翡翠', '鸢尾', '陶土']) {
    await page.getByRole('button', { name: preset, exact: true }).click();
    const samples = await textContrast(page.locator('.settings-title h2, .settings-title p, .about-panel h2, .accent-preview-tag, .accent-preview-button, .nav-item.active'));
    for (const sample of samples) expect(sample.ratio, `${preset}: ${sample.text}`).toBeGreaterThanOrEqual(4.5);
  }
  await page.goto('/#doc/Motors_and_MotorControllers/motor_and_motor_group');
  await expect(page.locator('pre .token').first()).toBeVisible();
  const samples = await textContrast(page.locator('.reader-heading h1, pre .token, .copy-code, .reader-source-note p'));
  expect(samples.length).toBeGreaterThan(20);
  for (const sample of samples) expect(sample.ratio, sample.text).toBeGreaterThanOrEqual(4.5);
});

test('custom picker and hex input preview, validate, persist, follow system theme and reset', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
  await page.goto('/#settings');
  await page.getByRole('button', { name: '跟随系统', exact: true }).click();
  const picker = page.getByLabel('自定义强调色', { exact: true });
  const hex = page.getByRole('textbox', { name: '颜色值', exact: true });
  await picker.fill('#ffcc00');
  await expect(hex).toHaveValue('#ffcc00');
  await expect(page.locator('html')).toHaveAttribute('data-accent', 'custom');
  await hex.fill('');
  await hex.pressSequentially('#123456');
  await expect(picker).toHaveValue('#123456');
  await hex.fill('#abc');
  await hex.blur();
  await expect(hex).toHaveValue('#aabbcc');
  await hex.fill('#xyz');
  await expect(hex).toHaveAttribute('aria-invalid', 'true');
  await expect(picker).toHaveValue('#aabbcc');
  await expect(page.locator('#color-error')).toBeVisible();
  await page.reload();
  await expect(hex).toHaveValue('#aabbcc');
  const lightColor = await page.locator('.accent-preview-button').evaluate(el => getComputedStyle(el).backgroundColor);
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('.accent-preview-button')).not.toHaveCSS('background-color', lightColor);
  await page.setViewportSize({ width: 390, height: 850 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: 'screenshots/custom-colors-dark-narrow.png', fullPage: true });
  await page.getByRole('button', { name: '恢复默认', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-accent', 'jade');
  await expect(page.getByRole('button', { name: '翡翠', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(picker).toHaveValue('#006b57');
  await expect(hex).toHaveValue('#006b57');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-accent', 'jade');
  await expect(picker).toHaveValue('#006b57');
  await hex.focus();
  await hex.blur();
  await expect(page.locator('html')).toHaveAttribute('data-accent', 'jade');
});
