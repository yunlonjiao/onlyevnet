import {test,expect} from '@playwright/test';
for(const [slug,feature] of [['market-01','ad'],['market-02','book']]){
 test(slug+' visual prototype: sections, searching and custom feature',async({page})=>{
  await page.goto('/v8/'+slug+'-preview.html');
  await expect(page.locator('h1')).toBeVisible();
  for(const anchor of ['creators','products','map','guide','sponsors','news'])await expect(page.locator('#'+anchor)).toHaveCount(1);
  await expect(page.locator('#creatorList .tile')).toHaveCount(3);
  await page.locator('#search').fill('月见');
  await expect(page.locator('#creatorList .tile')).toHaveCount(1);
  await expect(page.locator('#productList .tile')).toHaveCount(1);
  await page.locator('#search').fill('不存在的社团');
  await expect(page.locator('#creatorList .tile')).toHaveCount(0);
  await page.locator('#search').fill('');
  if(feature==='ad'){
   await expect(page.locator('#adTitle')).toHaveText('星空画集');
   await page.locator('#adNext').click();
   await expect(page.locator('#adTitle')).toHaveText('春日明信片');
  }else{
   await expect(page.locator('#bookTitle')).toHaveText('浮光工房');
   await page.locator('#bookNext').click();
   await expect(page.locator('#bookTitle')).toHaveText('月见社');
  }
  await page.setViewportSize({width:390,height:844});
  await expect(page.locator('header')).toBeVisible();
 });
}
