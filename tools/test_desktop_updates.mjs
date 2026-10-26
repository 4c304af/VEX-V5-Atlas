import { spawn } from 'node:child_process';
import { readFileSync,writeFileSync } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const root=path.resolve(import.meta.dirname,'..');
const version=JSON.parse(readFileSync(path.join(root,'package.json'),'utf8')).version;
const profile=path.join(root,'build','desktop-live-update-'+Date.now());
const child=spawn(path.join(root,'release',`V5-Atlas-${version}-Windows-x64.exe`),['--test','--profile='+profile],{windowsHide:true,stdio:'ignore'});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
let browser;
try {
  for(let i=0;i<40;i++){
    try {browser=await chromium.connectOverCDP('http://127.0.0.1:9336');break;}catch{if(child.exitCode!==null)throw Error('Desktop exited with '+child.exitCode);await delay(350);}
  }
  assert(browser,'Desktop connection failed');
  const page=browser.contexts()[0].pages()[0];
  await page.locator('.hero h1').waitFor({timeout:20000});
  await page.evaluate(()=>{location.hash='#updates';});
  await page.getByRole('button',{name:'立即检查',exact:true}).waitFor();
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.getByRole('button',{name:'立即检查',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.update-check-card')?.getAttribute('aria-busy')==='false',{},{timeout:130000});
  const result=await page.evaluate(()=>JSON.parse(localStorage.getItem('atlas:documentation-updates')??'null'));
  const issue=await page.locator('.update-message[role="status"]').allTextContents();
  writeFileSync(path.join(root,'build','live-update-result.json'),JSON.stringify({result,issue,errors},null,2));
  console.log('Live result:',JSON.stringify(result?{status:result.status,total:result.total,checkedCount:result.checkedCount,changes:result.changes.length,failures:result.failures}:issue));
  await page.screenshot({path:path.join(root,'screenshots',`desktop-${version}-updates.png`)});
  assert(result,'Live check failed: '+issue.join(' '));
  assert(['current','updates'].includes(result.status),'Official pages could not all be verified');
  assert(result.checkedCount>0);assert.deepEqual(errors,[]);
  await page.getByRole('button',{name:'重新检查',exact:true}).click();
  await page.getByRole('button',{name:'取消检查',exact:true}).click();
  await page.getByRole('status').filter({hasText:'检查已取消'}).waitFor({timeout:10000});
  await browser.contexts()[0].setOffline(true);
  await page.reload();
  await page.locator('.update-results').waitFor();
  assert.match(await page.locator('.update-result-heading').innerText(),/官方文档与本地快照一致|发现 .* 篇文档有变化/);
  console.log('PASS: packaged native update RPC, live official comparison, cancellation, and retained result after an offline reload.');
  await page.evaluate(()=>window.atlasDesktop.close()).catch(()=>{});
}finally {
  await browser?.close().catch(()=>{});
  if(child.exitCode===null)child.kill();
}
