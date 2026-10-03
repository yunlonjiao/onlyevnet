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
