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
