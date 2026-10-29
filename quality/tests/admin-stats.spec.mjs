import {test,expect} from '@playwright/test';
import worker from '../../cloud/src/worker.js';
import {useCloudPublisher,signInCloud} from './cloud-publisher.mjs';

test.use({viewport:{width:1440,height:900}});

test('statistics page shows the counts of a published site',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'stats-organizer');
  await page.goto('/v8/?template=01-ip-only&project=stats-01');
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeVisible();
  await page.locator('#publishBtn').click();
  await page.locator('#publishSlug').fill('stats-demo');
  await page.locator('#publishPrimary').click();
  await expect(page.locator('#publishUrl')).toHaveText('https://stats-demo.onlyevent.cn');
  const ua='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36';
  for(let i=0;i<4;i++)await worker.fetch(new Request('https://stats-demo.onlyevent.cn/',{headers:{'user-agent':ua}}),cloud.env);

  await page.goto('/admin/');
  await expect(page.locator('#adminShell')).toBeVisible();
  await page.locator('[data-admin-page="stats"]').click();
  await expect(page.locator('#statToday')).toHaveText('4');
  await expect(page.locator('#statTotal')).toHaveText('4');
  await expect(page.locator('#statsBars i')).toHaveCount(30);
});

test('statistics page explains when the site is not published yet',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'stats-empty');
  await page.goto('/admin/');
  await page.evaluate(()=>localStorage.setItem('onlyevent-admin-projects-v1',JSON.stringify([{id:'s1',name:'未发布',templateId:'01-ip-only',status:'draft',siteUrl:'',updatedAt:new Date().toISOString()}])));
  await page.reload();
  await page.locator('[data-admin-page="stats"]').click();
  await expect(page.locator('#statsMessage')).toContainText('还没有发布');
  await expect(page.locator('#statsCards')).toBeHidden();
});
