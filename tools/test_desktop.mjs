import { spawn } from 'node:child_process';
import { readFileSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const root=path.resolve(import.meta.dirname,'..');
const version=JSON.parse(readFileSync(path.join(root,'package.json'),'utf8')).version;
const exe=path.join(root,'release',`V5-Atlas-${version}-Windows-x64.exe`);
const profile=path.join(root,'build','desktop-test-'+Date.now());
const applicationDirectory=profile+'-app';mkdirSync(applicationDirectory,{recursive:true});
const isolatedExe=path.join(applicationDirectory,path.basename(exe));copyFileSync(exe,isolatedExe);
const capture=path.join(root,'screenshots');mkdirSync(capture,{recursive:true});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
let child,browser;
async function launch(){
  child=spawn(isolatedExe,['--test','--profile='+profile],{windowsHide:true,stdio:'ignore'});
  for(let i=0;i<40;i++){
    try{browser=await chromium.connectOverCDP('http://127.0.0.1:9336');break;}catch{if(child.exitCode!==null)throw Error('Desktop host exited with '+child.exitCode);await delay(350);}
  }
  assert(browser,'Desktop debugging connection did not start');
  const page=browser.contexts()[0].pages()[0];
  await page.locator('.hero h1').waitFor({timeout:20000});
  return page;
}
async function close(page){
  const exit=new Promise(resolve=>child.once('exit',resolve));
  await page.evaluate(()=>window.atlasDesktop.close()).catch(()=>{});
  await Promise.race([exit,delay(5000)]);
  await browser.close().catch(()=>{});browser=null;
  if(child.exitCode===null)child.kill();
}
try{
  let page=await launch();
  const errors=[],remote=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(!r.url().startsWith('https://v5-atlas.local/'))remote.push(r.url());});
  assert.match(await page.locator('.stats-strip').innerText(),/66/);
  assert.equal(await page.evaluate(()=>typeof window.atlasDesktop.openSource),'function');
  await page.screenshot({path:path.join(capture,`desktop-${version}-home.png`)});
  // Simulate loss of network without changing the user's system settings.
  await browser.contexts()[0].setOffline(true);
  await page.keyboard.press('Control+k');
  await page.getByRole('textbox',{name:'搜索 API'}).fill('spinFor');
  await page.locator('.search-result').filter({hasText:'电机与电机组'}).click();
  await page.locator('.doc-content pre code').first().waitFor();
  assert.match(await page.locator('.reader-heading h1').innerText(),/电机与电机组/);
  await page.locator('.copy-code').first().click();
  await page.getByRole('status').filter({hasText:'代码已复制'}).waitFor();
  await page.getByRole('button',{name:'收藏文档',exact:true}).click();
  await page.getByRole('button',{name:'对照',exact:true}).click();
  assert.equal(await page.locator('.doc-columns.dual .doc-column').count(),2);
  const code=await page.locator('.doc-column').evaluateAll(cols=>cols.map(col=>Array.from(col.querySelectorAll('pre code')).map(n=>n.textContent)));
  assert.deepEqual(code[0],code[1]);
  await page.locator('.main-scroll').evaluate(el=>el.scrollTo(0,0));
  await page.screenshot({path:path.join(capture,`desktop-${version}-bilingual.png`)});
  assert.deepEqual(errors,[]);assert.deepEqual(remote,[]);
  await page.getByRole('button',{name:'偏好设置',exact:true}).click();
  await page.getByRole('button',{name:'深色',exact:true}).click();
  await page.getByLabel('自定义强调色',{exact:true}).fill('#ffcc00');
  assert.equal(await page.locator('html').getAttribute('data-accent'),'custom');
  await close(page);
  assert.deepEqual(readdirSync(applicationDirectory),[path.basename(exe)],'Startup created files beside the executable');
  page=await launch();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  assert.equal(await page.locator('html').getAttribute('data-accent'),'custom');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('atlas:settings')).customColor),'#ffcc00');
  await page.getByRole('button',{name:'我的收藏',exact:false}).first().click();
  await page.locator('.document-card').first().waitFor();
  assert.equal(await page.locator('.document-card').count(),1);
  assert.match(await page.locator('.document-card h2').innerText(),/电机与电机组/);
  await close(page);
  assert.deepEqual(readdirSync(applicationDirectory),[path.basename(exe)],'Restart created files beside the executable');
  console.log('PASS: clean executable directory, native startup, offline reading, search, clipboard, bilingual code, bookmarks, restart persistence, and no remote requests.');
}finally{
  await browser?.close().catch(()=>{});
  if(child&&child.exitCode===null)child.kill();
}
