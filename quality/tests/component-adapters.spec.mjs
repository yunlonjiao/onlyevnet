import {test,expect} from '@playwright/test';

const cases=[
  ['02-scrapbook','scrap-pass','scrap-guest','scrap-itinerary','scrap-booth','scrap-product','scrap-activity','scrap-guide'],
  ['03-school-festival','school-ticket-card','school-profile','school-timetable','school-booth','school-product','school-activity','school-guide'],
  ['04-museum-editorial','museum-admission','museum-portrait','museum-program-row','museum-booth','museum-product','museum-activity','museum-guide'],
  ['05-live-poster','live-pass','live-performer','live-running-order','live-booth','live-product','live-activity','live-guide'],
  ['06-expo-catalogue','expo-ticket-row','expo-guest-row','expo-program-row','expo-booth-row','expo-product-row','expo-activity-row','expo-guide-row'],
  ['07-immersive-character','kimetsu-admission','kimetsu-person','kimetsu-program','kimetsu-booth','kimetsu-product','kimetsu-activity','kimetsu-guide']
];

for(const [id,ticket,guest,schedule,booth,product,activity,guide] of cases){
  test(id+' uses its own internal component system',async({page})=>{
    await page.goto('/v8/?template='+id+'&project=adapter-'+id);
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.hero')).toBeVisible();
    await expect(frame.locator('.'+ticket).first()).toBeVisible();

    if(id==='02-scrapbook') await page.locator('#liveFrame').evaluate((iframe,p)=>iframe.contentWindow.postMessage({type:'OE_SHOW_PAGE',page:p==='guests'?'home':p},location.origin),'guests'); else await page.locator('.page-nav [data-page="guests"]').click();
    await expect(frame.locator('.'+guest).first()).toBeVisible();

    if(id==='02-scrapbook') await page.locator('#liveFrame').evaluate((iframe,p)=>iframe.contentWindow.postMessage({type:'OE_SHOW_PAGE',page:p==='guests'?'home':p},location.origin),'activities'); else await page.locator('.page-nav [data-page="activities"]').click();
    await expect(frame.locator('.'+schedule).first()).toBeVisible();
    await frame.locator('[data-activity-view="programs"]').click();
    await expect(frame.locator('.'+activity).first()).toBeVisible();

    if(id==='02-scrapbook') await page.locator('#liveFrame').evaluate((iframe,p)=>iframe.contentWindow.postMessage({type:'OE_SHOW_PAGE',page:p==='guests'?'home':p},location.origin),'booths'); else await page.locator('.page-nav [data-page="booths"]').click();
    await expect(frame.locator('.'+booth).first()).toBeVisible();
    await frame.locator('[data-directory-view-btn="products"]').click();
    await expect(frame.locator('.'+product).first()).toBeVisible();

    if(id==='02-scrapbook') await page.locator('#liveFrame').evaluate((iframe,p)=>iframe.contentWindow.postMessage({type:'OE_SHOW_PAGE',page:p==='guests'?'home':p},location.origin),'guide'); else await page.locator('.page-nav [data-page="guide"]').click();
    await expect(frame.locator('.'+guide).first()).toBeVisible();
  });
}

test('internal component fingerprints are not shared between 02-07',async({page})=>{
  const fingerprints=[];
  for(const [id,ticket,guest,schedule,booth] of cases){
    await page.goto('/v8/?template='+id+'&project=fingerprint-'+id);
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.'+ticket).first()).toBeVisible();
    const fp=await frame.locator('.'+ticket).first().evaluate(el=>{
      const s=getComputedStyle(el);
      return [el.className,s.display,s.gridTemplateColumns,s.borderRadius,s.backgroundColor,s.boxShadow].join('|');
    });
    fingerprints.push(fp+'|'+guest+'|'+schedule+'|'+booth);
  }
  expect(new Set(fingerprints).size).toBe(cases.length);
});
