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

  await frame.locator('a[data-page-link="booths"]').first().click();
  await expect(frame.locator('#booths')).toBeVisible();
  await expect(frame.locator('.hero')).toBeHidden();

  await frame.locator('a[data-page-link="home"]').first().click();
  await expect(frame.locator('.hero')).toBeVisible();
  await expect(frame.locator('#booths')).toBeHidden();

  expect(runtimeErrors,'renderer must start without console/page errors').toEqual([]);
});
