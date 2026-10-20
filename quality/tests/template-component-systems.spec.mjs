import {test,expect} from '@playwright/test';

const systems=[
  ['02-scrapbook','.scrap-pass','.scrap-guest','.scrap-itinerary','.scrap-activity'],
  ['03-school-festival','.school-ticket-card','.school-profile','.school-timetable','.school-activity'],
  ['04-museum-editorial','.museum-admission','.museum-portrait','.museum-program-row','.museum-activity'],
  ['05-live-poster','.live-pass','.live-performer','.live-running-order','.live-activity'],
  ['06-expo-catalogue','.expo-ticket-row','.expo-guest-row','.expo-program-row','.expo-activity-row'],
  ['07-immersive-character','.kimetsu-admission','.kimetsu-person','.kimetsu-program','.kimetsu-activity']
];

for(const [id,ticket,guest,schedule,activity] of systems){
  test(id+' uses its own internal component system',async({page})=>{
    await page.goto('/v8/?template='+id+'&project=component-'+id);
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.hero')).toBeVisible();

    await expect(frame.locator(ticket).first()).toBeVisible();

    await (id==='02-scrapbook' ? frame.locator('[data-page-link="guests"]:visible').first() : page.locator('.page-nav [data-page="guests"]')).click();
    await expect(frame.locator(guest).first()).toBeVisible();

    await (id==='02-scrapbook' ? frame.locator('[data-page-link="activities"]:visible').first() : page.locator('.page-nav [data-page="activities"]')).click();
    await expect(frame.locator(schedule).first()).toBeVisible();
    await frame.locator('.activity-view-tabs [data-activity-view="programs"]').click();
    await expect(frame.locator(activity).first()).toBeVisible();
  });
}

test('component geometries differ materially between the six visual systems',async({page})=>{
  const signatures=[];
  for(const [id,ticket] of systems){
    await page.goto('/v8/?template='+id+'&project=geometry-'+id);
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator(ticket).first()).toBeVisible();
    const sig=await frame.locator(ticket).first().evaluate(el=>{
      const cs=getComputedStyle(el),r=el.getBoundingClientRect();
      return [
        cs.display,
        cs.gridTemplateColumns,
        cs.borderRadius,
        cs.backgroundColor,
        cs.boxShadow,
        Math.round(r.width/r.height*10)/10
      ].join('|');
    });
    signatures.push(sig);
  }
  expect(new Set(signatures).size).toBeGreaterThanOrEqual(5);
});


test('02-07 use native quick-navigation and map-link components',async({page})=>{
  const expected={
    '02-scrapbook':['.scrap-index-card','.scrap-map-tag'],
    '03-school-festival':['.school-wayfinding-card','.school-map-sign'],
    '04-museum-editorial':['.museum-index-link','.museum-map-index'],
    '05-live-poster':['.live-menu-tile','.live-venue-link'],
    '06-expo-catalogue':['.expo-index-row','.expo-area-link'],
    '07-immersive-character':['.kimetsu-path-link','.kimetsu-map-link']
  };
  for(const [id,[quick,map]] of Object.entries(expected)){
    await page.goto('/v8/?template='+id+'&project=native-nav-'+id);
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator(quick).first()).toBeVisible();
    await expect(frame.locator(map).first()).toBeVisible();
    await expect(frame.locator('.quick-card')).toHaveCount(0);
    await expect(frame.locator('.map-jump-tag')).toHaveCount(0);
  }
});


test('02-07 keep native header/footer while presentation chrome follows each reference design',async({page})=>{
  const expected={
    '02-scrapbook':['.trip-header','.trip-footer'],
    '03-school-festival':['.school-nav','.school-footer'],
    '04-museum-editorial':['.museum-nav','.museum-footer'],
    '05-live-poster':['.live-nav','.live-footer'],
    '06-expo-catalogue':['.expo-nav','.expo-footer'],
    '07-immersive-character':['.kimetsu-nav','.kimetsu-footer']
  };
  for(const [id,selectors] of Object.entries(expected)){
    await page.goto('/v8/?template='+id+'&project=native-chrome-'+id);
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator(selectors[0])).toBeVisible();
    await expect(frame.locator(selectors[1])).toBeVisible();
  }

  await page.goto('/v8/?template=02-scrapbook&project=scrap-reference-chrome');
  const scrapbook=page.frameLocator('#liveFrame');
  await expect(scrapbook.locator('.scrap-entry-gate')).toBeAttached();
  await expect(scrapbook.locator('.trip-mobile-nav a')).toHaveCount(5);
  await expect(scrapbook.locator('.trip-ribbon')).toHaveCount(0);
  await expect(scrapbook.locator('.trip-mobile-dock')).toHaveCount(0);
});
