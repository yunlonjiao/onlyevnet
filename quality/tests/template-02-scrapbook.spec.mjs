import {test,expect} from '@playwright/test';

test.describe('Template 02 scrapbook — Shared Core acceptance',()=>{
  test('keeps reference-led chrome instead of Template 01 chrome',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-reference');
    const frame=page.frameLocator('#liveFrame');

    await expect(frame.locator('.trip-header')).toBeVisible();
    await expect(frame.locator('.trip-mobile-nav a')).toHaveCount(5);
    await expect(frame.locator('.trip-index [data-oe-mount="quick"]')).toBeVisible();
    await expect(frame.locator('.trip-ribbon')).toHaveCount(0);
    await expect(frame.locator('.trip-mobile-dock')).toHaveCount(0);
    await expect(frame.locator('.trip-footer')).toBeVisible();
  });

  test('preserves direct editing and Shared Core content mounts',async({page})=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/v8/?template=02-scrapbook&project=template02-core');
    const frame=page.frameLocator('#liveFrame');

    await expect(frame.locator('.hero-title-1')).toHaveAttribute('contenteditable','true');
    await expect(frame.locator('.hero-copy p')).toHaveAttribute('contenteditable','true');
    await expect(frame.locator('.trip-hero-meta [data-oe-field="date"]').first()).toHaveAttribute('contenteditable','true');

    await expect(frame.locator('[data-oe-mount="tickets"] .scrap-pass')).toHaveCount(3);
    await expect(frame.locator('[data-oe-mount="featured-activities"]')).toBeVisible();
    await expect(frame.locator('[data-oe-mount="map"]')).toBeVisible();
    await expect(frame.locator('[data-oe-mount="community"]')).toBeAttached();

    expect(errors,'Template 02 must render without page/console errors').toEqual([]);
  });

  test('keeps booth search, favorites and product wishlist',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-directory');
    const frame=page.frameLocator('#liveFrame');

    await page.locator('.page-nav [data-page="booths"]').click();
    await expect(frame.locator('.scrap-booth').first()).toBeVisible();

    const search=frame.locator('[data-directory-search]');
    await search.fill('星屑工房');
    await expect(frame.locator('[data-directory-card][data-kind="booth"]:visible')).toHaveCount(1);

    const favorite=frame.locator('[data-favorite-booth]').first();
    await favorite.click();
    await expect(favorite).toHaveAttribute('aria-pressed','true');

    await frame.locator('[data-directory-view-btn="products"]').click();
    await expect(frame.locator('.scrap-product').first()).toBeVisible();
    const wish=frame.locator('[data-wishlist-product]').first();
    await wish.click();
    await expect(wish).toHaveAttribute('aria-pressed','true');
  });

  test('keeps activity schedule, activity detail, guest and guide linkage',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-relations');
    const frame=page.frameLocator('#liveFrame');

    await page.locator('.page-nav [data-page="activities"]').click();
    await expect(frame.locator('[data-oe-mount="schedule"] .scrap-itinerary')).not.toHaveCount(0);
    await frame.locator('[data-activity-view="programs"]').click();
    await expect(frame.locator('[data-oe-mount="activity-projects"] .scrap-activity').first()).toBeVisible();

    await page.locator('.page-nav [data-page="guests"]').click();
    await expect(frame.locator('[data-oe-mount="guests"] .scrap-guest').first()).toBeVisible();

    await page.locator('.page-nav [data-page="guide"]').click();
    await expect(frame.locator('[data-oe-mount="guide-detail"] .scrap-guide').first()).toBeVisible();
    await expect(frame.locator('[data-oe-mount="guide-detail"]')).toContainText('交通');
  });

  test('uses scrapbook entry animation and not Template 01 memorial-ticket styling',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-entry');
    const frame=page.frameLocator('#liveFrame');

    await page.locator('#previewBtn').click();
    await expect(frame.locator('#loader.scrap-entry')).toBeVisible();
    await expect(frame.locator('.scrap-entry-gate')).toBeVisible();

    const gateStyle=await frame.locator('.scrap-entry-gate').evaluate(el=>{
      const s=getComputedStyle(el);
      return {columns:s.gridTemplateColumns,bg:s.backgroundColor,borderRadius:s.borderRadius};
    });
    expect(gateStyle.columns).not.toContain('1.65fr');
    expect(gateStyle.borderRadius).not.toBe('22px');

    await frame.locator('.scrap-entry-gate').click();
    await expect.poll(()=>frame.locator('#loader').evaluate(el=>el.classList.contains('hide')),{timeout:5000}).toBe(true);
  });
  test('mirrors event identity across hero, navigation and entry ticket',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-mirrors');
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.trip-logo [data-oe-field="eventName"]')).toBeAttached();
    await expect(frame.locator('.trip-weather-strip [data-oe-field="eventName"]')).toBeAttached();
    await expect(frame.locator('.scrap-entry [data-oe-field="eventName"]')).toHaveAttribute('contenteditable','false');
    await expect(frame.locator('.trip-logo [data-oe-field="eventName"]')).toHaveAttribute('contenteditable','true');
    const names=await frame.locator('.trip-site [data-oe-field="eventName"]').allTextContents();
    expect(new Set(names.map(name=>name.trim())).size).toBe(1);
    const dates=await frame.locator('.trip-site [data-oe-field="date"]').allTextContents();
    expect(new Set(dates.map(value=>value.trim())).size).toBe(1);
  });

  test('Template 02 honors hidden purchase links regardless of layout CSS',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-hidden');
    const frame=page.frameLocator('#liveFrame');
    await frame.locator('.trip-ticket').evaluate(el=>el.setAttribute('hidden',''));
    await expect(frame.locator('.trip-ticket')).toBeHidden();
    await frame.locator('.trip-ticket').evaluate(el=>el.removeAttribute('hidden'));
  });

  test('lime announcement strip is mounted from editable CMS ribbons',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-ribbon-qa');
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.trip-route-ticker.ribbon .ribbon-track')).toBeAttached();
    await expect(frame.locator('.trip-route-ticker .ribbon-sequence').first()).toBeAttached();
    await expect(frame.locator('.trip-route-ticker .ribbon-edit').first()).toHaveAttribute('data-oe-field',/ribbonItems\\.\\d+\\.text/);
  });
  test('guest directory scrolls horizontally with snap alignment',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-guests-qa');
    const frame=page.frameLocator('#liveFrame');
    await frame.locator('#guests').evaluate(el=>el.style.display='block');
    const layout=await frame.locator('#guests .guest-grid').evaluate(el=>{
      const style=getComputedStyle(el);
      return {display:style.display,overflowX:style.overflowX,snap:style.scrollSnapType};
    });
    expect(layout.display).toBe('flex');
    expect(layout.overflowX).toBe('auto');
    expect(layout.snap).toContain('x');
  });

  test('Chinese inner page titles and guide maps do not overlap header or collapse',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-zh-layout');
    const frame=page.frameLocator('#liveFrame');
    await page.locator('.page-nav [data-page="guide"]').click();
    await expect(frame.locator('#guide')).toBeVisible();
    await expect(frame.locator('.trip-route-ticker')).toBeHidden();
    const bounds=await frame.locator('.trip-header, #guide .trip-page-head, #guide .scrap-guide').evaluateAll(nodes=>nodes.map(el=>{const b=el.getBoundingClientRect();return {top:b.top,bottom:b.bottom,width:b.width}}));
    expect(bounds.length).toBeGreaterThanOrEqual(3);
    expect(bounds[1].top).toBeGreaterThanOrEqual(bounds[0].bottom-2);
    expect(bounds[2].width).toBeGreaterThan(250);
    const bodyOverflow=await frame.locator('body').evaluate(el=>el.scrollWidth-document.documentElement.clientWidth);
    expect(bodyOverflow).toBeLessThanOrEqual(2);
  });

});
