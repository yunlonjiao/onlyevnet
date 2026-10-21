import {test,expect} from '@playwright/test';
for(const [slug,feature] of [['market-01','ad'],['market-02','book']]){
 test(slug+' visual prototype: sections, searching and custom feature',async({page})=>{
  await page.goto('/v8/'+slug+'-preview.html');
  await expect(page.locator('h1')).toBeVisible();
  for(const anchor of ['creators','products','map','guide','sponsors','news'])await expect(page.locator('#'+anchor)).toHaveCount(1);
  await expect(page.locator('#creatorList .tile')).toHaveCount(3);
  if(feature==='ad') await page.locator('#directory summary').click();
  await page.locator('#search').fill('月见');
  await expect(page.locator('#creatorList .tile')).toHaveCount(1);
  await expect(page.locator('#productList .tile')).toHaveCount(feature==='ad'?2:2);
  await page.locator('#search').fill('不存在的社团');
  await expect(page.locator('#creatorList .tile')).toHaveCount(0);
  await page.locator('#search').fill('');
  if(feature==='ad'){
   const first=await page.locator('#adTitle').innerText();
   await expect(page.locator('#randomSix .tile')).toHaveCount(6);
   await page.locator('#adNext').click();
   expect(await page.locator('#adTitle').innerText()).not.toBe(first);
   await expect(page.locator('#communityLinks')).toBeVisible();
   await expect(page.locator('#tickets')).toBeVisible();
  }else{
   await expect(page.locator('#bookTitle')).toHaveText('浮光工房');
   await page.locator('#bookNext').click();
   await expect(page.locator('#bookTitle')).toHaveText('月见社');
  }
  await page.setViewportSize({width:390,height:844});
  await expect(page.locator('header')).toBeVisible();
 });
}
