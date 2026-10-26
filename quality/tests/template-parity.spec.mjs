import {test,expect} from '@playwright/test';
test('Template 02 retains IP ONLY publishing data and home activity modules',async({page})=>{
 await page.goto('/v8/?template=02-scrapbook&project=parity-current');
 const frame=page.frameLocator('#liveFrame');
 await expect(frame.locator('.hero')).toBeVisible();
 await expect(frame.locator('[data-oe-mount="quick"]')).toBeAttached();
 await expect(frame.locator('[data-oe-mount="tickets"]')).toBeAttached();
 await expect(frame.locator('[data-oe-mount="map"]')).toBeAttached();
});
for(const id of ['04-creator-catalogue']){
 test(id+' preserves the shared creator fair data and editing contract',async({page})=>{
  await page.goto('/v8/?template='+id+'&project=parity-current-'+id);
  const frame=page.frameLocator('#liveFrame');
  for(const section of ['creators','products','map','guide','news','sponsors'])await expect(frame.locator('#'+section)).toHaveCount(1);
  for(const field of ['creators','products','maps','news','sponsors','guide'])await expect(page.locator('#pageContentNav [data-section="'+field+'"]')).toBeVisible();
  await expect(page.locator('#createCustomPageBtn')).toBeHidden();
  await page.locator('#pageContentNav [data-section="products"]').click();
  await expect(page.locator('[data-add="products"]')).toBeVisible();
  await page.locator('#pageContentNav [data-section="images"]').click();
  await expect(page.locator('[data-market-upload="heroImage"]')).toBeVisible();
 });
}
