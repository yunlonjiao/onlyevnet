import {test,expect} from '@playwright/test';
import {useCloudPublisher,signInCloud,visitSite} from './cloud-publisher.mjs';

test.use({viewport:{width:1440,height:900}});

async function publish(page,cloud,slug,template='01-ip-only'){
  await page.goto('/v8/?template='+template+'&project=growth-'+slug);
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeAttached();
  await page.locator('#publishBtn').click();
  await page.locator('#publishSlug').fill(slug);
  await page.locator('#publishPrimary').click();
  await expect(page.locator('#publishStatus')).toHaveText('网站已上线');
}

test('the share dialog shows a scannable QR code for the published site',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'qr-organizer');
  await page.goto('/v8/?template=01-ip-only&project=growth-qr');
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeAttached();
  await page.locator('#shareBtn').click();
  await expect(page.locator('#shareQr')).toHaveCount(0);
  await page.locator('#shareClose').click();
  await publish(page,cloud,'qr-site');
  await page.locator('#publishShare').click();
  await expect(page.locator('#shareQr svg')).toBeVisible();
  const download=page.waitForEvent('download');
  await page.locator('#shareQrSave').click();
  expect((await download).suggestedFilename()).toContain('二维码');
});

test('tagged links count visits per channel and the stats page lists them',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'channel-organizer');
  await publish(page,cloud,'channel-site');
  await page.locator('#publishShare').click();
  await expect(page.locator('.share-channel')).toHaveCount(5);
  await expect(page.locator('.share-channel code').first()).toContainText('channel-site.onlyevent.cn/?from=weibo');
  const human='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1';
  const {default:worker}=await import('../../cloud/src/worker.js');
  const hit=async q=>{const r=await worker.fetch(new Request('https://channel-site.onlyevent.cn/'+q,{headers:{'user-agent':human}}),cloud.env);expect(r.status).toBe(200)};
  await hit('?from=weibo');await hit('?from=weibo');await hit('?from=bilibili');await hit('');await hit('?from=Bad Value!');
  await page.goto('/admin/');
  await page.locator('[data-admin-page="stats"]').click();
  await expect(page.locator('#statsChannelBox')).toBeVisible();
  await expect(page.locator('#statsChannels')).toContainText('微博');
  await expect(page.locator('#statsChannels .stats-channel').first().locator('b')).toHaveText('2 次');
  await expect(page.locator('#statsChannels')).toContainText('直接访问');
});
