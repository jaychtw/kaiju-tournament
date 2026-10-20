// Production smoke + observed performance. Never overrides gameplay rules/state.
import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const origin=process.env.REVIEW_URL||'http://127.0.0.1:4176/kaiju-tournament/';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const report={url:origin,date:new Date().toISOString(),browser:browser.version(),environment:{platform:os.platform(),cpu:os.cpus()[0]?.model,logicalCPUs:os.cpus().length},coverage:'Headless Linux Chromium and emulated phone viewport. No physical phone, Safari, thermal, battery or low-end device verification.',samples:[]};
fs.mkdirSync('docs/release/screenshots',{recursive:true});
for(const phone of [false,true]){
  const context=await browser.newContext(phone?{viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true}:{viewport:{width:1280,height:900}});
  const page=await context.newPage();const errors=[],bad=[],external=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)bad.push({url:r.url(),status:r.status()});});page.on('request',r=>{if(!r.url().startsWith(new URL(origin).origin))external.push(r.url());});
  const started=performance.now();await page.goto(origin);await expect(page.locator('#begin')).toBeVisible();await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
  const selectionLoadedMs=performance.now()-started;await page.screenshot({path:`docs/release/screenshots/production-selection-${phone?'phone':'desktop'}.png`,fullPage:true});
  await page.locator('#begin').click();await expect(page.locator('#grounds-world')).toBeVisible();await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));await page.screenshot({path:`docs/release/screenshots/production-grounds-${phone?'phone':'desktop'}.png`,fullPage:true});
  await page.locator('#walk-grumbongo').click();await expect(page.locator('#challenge-dialog')).toBeVisible();await expect(page.locator('#challenge-title')).toHaveText('Challenge Grumbongo?');await page.locator('#accept-challenge').click();await expect.poll(()=>page.evaluate(()=>window.wktDiagnostics().phase)).toBe('ready');
  await page.waitForTimeout(11000); // One warm sustained sample, not a physical-device benchmark.
  const idle=await page.evaluate(()=>window.wktDiagnostics().rendering);
  await page.locator('#defend').click();
  const tapBox=phone?await page.locator('#tap').boundingBox():null;
  for(let i=0;i<25;i++){if(phone)await page.touchscreen.tap(tapBox.x+tapBox.width/2,tapBox.y+tapBox.height/2);else await page.keyboard.press('Space');}
  await expect.poll(()=>page.evaluate(()=>window.wktDiagnostics().phase),{timeout:12000}).toBe('ready');await expect(page.locator('#player-hp')).toHaveText('150');await expect(page.locator('#defend')).toBeDisabled();
  const combat=await page.evaluate(()=>window.wktDiagnostics().rendering);
  await page.locator('#zh').click();await expect(page.locator('#attack-label')).toHaveText('蓄力攻擊');await page.screenshot({path:`docs/release/screenshots/production-battle-${phone?'phone':'desktop'}.png`,fullPage:true});
  const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>({name:r.name,encodedBodySize:r.encodedBodySize,transferSize:r.transferSize,duration:r.duration})));
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  report.samples.push({viewport:phone?'390x844 touch emulation DPR2':'1280x900 desktop DPR1',selectionLoadedMs,idle,combat,encodedResourceBytes:resources.reduce((s,r)=>s+r.encodedBodySize,0),transferredResourceBytes:resources.reduce((s,r)=>s+r.transferSize,0),requests:resources.length,externalRequests:external,errors,failedResponses:bad,horizontalOverflow:overflow});
  expect(errors).toEqual([]);expect(bad).toEqual([]);expect(external).toEqual([]);expect(overflow).toBe(false);await context.close();
}
await browser.close();
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(f=>f.isDirectory()?files(path.join(dir,f.name)):[path.join(dir,f.name)]);}
const output=files('dist');report.bundle={files:output.length,bytes:output.reduce((s,p)=>s+fs.statSync(p).size,0),jsBytes:output.filter(p=>p.endsWith('.js')).reduce((s,p)=>s+fs.statSync(p).size,0),cssBytes:output.filter(p=>p.endsWith('.css')).reduce((s,p)=>s+fs.statSync(p).size,0)};
fs.writeFileSync('docs/release/production-validation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
