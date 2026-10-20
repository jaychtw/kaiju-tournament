import { test, expect } from '@playwright/test';
import { ready, select, challengeRival, discretePresses, untilReady, round } from './helpers.js';

test('illustrated battle rejects held keys; localization changes without resetting combat and persists',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await ready(page);
  await expect(page.locator('#player-hp')).toHaveText('200');await page.keyboard.press('KeyD');await page.keyboard.down('Space');
  await page.evaluate(()=>window.dispatchEvent(new KeyboardEvent('keydown',{code:'Space',repeat:true,bubbles:true})));await expect(page.locator('#press-count')).toHaveText('1');await page.keyboard.up('Space');await discretePresses(page,4);await expect(page.locator('#press-count')).toHaveText('5');await untilReady(page);
  await expect(page.locator('#player-hp')).toHaveText('130');await expect(page.locator('#enemy-hp')).toHaveText('185');await expect(page.locator('#defend')).toBeDisabled();
  await page.locator('#zh').click();await expect(page.locator('#attack-label')).toHaveText('蓄力攻擊');await expect(page.locator('#player-hp')).toHaveText('130');await expect(page.locator('html')).toHaveAttribute('lang','zh-Hant');
  await page.reload();await expect(page.locator('#resume')).toBeVisible();await page.locator('#resume').click();await expect(page.locator('#grounds-world')).toBeVisible();await challengeRival(page);
  await expect(page.locator('#player-hp')).toHaveText('200');await expect(page.locator('#attack-label')).toHaveText('攻擊');expect(errors).toEqual([]);
});
test('Guard → charged Attack → Attack resolves double KO; draw records loss and next match resets HP',async({page})=>{
  await ready(page);await round(page,'defend');await expect(page.locator('#player-hp')).toHaveText('125');await expect(page.locator('#defend')).toBeDisabled();
  await round(page,'attack');await expect(page.locator('#player-hp')).toHaveText('50');await expect(page.locator('#enemy-hp')).toHaveText('50');await expect(page.locator('#defend')).toBeEnabled();await round(page,'attack');
  await expect(page.locator('#result-kind')).toHaveText('Draw · counts as loss');await expect(page.locator('#player-hp')).toHaveText('0');await expect(page.locator('#enemy-hp')).toHaveText('0');
  const t=await page.evaluate(()=>window.wktDiagnostics().tournament);expect(t.history).toHaveLength(1);expect(t.history[0].outcome).toBe('draw');
  await page.locator('#continue').click();await expect(page.locator('#walk-grumbongo')).toBeDisabled();await expect(page.locator('#npc-grumbongo')).toHaveClass(/fought/);await challengeRival(page,'kraken');await expect(page.locator('#player-hp')).toHaveText('200');await expect(page.locator('#enemy-hp')).toHaveText('195');await expect(page.locator('#defend')).toBeEnabled();
});
test('charged victory still receives the simultaneous incoming damage',async({page})=>{
  await ready(page);await round(page,'defend',25);await expect(page.locator('#player-hp')).toHaveText('150');await round(page,'attack',25);await expect(page.locator('#result-kind')).toHaveText('Win');await expect(page.locator('#enemy-hp')).toHaveText('0');await expect(page.locator('#player-hp')).toHaveText('75');
  await page.screenshot({path:'test-results/victory-desktop.png'});
});
test('phone touch counts each tap once, bilingual instructions work, charged controls fit portrait and landscape',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await ready(page);
  await page.locator('#zh').tap();await page.locator('#attack').tap();for(let i=0;i<3;i++)await page.locator('#tap').tap();await expect(page.locator('#press-count')).toHaveText('3');await expect(page.locator('#multiplier')).toHaveText('×1.03');await untilReady(page);await expect(page.locator('#player-hp')).toHaveText('125');await expect(page.locator('#enemy-hp')).toHaveText('120');
  await page.locator('#help').tap();await expect(page.locator('#help-title')).toHaveText('沉住氣，才能打出重拳。');await page.locator('#close-help').tap();await round(page,'defend',20);await expect(page.locator('#defend')).toBeDisabled();await page.locator('#en').tap();
  for(const size of [{width:360,height:780},{width:844,height:390}]){await page.setViewportSize(size);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);for(const id of ['attack','defend']){const r=await page.locator(`#${id}`).boundingBox();expect(r.height).toBeGreaterThanOrEqual(44);expect(r.x+r.width).toBeLessThanOrEqual(size.width);expect(r.y+r.height).toBeLessThanOrEqual(size.height);}await page.screenshot({path:`test-results/phone-${size.width}.png`});}
  expect(errors).toEqual([]);await context.close();
});
test('three zero-press attacks lose; loss keeps the tournament open',async({page})=>{
  await ready(page);for(let i=0;i<3;i++)await round(page,'attack');await expect(page.locator('#result-kind')).toHaveText('Loss');await expect(page.locator('#player-hp')).toHaveText('0');await expect(page.locator('#enemy-hp')).toHaveText('5');await page.locator('#continue').click();await expect(page.locator('#grounds-world')).toBeVisible();await expect(page.locator('#walk-grumbongo')).toBeDisabled();
});
