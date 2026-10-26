import {test,expect} from '@playwright/test';
import {useCloudPublisher,signInCloud,visitSite} from './cloud-publisher.mjs';

test.use({viewport:{width:1440,height:900}});

test('01 publishes and updates the visitor site through the Worker account API',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud);

  await page.goto('/v8/?template=01-ip-only&project=publish-01');
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeVisible();
  await expect(page.locator('#publishBtnLabel')).toHaveText('发布网站');

  await page.locator('#publishBtn').click();
  await expect(page.locator('#publishDialog')).toBeVisible();
  await page.locator('#publishSlug').fill('stardust-only');
  await page.locator('#publishPrimary').click();

  await expect(page.locator('#publishStatus')).toHaveText('网站已上线');
  await expect(page.locator('#publishUrl')).toHaveText('https://stardust-only.onlyevent.cn');
  await expect(page.locator('#publishBtnLabel')).toHaveText('更新网站');
  const create=cloud.requests.find(r=>r.method==='POST'&&r.path==='/api/sites');
  expect(create.status).toBe(201);
  expect(create.headers.authorization).toMatch(/^Bearer /);
  expect(create.headers['x-onlyevent-project']).toMatch(/^prj_/);
  expect(JSON.parse(create.body).templateId).toBe('01-ip-only');
  const visit=await visitSite(cloud,'stardust-only');
  expect(visit.status).toBe(200);
  expect(visit.html).toContain('<!doctype html>');

  const record=await page.evaluate(()=>JSON.parse(localStorage.getItem('onlyevent-studio-publish:01-ip-only:publish-01:iframe')));
  expect(record.siteId).toMatch(/^site_/);
  expect(record.cloudProjectId).toBe(create.headers['x-onlyevent-project']);
  expect(record.editToken).toBeUndefined();

  await page.locator('#publishPrimary').click();
  await expect.poll(()=>cloud.requests.filter(r=>r.method==='PUT').length).toBe(1);
  const update=cloud.requests.find(r=>r.method==='PUT');
  expect(update.path).toBe('/api/sites/'+record.siteId);
  expect(update.status).toBe(200);
  expect(cloud.requests.filter(r=>r.method==='POST'&&r.path==='/api/projects')).toHaveLength(1);
});

test('03 publishes standalone HTML that the Worker serves on its subdomain',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud);
  await page.goto('/v8/?template=03-creator-market&project=publish-03');
  await page.locator('[data-section="basic"]').waitFor();
  await page.locator('#publishBtn').click();
  await page.locator('#publishSlug').fill('creator-market-qa');
  await page.locator('#publishPrimary').click();
  await expect(page.locator('#publishStatus')).toHaveText('网站已发布');
  await expect(page.locator('#publishUrl')).toHaveText('https://creator-market-qa.onlyevent.cn');
  const visit=await visitSite(cloud,'creator-market-qa');
  expect(visit.status).toBe(200);
  expect(visit.html).toContain('const d=__oeSnapshot');
  expect(visit.html).not.toContain("from'/v8/market-shared.js'");
});

test('publishing while signed out explains that an organizer login is required',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await page.goto('/v8/?template=01-ip-only&project=publish-signed-out');
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeVisible();
  await page.locator('#publishBtn').click();
  await page.locator('#publishSlug').fill('signed-out-site');
  await page.locator('#publishPrimary').click();
  await expect(page.locator('#publishStatus')).toHaveText('请先登录主办方账号');
  expect(cloud.requests).toHaveLength(0);
});
