import {test,expect} from '@playwright/test';

const systems=[
  ['02-scrapbook','.scrap-pass','.scrap-polaroid','.scrap-diary-entry','.scrap-activity-page'],
  ['03-school-festival','.school-admission','.school-profile','.school-period','.school-program-card'],
  ['04-museum-editorial','.museum-admission','.museum-portrait','.museum-programme-row','.museum-program-object'],
  ['05-live-poster','.live-pass','.live-performer','.live-slot','.live-program-card'],
  ['06-expo-catalogue','.expo-ticket-row','.expo-guest-row','.expo-schedule-row','.expo-program-row'],
  ['07-immersive-character','.imm-admission-slip','.imm-character','.imm-chronicle-row','.imm-event']
];

for(const [id,ticket,guest,schedule,activity] of systems){
  test(id+' uses its own internal component system',async({page})=>{
    await page.goto('/v8/?template='+id+'&project=component-'+id);
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.hero')).toBeVisible();

    await expect(frame.locator(ticket).first()).toBeVisible();

    await page.locator('.page-nav [data-page="guests"]').click();
    await expect(frame.locator(guest).first()).toBeVisible();

    await page.locator('.page-nav [data-page="activities"]').click();
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
