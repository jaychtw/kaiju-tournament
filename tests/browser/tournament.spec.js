import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { ids } from '../../src/roster.js';
import { select, challengeRival, round } from './helpers.js';
const balance=JSON.parse(readFileSync(new URL('../../docs/release/balance.json',import.meta.url)));
for(const player of ids)test(`${player}: complete all five matches, both views work, Champion and restart`,async({page})=>{
  test.setTimeout(120000);const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});await page.clock.install();await select(page,player);
  const order=ids.filter(id=>id!==player).reverse();
  for(const [index,enemy]of order.entries()){
    await challengeRival(page,enemy,true);
    const start=await page.evaluate(()=>window.wktDiagnostics());expect(start.state.playerHP).toBe((await import('../../src/roster.js')).fighters[player].hp);
    expect(start.rendering.renderer).toContain('Canvas 2D');
    const sequence=balance.rows.find(r=>r.player===player&&r.enemy===enemy&&r.presses===30).optimal.sequence;
    for(const action of sequence)await round(page,action,30,true);
    await expect(page.locator('#result-kind')).toHaveText('Win');
    const state=await page.evaluate(()=>window.wktDiagnostics());expect(state.tournament.history).toHaveLength(index+1);expect(state.tournament.active).toBe(null);
    if(index===0)await page.screenshot({path:`test-results/roster-${player}.png`});
    await page.locator('#continue').click();
    if(index<4){await expect(page.locator(`#walk-${enemy}`)).toBeDisabled();await expect(page.locator('#grounds-world')).toBeVisible();}
  }
  await expect(page.locator('#placement')).toHaveText('Champion');await page.locator('#zh').click();await expect(page.locator('#placement')).toHaveText('冠軍');
  await page.reload();await page.locator('#resume').click();await expect(page.locator('#placement')).toHaveText('冠軍');
  await page.locator('#new-tournament').click();await expect(page.locator('#begin')).toBeVisible();expect(await page.evaluate(()=>window.wktDiagnostics().tournament)).toBe(null);
  expect(errors).toEqual([]);expect(failed).toEqual([]);
});
test('grounds keyboard and touch movement; decline does not consume rival; resume keeps completed history',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage();await page.clock.install();await select(page,'kraken');
  const p=await page.evaluate(()=>window.wktDiagnostics().position);await page.keyboard.down('ArrowRight');await page.clock.runFor(500);await page.keyboard.up('ArrowRight');expect((await page.evaluate(()=>window.wktDiagnostics().position)).x).toBeGreaterThan(p.x+100);
  const left=page.locator('[data-direction=left]');const r=await left.boundingBox();await page.mouse.move(r.x+r.width/2,r.y+r.height/2);await page.mouse.down();await page.clock.runFor(400);await page.mouse.up();
  expect((await page.evaluate(()=>window.wktDiagnostics().position)).x).toBeLessThan(p.x+60);
  await page.locator('#walk-grumbongo').tap();await page.clock.runFor(4000);await expect(page.locator('#challenge-dialog')).toBeVisible();await page.locator('#decline-challenge').tap();expect((await page.evaluate(()=>window.wktDiagnostics().tournament)).history).toHaveLength(0);await page.clock.runFor(1000);await expect(page.locator('#challenge-dialog')).toBeHidden();
  await challengeRival(page,'grumbongo',true);await round(page,'attack',30,true);await round(page,'attack',30,true);await expect(page.locator('#result')).toBeVisible();await page.locator('#continue').tap();await page.reload();await page.locator('#resume').tap();await expect(page.locator('#walk-grumbongo')).toBeDisabled();expect(await page.evaluate(()=>window.wktDiagnostics().tournament.history.length)).toBe(1);
  await page.locator('#zh').tap();await expect(page.locator('#history-panel h2')).toHaveText('對戰紀錄');await page.screenshot({path:'test-results/grounds-phone-zh.png',fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
});

test('phone: five zero-press matches include losses/draws, finish fifth, and restart through touch',async({browser})=>{
  test.setTimeout(120000);const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.clock.install();await page.goto('/');await page.locator('#begin').tap();
  for(const enemy of ids.filter(id=>id!=='komodor')){
    await page.locator(`#walk-${enemy}`).tap();await page.clock.runFor(5000);await expect(page.locator('#challenge-dialog')).toBeVisible();await page.locator('#accept-challenge').tap();await expect.poll(()=>page.evaluate(()=>window.wktDiagnostics().phase)).toBe('ready');
    let rounds=0;while((await page.evaluate(()=>window.wktDiagnostics().phase))!=='over'){
      expect(++rounds).toBeLessThan(15);await page.locator('#attack').tap();await page.clock.fastForward(3100);await page.clock.fastForward(2300);await expect.poll(()=>page.evaluate(()=>window.wktDiagnostics().phase)).toMatch(/ready|over/);
    }
    await page.locator('#continue').tap();
  }
  await expect(page.locator('#placement')).toHaveText('Fifth place');const history=await page.evaluate(()=>window.wktDiagnostics().tournament.history);expect(history.filter(m=>m.outcome==='victory')).toHaveLength(1);expect(history.some(m=>m.outcome==='draw')).toBe(true);expect(history.some(m=>m.outcome==='defeat')).toBe(true);
  await page.locator('#zh').tap();await expect(page.locator('#placement')).toHaveText('第五名');await page.screenshot({path:'test-results/results-phone-zh.png',fullPage:true});await page.locator('#new-tournament').tap();await expect(page.locator('#begin')).toBeVisible();expect(errors).toEqual([]);await context.close();
});
