import {test,expect} from '@playwright/test';

test('editor renderer initializes and keeps standalone pages out of home',async({page})=>{
  const runtimeErrors=[];
  page.on('pageerror',err=>runtimeErrors.push(err.message));
  page.on('console',msg=>{if(msg.type()==='error')runtimeErrors.push(msg.text())});

  await page.goto('/v8/');
  const frame=page.frameLocator('#liveFrame');

  await expect(frame.locator('.hero')).toBeVisible();
  await expect(frame.locator('.hero h1')).toBeVisible();
  await expect(frame.locator('.hero .kv')).toBeVisible();
  await expect(frame.locator('#tickets')).toBeVisible();

  await expect(frame.locator('#booths')).toBeHidden();
  await expect(frame.locator('#activities')).toBeHidden();
  await expect(frame.locator('#guests')).toBeHidden();
  await expect(frame.locator('#guide')).toBeHidden();

  await frame.locator('.quick a[data-page-link="booths"]').click();
  await expect(frame.locator('#booths')).toBeVisible();
  await expect(frame.locator('.hero')).toBeHidden();

  await frame.locator('#booths .section-back').click();
  await expect(frame.locator('.hero')).toBeVisible();
  await expect(frame.locator('#booths')).toBeHidden();

  expect(runtimeErrors,'renderer must start without console/page errors').toEqual([]);
});


test('custom preset pages start with templates and can be removed by undo or delete',async({page})=>{
  const runtimeErrors=[];
  page.on('pageerror',err=>runtimeErrors.push(err.message));
  page.on('console',msg=>{if(msg.type()==='error')runtimeErrors.push(msg.text())});

  await page.goto('/v8/');
  const frame=page.frameLocator('#liveFrame');
  await expect(frame.locator('.hero h1')).toBeVisible();

  const rows=page.locator('#customPageRows .custom-page-row');
  await expect(rows).toHaveCount(0);

  await page.locator('#createCustomPageBtn').click();
  await page.locator('[data-custom-page-preset="cosplay"]').click();
  await expect(rows).toHaveCount(1);
  await expect(frame.locator('[data-custom-page-root] .custom-page-card')).toHaveCount(3);
  await expect(frame.locator('[data-custom-page-root] .custom-page-card').first()).toContainText('参展 Coser 01');

  await page.locator('#undoBtn').click();
  await expect(rows).toHaveCount(0);
  await expect(frame.locator('[data-custom-page-root]')).toHaveCount(0);

  await page.locator('#createCustomPageBtn').click();
  await page.locator('[data-custom-page-preset="officialShop"]').click();
  await expect(rows).toHaveCount(1);
  await expect(frame.locator('[data-custom-page-root] .custom-page-card')).toHaveCount(3);
  await expect(frame.locator('[data-custom-page-root] .custom-page-card').first()).toContainText('限定商品 01');

  await page.locator('#customPageRows [data-delete-custom-page-row]').click();
  await expect(rows).toHaveCount(0);
  await expect(frame.locator('[data-custom-page-root]')).toHaveCount(0);

  await page.locator('#undoBtn').click();
  await expect(rows).toHaveCount(1);

  expect(runtimeErrors,'custom page lifecycle must not produce runtime errors').toEqual([]);
});


test('custom page presets automatically use content-aware layout families',async({page})=>{
  const runtimeErrors=[];
  page.on('pageerror',err=>runtimeErrors.push(err.message));
  page.on('console',msg=>{if(msg.type()==='error')runtimeErrors.push(msg.text())});

  await page.goto('/v8/');
  const frame=page.frameLocator('#liveFrame');
  await expect(frame.locator('.hero h1')).toBeVisible();

  const cases=[
    ['cosplay','people'],
    ['officialShop','product'],
    ['food','place'],
    ['itasha','showcase'],
    ['illustration','gallery'],
    ['novel','reading'],
    ['tabletop','activity']
  ];

  for(const [preset,layout] of cases){
    await page.locator('#createCustomPageBtn').click();
    await page.locator('[data-custom-page-preset="'+preset+'"]').click();
    const section=frame.locator('[data-custom-page-root]');
    await expect(section).toHaveAttribute('data-custom-page-layout',layout);
    await expect(section).toHaveClass(new RegExp('custom-page-layout-'+layout));
    await expect(section.locator('.custom-page-card')).toHaveCount(3);
    if(layout==='product')await expect(section.locator('.custom-page-meta .is-price').first()).toBeVisible();
    await page.locator('#customPageRows [data-delete-custom-page-row]').click();
    await expect(frame.locator('[data-custom-page-root]')).toHaveCount(0);
  }

  expect(runtimeErrors,'all content-aware layouts must render without runtime errors').toEqual([]);
});


test('guide keeps traffic visual and other guide sections text only',async({page})=>{
  const runtimeErrors=[];
  page.on('pageerror',err=>runtimeErrors.push(err.message));
  page.on('console',msg=>{if(msg.type()==='error')runtimeErrors.push(msg.text())});

  await page.goto('/v8/');
  const frame=page.frameLocator('#liveFrame');
  await expect(frame.locator('.hero h1')).toBeVisible();

  await page.locator('[data-page="guide"]').click();
  await expect(frame.locator('#guide')).toBeVisible();
  await expect(frame.locator('#guide .guide-item-traffic')).toHaveCount(1);
  await expect(frame.locator('#guide .guide-item-text')).toHaveCount(4);
  await expect(frame.locator('#guide .guide-item-traffic')).toContainText('地铁：');
  await expect(frame.locator('#guide .guide-item-admission')).toContainText('开放时间');
  await expect(frame.locator('#guide .guide-item-cosplay')).toContainText('拍摄');

  await page.locator('[data-page-content-manager="guide"]').click();
  await page.locator('#contentListPanel [data-open-item="0"]').click();
  await expect(page.locator('[data-media-path="guide.items.0.image"]')).toHaveCount(1);
  await expect(page.locator('[data-guide-template-reset]')).toHaveCount(1);

  await page.locator('#contentListPanel [data-open-item="1"]').click();
  await expect(page.locator('[data-media-path="guide.items.1.image"]')).toHaveCount(0);
  await expect(page.locator('[data-guide-template-reset]')).toHaveCount(1);

  expect(runtimeErrors,'guide render/edit flow must not produce runtime errors').toEqual([]);
});
