import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const original=JSON.parse(readFileSync('public/docs/catalog.json','utf8'));

test('a synchronized document immediately enters search and offline reading',async({page})=>{
  const entry={...original.documents[0],id:'Smart_Port_Devices/Atlas_Test_Sensor',key:'Smart_Port_Devices--Atlas_Test_Sensor',title:'Atlas Test Sensor',zhTitle:'更新测试传感器',text:'uniqueSyncToken',zhText:'uniqueSyncToken',headings:[]};
  let updated=false;
  await page.route('**/docs/catalog.json',route=>route.fulfill({json:updated?{...original,snapshotId:'test-synchronized',documents:[...original.documents,entry]}:original}));
  await page.route('**/docs/Smart_Port_Devices--Atlas_Test_Sensor.json',route=>route.fulfill({json:{id:entry.id,en:'<h1>Atlas Test Sensor</h1><pre><code>sensor.read();</code></pre>',zh:'<h1>更新测试传感器</h1><pre><code>sensor.read();</code></pre>',headings:[]}}));
  await page.exposeFunction('markDocsUpdated',()=>{updated=true;});
  await page.addInitScript(()=>{window.atlasDesktop={minimize(){},maximize(){},close(){},openSource:async()=>true,automaticUpdatesEnabled:false,
    runAutoUpdates:async(_options,progress)=>{progress?.('documents:verify');await (window as unknown as {markDocsUpdated:()=>Promise<void>}).markDocsUpdated();window.dispatchEvent(new Event('atlas:library-updated'));return {checkedAt:new Date().toISOString(),documents:{status:'updated'},application:{status:'ready',version:'1.2.0'}};},restartToUpdate(){localStorage.setItem('restart-requested','true');}};});
  await page.goto('/#updates');
  await page.getByRole('button',{name:'立即同步并检查新版'}).click();
  await expect(page.locator('.auto-update-results')).toContainText('新文档已加入文档库');
  await expect(page.locator('.update-metrics')).toContainText('67');
  await page.getByRole('switch',{name:'自动更新文档',exact:true}).click();
  await expect(page.getByRole('switch',{name:'自动更新文档',exact:true})).toHaveAttribute('aria-checked','false');
  await page.getByRole('button',{name:'重启并更新'}).click();
  expect(await page.evaluate(()=>localStorage.getItem('restart-requested'))).toBe('true');
  await page.keyboard.press('Control+k');
  await page.getByRole('textbox',{name:'搜索 API'}).fill('uniqueSyncToken');
  await page.locator('.search-result').click();
  await expect(page.locator('.reader-heading h1')).toContainText('更新测试传感器');
  await expect(page.locator('.doc-content')).toContainText('sensor.read();');
  await page.reload();
  await expect(page.locator('.doc-content')).toContainText('sensor.read();');
});

test('automatic startup respects a disabled preference and failures keep documents',async({page})=>{
  await page.addInitScript(()=>{localStorage.setItem('atlas:settings',JSON.stringify({language:'zh',theme:'light',motion:false,fontSize:15,accent:'jade',autoDocuments:false,autoApplication:true}));
    window.atlasDesktop={minimize(){},maximize(){},close(){},openSource:async()=>true,runAutoUpdates:async(options)=>{localStorage.setItem('auto-options',JSON.stringify(options));return {checkedAt:new Date().toISOString(),documents:{status:'skipped'},application:{status:'error',error:'network'}};}};});
  await page.goto('/#updates');
  await expect(page.locator('.auto-update-results')).toContainText('暂时无法完成更新',{timeout:10000});
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('auto-options')!))).toEqual({documents:false,application:true});
  await page.getByRole('button',{name:'全部 API',exact:false}).first().click();
  await expect(page.locator('.document-card')).toHaveCount(66);
});
