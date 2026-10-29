import {test,expect} from '@playwright/test';
import {useCloudPublisher,signInCloud} from './cloud-publisher.mjs';

test.use({viewport:{width:390,height:844},hasTouch:true,isMobile:true});

test('on a phone the admin pages stay reachable and nothing scrolls sideways',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'phone-organizer');
  await page.goto('/admin/');
  await expect(page.locator('#adminShell')).toBeVisible();
  for(const name of ['projects','templates','collect','stats','bin','settings']){
    const tab=page.locator('.admin-sidebar [data-admin-page="'+name+'"]');
    await expect(tab).toBeVisible();
    await tab.tap();
    await expect(page.locator('[data-page-panel="'+name+'"]')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  }
});

test('on a phone the editor top bar keeps the publish button readable',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'phone-editor');
  await page.goto('/v8/?template=01-ip-only&project=phone-1');
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeVisible();
  const box=await page.locator('#publishBtn').boundingBox();
  expect(box.height).toBeLessThan(50);
  expect(box.x+box.width).toBeLessThanOrEqual(390);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
