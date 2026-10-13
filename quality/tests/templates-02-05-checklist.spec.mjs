import {test,expect} from '@playwright/test';

const templates=[
  {id:'02-scrapbook',segments:3,signature:'.trip-site'},
  {id:'03-school-festival',segments:3,signature:'.catalog-layout'},
  {id:'04-museum-editorial',segments:2,signature:'.df-hero'},
  {id:'05-live-poster',segments:3,signature:'.live-hero'}
];

async function open(page,id){
  await page.goto('/v8/?template='+id+'&project=checklist-'+id);
  const frame=page.frameLocator('#liveFrame');
  await expect(frame.locator('body')).toBeVisible();
  return frame;
}

async function patch(page,path,value){
  await page.evaluate(({path,value})=>{
    document.querySelector('#liveFrame')?.contentWindow?.postMessage({type:'OE_PATCH_FIELD',path,value},location.origin);
  },{path,value});
}

for(const template of templates){
  test.describe(template.id+' — latest Template 01 capability checklist',()=>{
    test('uses an independent visual shell and editable event identity',async({page})=>{
      const frame=await open(page,template.id);
      await expect(frame.locator(template.signature)).toBeAttached();
      await expect(frame.locator('[data-oe-field="eventName"]').first()).toBeAttached();
      await expect(frame.locator('[data-oe-field="tagline"]').first()).toBeAttached();
      await expect(frame.locator('.kv[data-oe-image="heroImage"]').first()).toBeAttached();

      const heroTitleFields=frame.locator('.hero [data-oe-field^="heroTitle"]');
      await expect(heroTitleFields).toHaveCount(template.segments);
      for(let i=0;i<template.segments;i++)await expect(heroTitleFields.nth(i)).toHaveAttribute('contenteditable','true');
    });

    test('has shared business mounts without inheriting Template 01 UI',async({page})=>{
      const frame=await open(page,template.id);
      const mounts=[
        'nav-links','mobile-nav','updates','quick','featured-activities','tickets','ticket-actions',
        'map','map-links','booths','activity-days','schedule','activity-projects','guests',
        'guide-detail','community','sponsors','footer-brand','footer-participate','footer-visit','footer-social'
      ];
      for(const name of mounts)await expect(frame.locator('[data-oe-mount="'+name+'"]')).toBeAttached();
    });

    test('core fields mirror from one source of truth',async({page})=>{
      const frame=await open(page,template.id);
      await patch(page,'date','12.24 WED');
      await patch(page,'location','上海');
      await patch(page,'edition','上海新国际博览中心');
      for(const el of await frame.locator('[data-oe-field="date"]').all())await expect(el).toHaveText('12.24 WED');
      for(const el of await frame.locator('[data-oe-field="location"]').all())await expect(el).toHaveText('上海');
      for(const el of await frame.locator('[data-oe-field="edition"]').all())await expect(el).toHaveText('上海新国际博览中心');
    });

    test('lifecycle state updates template-native status surfaces',async({page})=>{
      const frame=await open(page,template.id);
      const status=frame.locator('[data-oe-lifecycle-status]').first();
      await expect(status).toBeAttached();
      await patch(page,'eventStatusMode','manual');
      await patch(page,'eventStatus','live');
      await expect(status).toHaveText('活动进行中');
      await patch(page,'eventStatus','ended');
      await expect(status).toHaveText('活动已结束');
    });

    test('booth and product visitor interactions survive the visual template',async({page})=>{
      const frame=await open(page,template.id);
      await page.locator('.page-nav [data-page="booths"]').click();
      const booth=frame.locator('[data-oe-mount="booths"] [data-oe-item="booths"]').first();
      await expect(booth).toBeVisible();

      const fav=frame.locator('[data-favorite-booth]').first();
      const before=await fav.getAttribute('aria-pressed');
      await fav.click();
      await expect(fav).toHaveAttribute('aria-pressed',before==='true'?'false':'true');

      await frame.locator('[data-directory-view-btn="products"]').click();
      await expect(frame.locator('[data-product-edit-booth]').first()).toBeVisible();
      const wish=frame.locator('[data-wishlist-product]').first();
      const wBefore=await wish.getAttribute('aria-pressed');
      await wish.click();
      await expect(wish).toHaveAttribute('aria-pressed',wBefore==='true'?'false':'true');
    });

    test('schedule/program/guest/guide pages expose semantic editable items',async({page})=>{
      const frame=await open(page,template.id);
      await page.locator('.page-nav [data-page="activities"]').click();
      await expect(frame.locator('[data-oe-item="schedule"]').first()).toBeVisible();
      await frame.locator('[data-activity-view="programs"]').click();
      await expect(frame.locator('[data-oe-item="participation"]').first()).toBeVisible();

      await page.locator('.page-nav [data-page="guests"]').click();
      await expect(frame.locator('[data-oe-item="guests"]').first()).toBeVisible();

      await page.locator('.page-nav [data-page="guide"]').click();
      await expect(frame.locator('[data-oe-item="guide"]').first()).toBeVisible();
    });

    for(const viewport of [
      {name:'desktop',width:1440,height:1000},
      {name:'tablet',width:1024,height:900},
      {name:'mobile',width:390,height:844}
    ]){
      test('responsive '+viewport.name+' has no page overflow',async({page})=>{
        await page.setViewportSize({width:viewport.width,height:viewport.height});
        const frame=await open(page,template.id);
        const overflow=await frame.locator('html').evaluate(el=>el.scrollWidth>el.clientWidth+1);
        expect(overflow).toBe(false);
        const desktop=await frame.locator('[data-oe-mount="nav-links"]').isVisible().catch(()=>false);
        const mobile=await frame.locator('[data-oe-mount="mobile-nav"]').isVisible().catch(()=>false);
        expect(desktop||mobile).toBe(true);
      });
    }
  });
}
