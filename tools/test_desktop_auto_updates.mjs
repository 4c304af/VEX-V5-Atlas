import {spawn} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const root=path.resolve(import.meta.dirname,'..');
const version=JSON.parse(readFileSync(path.join(root,'package.json'),'utf8')).version;
const profile=path.join(root,'build','live-auto-updates-'+Date.now());
const child=spawn(path.join(root,'release',`V5-Atlas-${version}-Windows-x64.exe`),['--test','--profile='+profile],{windowsHide:true,stdio:'ignore'});
const delay=ms=>new Promise(r=>setTimeout(r,ms));let browser;
try{
  for(let i=0;i<50;i++){try{browser=await chromium.connectOverCDP('http://127.0.0.1:9336');break;}catch{assert.equal(child.exitCode,null);await delay(300);}}
  assert(browser,'Native connection failed');const page=browser.contexts()[0].pages()[0];
  await page.locator('.hero h1').waitFor({timeout:20000});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.evaluate(()=>{location.hash='#updates';});
  await page.getByRole('button',{name:'立即同步并检查新版'}).click();
  await page.waitForFunction(()=>!!localStorage.getItem('atlas:auto-updates'),{},{timeout:180000});
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('atlas:auto-updates')));
  writeFileSync(path.join(root,'build/live-auto-update-result.json'),JSON.stringify({saved,errors},null,2));
  console.log(JSON.stringify(saved.result));
  assert.equal(saved.result.documents.status,'current','Documentation feed could not be verified');
  assert.equal(saved.result.application.status,'current','Latest application could not be verified');
  assert.deepEqual(errors,[]);
  await page.screenshot({path:path.join(root,'docs/images/automatic-updates.png')});
  // A second run must retain the library and reuse the feed receipt.
  const second=await page.evaluate(()=>window.atlasDesktop.runAutoUpdates({documents:true,application:false}));
  assert.equal(second.documents.status,'current');
  assert.equal(second.application.status,'skipped');
  console.log('PASS: real GitHub documentation download, full verification, native RPC, current application version and unchanged-feed reuse');
  await page.evaluate(()=>window.atlasDesktop.close()).catch(()=>{});
}finally{await browser?.close().catch(()=>{});if(child.exitCode===null)child.kill();}
