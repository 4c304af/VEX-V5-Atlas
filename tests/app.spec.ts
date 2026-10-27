import { test, expect } from '@playwright/test';

test('offline library, Chinese search, function jump, and unchanged C++ clipboard',async({page,context})=>{
  const failures:string[]=[];const remote:string[]=[];
  page.on('pageerror',e=>failures.push(e.message));
  page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:5185')&&!r.url().startsWith('data:'))remote.push(r.url());});
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto('/');
  await expect(page.locator('.stats-strip')).toContainText('66');
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('textbox',{name:'搜索 API'}).fill('spinFor');
  await expect(page.locator('.search-result').first()).toBeVisible();
  await page.locator('.search-result').filter({hasText:'电机与电机组'}).click();
  await expect(page.locator('.reader-heading h1')).toContainText('电机与电机组');
  await expect(page.locator('.doc-content pre code').first()).toBeVisible();
  await page.locator('.copy-code').first().click();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('motor(');
  await page.getByRole('button',{name:'收藏文档',exact:true}).click();
  await expect(page.getByRole('button',{name:'取消收藏',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.keyboard.press('Control+k');
  await page.getByRole('textbox',{name:'搜索 API'}).fill('扭矩');
  await expect(page.locator('.search-result').first()).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'对照',exact:true}).click();
  await expect(page.locator('.doc-columns.dual .doc-column')).toHaveCount(2);
  const code=await page.locator('.doc-column').evaluateAll(cols=>cols.map(col=>Array.from(col.querySelectorAll('pre code')).map(n=>n.textContent)));
  expect(code[0]).toEqual(code[1]);
  await page.screenshot({path:'screenshots/reader-bilingual.png'});
  expect(remote).toEqual([]);expect(failures).toEqual([]);
});

test('language, theme, bookmarks, history, and preferences survive restart',async({page})=>{
  await page.goto('/#doc/Drivetrain/index');
  await expect(page.locator('.doc-content')).toContainText('driveFor');
  await page.getByRole('button',{name:'收藏文档',exact:true}).click();
  await page.getByRole('button',{name:'EN',exact:true}).click();
  await expect(page.locator('.doc-column article')).toHaveAttribute('lang','en');
  await expect(page.locator('.breadcrumb')).toContainText('Drivetrain');
  await page.getByRole('button',{name:'Toggle color theme'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.getByRole('button',{name:'Bookmarks',exact:false}).first().click();
  await expect(page.locator('.document-card')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await expect(page.locator('.document-card h2')).toContainText('Drivetrain');
  await page.getByRole('button',{name:'Recent reading',exact:true}).click();
  await expect(page.locator('.document-card')).toHaveCount(1);
  await page.getByRole('button',{name:'Preferences',exact:true}).click();
  await page.getByRole('switch',{name:'Expressive motion'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion','off');
  await page.screenshot({path:'screenshots/settings-dark.png'});
});

test('all categories filter correctly, empty search recovers, and internal links stay local',async({page})=>{
  await page.goto('/#library');
  await expect(page.locator('.document-card')).toHaveCount(66);
  await page.locator('.filter-chips').getByRole('button',{name:'智能端口设备',exact:true}).click();
  await expect(page.locator('.document-card')).toHaveCount(8);
  await page.getByRole('textbox',{name:'筛选文档'}).fill('zzzz-no-result');
  await expect(page.locator('.empty-state')).toContainText('暂时没有找到');
  await page.getByRole('button',{name:'清除筛选',exact:true}).click();
  await expect(page.locator('.document-card')).toHaveCount(8);
  await page.goto('/#doc/Drivetrain/index');
  await page.locator('.doc-content a[href="#doc/Drivetrain/smartdrive"]').first().click();
  await expect(page.locator('.reader-heading h1')).toContainText('智能传动系统');
  await page.screenshot({path:'screenshots/reader-chinese.png'});
});

test('narrow layout, reduced motion, and English overview have no horizontal overflow',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width:760,height:850});
  await page.goto('/');
  await expect(page.locator('.hero')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.getByRole('button',{name:'打开导航',exact:true}).click();
  await expect(page.locator('.sidebar')).toBeVisible();
  await page.getByRole('button',{name:'中英术语表',exact:true}).click();
  await expect(page.locator('.term-card')).toHaveCount(21);
  await page.getByRole('button',{name:'EN',exact:true}).click();
  await page.goto('/#home');
  await expect(page.locator('.hero h1')).toContainText('Offline reference');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.screenshot({path:'screenshots/overview-english-narrow.png'});
});
