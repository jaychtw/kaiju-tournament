import { expect } from '@playwright/test';
export async function select(page,id='komodor') {
  await page.goto('/');await expect(page.locator('#begin')).toBeVisible();await page.locator(`#select-${id}`).click();await page.locator('#begin').click();await expect(page.locator('#grounds-world')).toBeVisible();
}
export async function challengeRival(page,id='grumbongo',clock=false) {
  await page.locator(`#walk-${id}`).click();if(clock)await page.clock.runFor(5000);
  await expect(page.locator('#challenge-dialog')).toBeVisible();await page.locator('#accept-challenge').click();
  await expect.poll(()=>page.evaluate(()=>window.wktDiagnostics().phase)).toBe('ready');
}
export async function ready(page){await select(page);await challengeRival(page);}
export async function discretePresses(page,count){await page.evaluate(n=>{for(let i=0;i<n;i++){window.dispatchEvent(new KeyboardEvent('keydown',{code:'Space',bubbles:true,cancelable:true}));window.dispatchEvent(new KeyboardEvent('keyup',{code:'Space',bubbles:true}));}},count);}
export async function untilReady(page){await expect.poll(()=>page.evaluate(()=>window.wktDiagnostics().phase),{timeout:15000}).toMatch(/ready|over/);}
export async function round(page,action,count=0,clock=false){await page.locator(`#${action}`).click();await discretePresses(page,count);if(clock){await page.clock.fastForward(3100);await page.clock.fastForward(2300);};await untilReady(page);}
