import {test,expect} from '@playwright/test';

const templates=['02-scrapbook','03-school-festival','04-museum-editorial','05-live-poster','06-expo-catalogue','07-immersive-character'];

for(const id of templates){
  test(id+' preserves the Template 01 functional contract',async({page})=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    await page.goto('/v8/?template='+id+'&project=parity-'+id);
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.hero')).toBeVisible();

    await expect(frame.locator('[data-oe-mount="updates"]')).toBeVisible();
    await expect(frame.locator('[data-oe-mount="quick"]')).toBeVisible();
    await expect(frame.locator('[data-oe-mount="tickets"] .ticket')).toHaveCount(3);
    await expect(frame.locator('[data-oe-mount="featured-activities"]')).toBeVisible();
    await expect(frame.locator('[data-oe-mount="map"]')).toBeVisible();

    await page.locator('.page-nav [data-page="booths"]').click();
    expect(await frame.locator('[data-oe-mount="booths"] [data-directory-card][data-kind="booth"]').count()).toBeGreaterThan(0);
    const search=frame.locator('[data-oe-mount="booths"] [data-directory-search]');
    await search.fill('星屑工房');
    await expect(frame.locator('[data-oe-mount="booths"] [data-directory-card][data-kind="booth"]:visible')).toHaveCount(1);

    await page.locator('.page-nav [data-page="activities"]').click();
    await expect(frame.locator('[data-oe-mount="schedule"] [data-oe-item="schedule"]')).not.toHaveCount(0);
    await expect(frame.locator('[data-oe-mount="activity-projects"]')).toBeAttached();

    await page.locator('.page-nav [data-page="guests"]').click();
    await expect(frame.locator('[data-oe-mount="guests"] [data-oe-item="guests"]')).not.toHaveCount(0);

    await page.locator('.page-nav [data-page="guide"]').click();
    await expect(frame.locator('[data-oe-mount="guide-detail"]')).toContainText('交通');

    await page.locator('.page-nav [data-page="home"]').click();
    await expect(frame.locator('[data-oe-mount="community"]')).toBeAttached();
    await expect(frame.locator('[data-oe-mount="footer-brand"]')).toContainText('STARDUST ONLY 2026');
    expect(errors,'renderer errors in '+id).toEqual([]);
  });
}

test('favorites and product wishlist also work outside Template 01',async({page})=>{
  await page.goto('/v8/?template=04-museum-editorial&project=parity-wishlist');
  const frame=page.frameLocator('#liveFrame');
  await expect(frame.locator('.hero')).toBeVisible();
  await page.locator('#previewBtn').click();
  await expect(frame.locator('#loader')).toBeHidden();

  await frame.locator('.nav [data-page-link="booths"]').click();
  const fav=frame.locator('[data-favorite-booth]').first();
  await fav.click();
  await expect(fav).toHaveAttribute('aria-pressed','true');

  await frame.locator('[data-directory-view-btn="products"]').click();
  const wish=frame.locator('[data-wishlist-product]').first();
  await wish.click();
  await expect(wish).toHaveAttribute('aria-pressed','true');
});

test('automatic lifecycle becomes ended after organizer end time',async({page})=>{
  await page.goto('/v8/?template=03-school-festival&project=auto-ended');
  await page.evaluate(async()=>{
    const mod=await import('/v8/templates/03-school-festival.js?v=8.36.2');
    const s=structuredClone(mod.template03.defaults);
    s.eventStatusMode='auto';
    s.eventStartDateTime='2000-01-01T10:00';
    s.eventEndDateTime='2000-01-01T18:00';
    s.ticketUrl='https://example.com/tickets';
    localStorage.setItem('onlyevent-studio-v8:03-school-festival:auto-ended:iframe',JSON.stringify(s));
  });
  await page.reload();
  const frame=page.frameLocator('#liveFrame');
  await expect(frame.locator('.event-status-badge')).toContainText('活动已结束');
  await page.locator('#previewBtn').click();
  await expect(frame.locator('.ticket-purchase-link').first()).toBeHidden();
});

test('automatic lifecycle stays upcoming before organizer start time',async({page})=>{
  await page.goto('/v8/?template=05-live-poster&project=auto-upcoming');
  await page.evaluate(async()=>{
    const mod=await import('/v8/templates/05-live-poster.js?v=8.36.2');
    const s=structuredClone(mod.template05.defaults);
    s.eventStatusMode='auto';
    s.eventStartDateTime='2999-01-01T10:00';
    s.eventEndDateTime='2999-01-01T18:00';
    localStorage.setItem('onlyevent-studio-v8:05-live-poster:auto-upcoming:iframe',JSON.stringify(s));
  });
  await page.reload();
  const frame=page.frameLocator('#liveFrame');
  await expect(frame.locator('.event-status-badge')).toContainText('活动未开始');
});
