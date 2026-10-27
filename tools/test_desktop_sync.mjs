import {spawn,execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const root=path.resolve(import.meta.dirname,'..');
const fixture=JSON.parse(readFileSync(path.join(root,'build/auto-update-fixture.json'),'utf8'));
const version=JSON.parse(readFileSync(path.join(root,'package.json'),'utf8')).version;
const profile=path.join(root,'build','native-sync-'+Date.now());
execFileSync(fixture.installer,[path.join(profile,'atlas-data'),path.join(root,'public/docs'),fixture.package],{windowsHide:true});
const delay=ms=>new Promise(r=>setTimeout(r,ms));let child,browser;
async function launch(){
  child=spawn(path.join(root,'release',`V5-Atlas-${version}-Windows-x64.exe`),['--test','--profile='+profile],{windowsHide:true,stdio:'ignore'});
  for(let i=0;i<50;i++){try{browser=await chromium.connectOverCDP('http://127.0.0.1:9336');break;}catch{assert.equal(child.exitCode,null,'Native application exited');await delay(300);}}
  assert(browser,'Could not connect to native app');
  const page=browser.contexts()[0].pages()[0];await page.locator('.hero h1').waitFor({timeout:20000});return page;
}
async function close(page){
  const exit=new Promise(resolve=>child.once('exit',resolve));await page.evaluate(()=>window.atlasDesktop.close()).catch(()=>{});
  await Promise.race([exit,delay(5000)]);await browser.close().catch(()=>{});browser=null;if(child.exitCode===null)child.kill();
}
try{
  for(let attempt=0;attempt<2;attempt++){
    const page=await launch();const errors=[];page.on('pageerror',error=>errors.push(error.message));
    assert.match(await page.locator('.stats-strip').innerText(),/67/);
    await browser.contexts()[0].setOffline(true);
    await page.keyboard.press('Control+k');await page.getByRole('textbox',{name:'搜索 API'}).fill('uniqueSyncToken');
    await page.locator('.search-result').click();await page.locator('.doc-content pre code').first().waitFor();
    assert.match(await page.locator('.reader-heading h1').innerText(),/更新测试传感器/);
    await page.getByRole('button',{name:'对照',exact:true}).click();
    const code=await page.locator('.doc-column').evaluateAll(cols=>cols.map(col=>Array.from(col.querySelectorAll('pre code')).map(n=>n.textContent)));
    assert.deepEqual(code[0],['sensor.read();']);assert.deepEqual(code[0],code[1]);assert.deepEqual(errors,[]);
    // Reset the reading language for the next launch while keeping the installed dataset.
    await page.getByRole('button',{name:'中',exact:true}).click();await close(page);
  }
  console.log('PASS: native updated 67-page library, new-page search, bilingual reading offline and persistence across restart');
}finally{await browser?.close().catch(()=>{});if(child?.exitCode===null)child.kill();}
