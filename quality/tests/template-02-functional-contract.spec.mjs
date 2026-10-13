import {test,expect} from '@playwright/test';

const url='/v8/?template=02-scrapbook&project=template02-full-contract';

async function open(page){
  await page.goto(url);
  const frame=page.frameLocator('#liveFrame');
  await expect(frame.locator('.trip-header')).toBeVisible();
  return frame;
}

async function assertNoHorizontalOverflow(frame){
  const overflow=await frame.locator('html').evaluate(el=>el.scrollWidth>el.clientWidth+1);
  expect(overflow).toBe(false);
}

test.describe('Template 02 — markdown functional contract regression',()=>{
  test('required semantic mounts are present',async({page})=>{
    const frame=await open(page);
    const mounts=[
      'updates','quick','tickets','ticket-actions','featured-activities','map','map-links',
      'booths','activity-days','schedule','activity-projects','guests','guide-detail',
      'community','sponsors','footer-brand','footer-participate','footer-visit','footer-social'
    ];
    for(const name of mounts)await expect(frame.locator('[data-oe-mount="'+name+'"]')).toBeAttached();
  });

  test('desktop navigation reaches every standalone page and returns home',async({page})=>{
    const frame=await open(page);
    for(const id of ['booths','activities','guests','guide']){
      await page.locator('.page-nav [data-page="'+id+'"]').click();
      await expect(frame.locator('#'+id)).toBeVisible();
      await page.locator('.page-nav [data-page="home"]').click();
      await expect(frame.locator('#home')).toBeVisible();
    }
  });

  test('booth search, favorite, product switch, wishlist and image affordance work',async({page})=>{
    const frame=await open(page);
    await page.locator('.page-nav [data-page="booths"]').click();

    const search=frame.locator('[data-directory-search]');
    await search.fill('星屑工房');
    await expect(frame.locator('[data-directory-card][data-kind="booth"]:visible')).toHaveCount(1);
    await search.fill('');

    const favorite=frame.locator('[data-favorite-booth]').first();
    const before=await favorite.getAttribute('aria-pressed');
    await favorite.click();
    await expect(favorite).toHaveAttribute('aria-pressed',before==='true'?'false':'true');

    await frame.locator('[data-directory-view-btn="products"]').click();
    await expect(frame.locator('.scrap-product').first()).toBeVisible();
    const wish=frame.locator('[data-wishlist-product]').first();
    const wishBefore=await wish.getAttribute('aria-pressed');
    await wish.click();
    await expect(wish).toHaveAttribute('aria-pressed',wishBefore==='true'?'false':'true');

    await expect(frame.locator('.directory-product-image').first()).toBeVisible();
  });

  test('activity day tabs and timeline/program switch change real content',async({page})=>{
    const frame=await open(page);
    await page.locator('.page-nav [data-page="activities"]').click();

    await expect(frame.locator('[data-oe-mount="schedule"] .scrap-itinerary').first()).toBeVisible();
    const dayTabs=frame.locator('[data-oe-mount="activity-days"] [data-activity-day]');
    if(await dayTabs.count()>1){
      await dayTabs.nth(1).click();
      await expect(dayTabs.nth(1)).toHaveClass(/active/);
    }

    await frame.locator('[data-activity-view="programs"]').click();
    await expect(frame.locator('[data-activity-panel="programs"]')).toBeVisible();
    await expect(frame.locator('[data-oe-mount="activity-projects"] .scrap-activity').first()).toBeVisible();

    await frame.locator('[data-activity-view="timeline"]').click();
    await expect(frame.locator('[data-activity-panel="timeline"]')).toBeVisible();
  });

  test('guest, guide and map surfaces render usable content',async({page})=>{
    const frame=await open(page);

    await page.locator('.page-nav [data-page="guests"]').click();
    await expect(frame.locator('[data-oe-mount="guests"] .scrap-guest').first()).toBeVisible();

    await frame.locator('.section-back').click();
    await expect(frame.locator('[data-oe-mount="map"]')).toBeVisible();
    await expect(frame.locator('[data-oe-mount="map-links"]')).toBeAttached();

    await page.locator('.page-nav [data-page="guide"]').click();
    await expect(frame.locator('[data-oe-mount="guide-detail"] .scrap-guide').first()).toBeVisible();
  });

  test('entry animation is keyboard reachable and dismisses without blocking content',async({page})=>{
    const frame=await open(page);
    await page.locator('#previewBtn').click();
    const gate=frame.locator('.trip-opening-gate');
    await expect(gate).toBeVisible();
    await expect(gate).toHaveAttribute('tabindex','0');
    await gate.focus();
    await page.keyboard.press('Enter');
    await expect.poll(()=>frame.locator('#loader').evaluate(el=>el.classList.contains('hide')),{timeout:5000}).toBe(true);
    await expect(frame.locator('#home')).toBeVisible();
  });

  for(const viewport of [
    {name:'desktop-1440',width:1440,height:1000},
    {name:'tablet-1024',width:1024,height:900},
    {name:'tablet-768',width:768,height:900},
    {name:'mobile-430',width:430,height:900},
    {name:'mobile-390',width:390,height:844}
  ]){
    test('responsive '+viewport.name+' has no horizontal overflow and usable CTA',async({page})=>{
      await page.setViewportSize({width:viewport.width,height:viewport.height});
      const frame=await open(page);
      await assertNoHorizontalOverflow(frame);
      const navVisible=await frame.locator('.trip-nav').isVisible().catch(()=>false);
      const mobileVisible=await frame.locator('.trip-mobile-nav').isVisible().catch(()=>false);
      expect(navVisible||mobileVisible).toBe(true);
      await expect(frame.locator('.trip-ticket')).toBeVisible();
    });
  }

  test('reduced motion keeps core content available',async({page})=>{
    await page.emulateMedia({reducedMotion:'reduce'});
    const frame=await open(page);
    await expect(frame.locator('#home')).toBeVisible();
    await expect(frame.locator('[data-oe-mount="quick"]')).toBeVisible();
    await expect(frame.locator('[data-oe-mount="updates"]')).toBeAttached();
  });

  test('no console-breaking errors during primary visitor path',async({page})=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    const frame=await open(page);

    for(const id of ['booths','activities','guests','guide']){
      await page.locator('.page-nav [data-page="'+id+'"]').click();
      await expect(frame.locator('#'+id)).toBeVisible();
      await page.locator('.page-nav [data-page="home"]').click();
    }
    expect(errors).toEqual([]);
  });
});
