import {test,expect} from '@playwright/test';
// Current production template lineup: 01/02 IP ONLY, 03/04 creator-fair.
// Retired visual experiments are covered in Git history rather than active release QA.
const templates=[
  ['02-scrapbook','.scrap-pass'],
  ['03-creator-market','[data-oe-mount="product-spotlight"] .spotlight-tile'],
  ['04-creator-catalogue','#catalogue']
];
for(const [id,selector] of templates){
 test(id+' renders its own functional visual component',async({page})=>{
   await page.goto('/v8/?template='+id+'&project=component-current-'+id);
   const frame=page.frameLocator('#liveFrame');
   await expect(frame.locator(selector).first()).toBeAttached();
   await expect(page.locator('#inspector')).toBeVisible();
 });
}
test('Market layouts remain distinct rather than sharing one skin',async({page})=>{
 const markers=[];
 for(const id of ['03-creator-market','04-creator-catalogue']){
   await page.goto('/v8/?template='+id+'&project=market-distinct-'+id);
   const frame=page.frameLocator('#liveFrame');
   await frame.locator(id.startsWith('03')?'.spotlight-six .spotlight-tile':'#catalogue').first().waitFor({state:'attached'});
   const marker=await frame.locator('body').evaluate(el=>({
     hasRecommendations:!!el.querySelector('.spotlight-six .spotlight-tile'),
     hasBook:!!el.querySelector('#catalogue .book'),
     bg:getComputedStyle(el).backgroundColor
   }));
   markers.push(marker);
 }
 expect(markers[0].hasRecommendations).toBe(true);
 expect(markers[1].hasBook).toBe(true);
 expect(markers[0].bg).not.toBe(markers[1].bg);
});
