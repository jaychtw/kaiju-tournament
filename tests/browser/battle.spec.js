import { test, expect } from '@playwright/test';

async function ready(page) {
  await page.goto('/');
  await expect(page.locator('#loading')).toBeHidden();
  await expect(page.locator('#fallback')).toBeHidden();
  // Software-rendered CI uses Eco; visual review separately captures High.
  if ((await page.locator('#quality').textContent()).includes('High')) await page.locator('#quality').click();
  await expect.poll(() => page.evaluate(() => window.wktDiagnostics?.().phase)).toBe('ready');
}
async function untilReady(page) {
  await expect.poll(() => page.evaluate(() => window.wktDiagnostics().phase), { timeout: 20000 }).toMatch(/ready|over/);
}
async function discretePresses(page, count) {
  await page.evaluate(n => {
    for (let i = 0; i < n; i++) {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true, cancelable: true }));
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space', bubbles: true }));
    }
  }, count);
}

test('3D starts without runtime errors; keyboard repeat is rejected; bilingual state persists', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await ready(page);
  await expect(page.locator('#attack')).toBeEnabled();
  await expect(page.locator('#player-hp')).toHaveText('200');
  await page.keyboard.press('KeyD');
  await expect(page.locator('#mash-panel')).toBeVisible();
  await page.keyboard.down('Space');
  await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', repeat: true, bubbles: true })));
  await expect(page.locator('#press-count')).toHaveText('1');
  await page.keyboard.up('Space');
  await discretePresses(page, 4);
  await expect(page.locator('#press-count')).toHaveText('5');
  await untilReady(page);
  await expect(page.locator('#player-hp')).toHaveText('130');
  await expect(page.locator('#enemy-hp')).toHaveText('185');
  await expect(page.locator('#defend')).toBeDisabled();
  await expect(page.locator('#attack-label')).toHaveText('Charged attack');
  await page.locator('#zh').click();
  await expect(page.locator('#attack-label')).toHaveText('蓄力攻擊');
  await expect(page.locator('#player-hp')).toHaveText('130');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hant');
  await page.reload();
  await expect(page.locator('#attack-label')).toHaveText('攻擊');
  await expect(page.locator('#player-hp')).toHaveText('200');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hant');
  expect(errors).toEqual([]);
});

test('Guard → charged Attack → Attack ends in a simultaneous draw; rematch resets everything', async ({ page }) => {
  await ready(page);
  await page.locator('#defend').click(); await untilReady(page);
  await expect(page.locator('#player-hp')).toHaveText('125');
  await page.locator('#attack').click(); await untilReady(page);
  await expect(page.locator('#player-hp')).toHaveText('50');
  await expect(page.locator('#enemy-hp')).toHaveText('50');
  await expect(page.locator('#defend')).toBeEnabled();
  await page.locator('#attack').click(); await untilReady(page);
  await expect(page.locator('#result')).toBeVisible();
  await expect(page.locator('#result-kind')).toHaveText('DOUBLE K.O.');
  await expect(page.locator('#player-hp')).toHaveText('0'); await expect(page.locator('#enemy-hp')).toHaveText('0');
  await expect(page.locator('#attack')).toBeDisabled();
  await page.waitForTimeout(1200); // Capture the settled knockout and result-card entrance.
  await page.screenshot({ path: 'test-results/draw-desktop.png' });
  await page.locator('#rematch').click();
  await expect(page.locator('#player-hp')).toHaveText('200'); await expect(page.locator('#enemy-hp')).toHaveText('185');
  await expect(page.locator('#round-number')).toHaveText('01'); await expect(page.locator('#defend')).toBeEnabled();
});

test('charged victory is playable, and received damage still applies on the winning round', async ({ page }) => {
  await ready(page);
  await page.locator('#defend').click(); await discretePresses(page, 25); await untilReady(page);
  await expect(page.locator('#player-hp')).toHaveText('150');
  await page.locator('#attack').click(); await discretePresses(page, 25); await untilReady(page);
  await expect(page.locator('#result-kind')).toHaveText('VICTORY');
  await expect(page.locator('#enemy-hp')).toHaveText('0'); await expect(page.locator('#player-hp')).toHaveText('75');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'test-results/victory-desktop.png' });
});

test('mobile touch counts once per tap; controls fit; rules and language work', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await context.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://127.0.0.1:5173'); await expect(page.locator('#loading')).toBeHidden();
  await expect(page.locator('#quality')).toHaveText('Quality · Eco');
  await expect(page.locator('#fallback')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const id of ['attack', 'defend']) { const r = await page.locator(`#${id}`).boundingBox(); expect(r.height).toBeGreaterThanOrEqual(44); expect(r.x + r.width).toBeLessThanOrEqual(390); }
  await page.locator('#zh').tap();
  await page.locator('#attack').tap();
  for (let i = 0; i < 3; i++) await page.locator('#tap').tap();
  await expect(page.locator('#press-count')).toHaveText('3');
  await expect(page.locator('#multiplier')).toHaveText('×1.03');
  await untilReady(page);
  await expect(page.locator('#player-hp')).toHaveText('125'); await expect(page.locator('#enemy-hp')).toHaveText('120');
  await page.screenshot({ path: 'test-results/mobile-zh.png' });
  await page.locator('#help').tap(); await expect(page.locator('#rules-dialog')).toBeVisible();
  await expect(page.locator('[data-i=helpTitle]')).toHaveText('沉住氣，才能打出重拳。');
  await page.locator('#close-help').tap(); await expect(page.locator('#rules-dialog')).toBeHidden();
  await page.locator('#restart').tap(); await expect(page.locator('#player-hp')).toHaveText('200');
  expect(errors).toEqual([]); await context.close();
});

test('three unboosted attacks lose; English charged controls fit a narrow phone and landscape', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true });
  const page = await context.newPage(); await page.goto('http://127.0.0.1:5173');
  await expect(page.locator('#attack')).toBeEnabled();
  await page.locator('#defend').tap(); await untilReady(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const r = await page.locator('#attack').boundingBox(); expect(r.x + r.width).toBeLessThanOrEqual(360);
  await page.locator('#restart').tap();
  for (let i = 0; i < 3; i++) { await page.locator('#attack').tap(); await untilReady(page); }
  await expect(page.locator('#result-kind')).toHaveText('DEFEAT');
  await expect(page.locator('#player-hp')).toHaveText('0'); await expect(page.locator('#enemy-hp')).toHaveText('5');
  await page.locator('#rematch').tap();
  await page.setViewportSize({ width: 844, height: 390 });
  const a = await page.locator('#attack').boundingBox(); expect(a.y + a.height).toBeLessThanOrEqual(390);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/mobile-landscape.png' });
  await context.close();
});
