import {test,expect} from '@playwright/test';
test('Template 02 retains IP ONLY publishing data and home activity modules',async({page})=>{
 await page.goto('/v8/?template=02-scrapbook&project=parity-current');
 const frame=page.frameLocator('#liveFrame');
 await expect(frame.locator('.hero')).toBeVisible();
 await expect(frame.locator('[data-oe-mount="quick"]')).toBeAttached();
 await expect(frame.locator('[data-oe-mount="tickets"]')).toBeAttached();
 await expect(frame.locator('[data-oe-mount="map"]')).toBeAttached();
});
for(const id of ['03-creator-market','04-creator-catalogue']){
 test(id+' keeps the shared creator-fair pages on the IP ONLY core',async({page})=>{
  await page.goto('/v8/?template='+id+'&project=parity-current-'+id);
  const frame=page.frameLocator('#liveFrame');
  for(const section of ['booths','guide','map-home','tickets','updates','community','sponsors'])await expect(frame.locator('#'+section)).toHaveCount(1);
  for(const row of ['booths','guide'])await expect(page.locator('[data-page-row="'+row+'"]')).toBeVisible();
  await expect(page.locator('#createCustomPageBtn')).toBeHidden();
 });
}
