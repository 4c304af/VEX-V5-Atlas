import { test,expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { DocumentationUpdateResult } from '../src/types';

const snapshot=JSON.parse(readFileSync('public/docs/update-manifest.json','utf8'));
const report:DocumentationUpdateResult={
  status:'updates',checkedAt:'2026-10-26T08:30:00Z',snapshotDate:snapshot.snapshotDate,snapshotId:snapshot.snapshotId,
  total:67,checkedCount:67,errorCode:undefined,failures:[],changes:[
    {id:'Smart_Port_Devices/New_Sensor',title:'New Sensor',kind:'added',source:'https://api.vex.com/v5/home/cpp/Smart_Port_Devices/New_Sensor.html'},
    {id:'Drivetrain/index',title:'Drivetrain',zhTitle:'传动系统',kind:'modified',source:'https://api.vex.com/v5/home/cpp/Drivetrain/index.html'},
    {id:'Legacy/Old',title:'Old Device',zhTitle:'旧设备',kind:'removed',source:'https://api.vex.com/v5/home/cpp/Legacy/Old.html'},
  ]
};

test('explicit update checks show classified changes, preserve results, and translate to English',async({page})=>{
  await page.addInitScript(result=>{
    let calls=0;
    Object.assign(window,{atlasUpdateCalls:()=>calls});
    window.atlasDesktop={minimize(){},maximize(){},close(){},openSource:async()=>true,
      checkDocUpdates:async(progress)=>{calls++;progress?.({phase:'documents',completed:67,total:67});return result;},cancelDocUpdateCheck(){}};
  },report);
  await page.goto('/#updates');
  await expect(page.getByRole('heading',{name:'检查文档更新',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>(window as unknown as {atlasUpdateCalls:()=>number}).atlasUpdateCalls())).toBe(0);
  await page.getByRole('button',{name:'立即检查',exact:true}).click();
  await expect(page.getByRole('heading',{name:'发现 3 篇文档有变化'})).toBeVisible();
  await expect(page.locator('.update-change-row')).toHaveCount(3);
  await page.locator('.update-change-tabs').getByRole('button',{name:'修改 1',exact:true}).click();
  await expect(page.locator('.update-change-row')).toHaveCount(1);
  await expect(page.locator('.update-change-row')).toContainText('传动系统');
  await page.reload();
  await expect(page.locator('.update-change-row')).toHaveCount(3);
  await expect(page.locator('.update-last-time')).toContainText('16:30');
  await page.getByRole('button',{name:'EN',exact:true}).click();
  await expect(page.getByRole('heading',{name:'3 documentation pages have changed'})).toBeVisible();
  await page.screenshot({path:'screenshots/documentation-updates-changes.png'});
});

test('an offline failure retains the previous result and a partial check never claims current',async({page})=>{
  await page.addInitScript(result=>{
    localStorage.setItem('atlas:documentation-updates',JSON.stringify(result));
    window.atlasDesktop={minimize(){},maximize(){},close(){},openSource:async()=>true,
      checkDocUpdates:async()=>({...result,status:'error',errorCode:'network'}),cancelDocUpdateCheck(){}};
  },report);
  await page.goto('/#updates');
  await page.getByRole('button',{name:'重新检查',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('无法连接官方文档');
  await expect(page.locator('.update-change-row')).toHaveCount(3);
  await page.evaluate(result=>{window.atlasDesktop!.checkDocUpdates=async()=>({...result,status:'partial',checkedCount:66,changes:[],failures:[{id:'Drivetrain/index',title:'Drivetrain',code:'http-404'}]});},report);
  await page.getByRole('button',{name:'重新检查',exact:true}).click();
  await expect(page.getByRole('heading',{name:'部分页面未完成核对'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'官方文档与本地快照一致'})).toHaveCount(0);
  await page.locator('.update-failures summary').click();
  await expect(page.locator('.update-failures')).toContainText('Drivetrain');
});

test('a check remains active across navigation and can be cancelled',async({page})=>{
  await page.addInitScript(result=>{
    let finish:(value:typeof result)=>void;
    window.atlasDesktop={minimize(){},maximize(){},close(){},openSource:async()=>true,
      checkDocUpdates:progress=>{progress?.({phase:'documents',completed:12,total:66});return new Promise(resolve=>{finish=resolve;});},
      cancelDocUpdateCheck:()=>finish({...result,status:'cancelled'})};
  },report);
  await page.goto('/#updates');
  await page.getByRole('button',{name:'立即检查',exact:true}).click();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','18');
  await page.getByRole('button',{name:'概览',exact:true}).click();
  await page.getByRole('button',{name:'文档更新',exact:true}).click();
  await expect(page.getByRole('button',{name:'取消检查',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'取消检查',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('检查已取消');
  await expect(page.getByRole('button',{name:'立即检查',exact:true})).toBeEnabled();
});

test('a result from another snapshot is not presented as current',async({page})=>{
  await page.addInitScript(result=>localStorage.setItem('atlas:documentation-updates',JSON.stringify({...result,status:'current',snapshotId:'old-snapshot',changes:[]})),report);
  await page.goto('/#updates');
  await expect(page.locator('.update-last-time')).toContainText('尚未检查');
  await expect(page.getByRole('heading',{name:'官方文档与本地快照一致'})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'立即检查',exact:true})).toBeDisabled();
});
