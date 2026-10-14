import {test,expect} from '@playwright/test';

test.describe('Template 02 scrapbook — Shared Core acceptance',()=>{
  test('iframe boot does not render Template 01 before Studio initialization',async({page})=>{
    await page.goto('/v8/render.html?v=8.40.19');
    await expect(page.locator('#oeBoot')).toContainText('Loading preview');
    await expect(page.locator('.brand')).toHaveCount(0);
    await expect(page.locator('.trip-site')).toHaveCount(0);
    await expect(page.locator('html')).not.toHaveAttribute('data-oe-template','01-ip-only');
  });
  test('Studio first mounted frame is the selected Template 02',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-no-flash');
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.trip-site')).toBeVisible();
    await expect(frame.locator('html')).toHaveAttribute('data-oe-template','02-scrapbook');
    await expect(frame.locator('.brand')).toHaveCount(0);
  });
  test('home KV fills viewport, event name sits on one line and NEWS grows with entries',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-fullscreen-qa');
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.trip-hero')).toBeVisible();
    const layout=await frame.locator('.trip-site').evaluate(el=>{
      const hero=el.querySelector('.trip-hero'),kv=el.querySelector('.trip-hero-visual .kv'),logo=el.querySelector('.trip-header .trip-logo b'),facts=el.querySelector('.trip-event-facts'),intro=el.querySelector('#event-introduction'),news=el.querySelector('.trip-news');
      const hr=hero.getBoundingClientRect(),kr=kv.getBoundingClientRect();
      return {heroHeight:hr.height,viewport:innerHeight,kvWidth:kr.width,viewportWidth:innerWidth,kvHeight:kr.height,nameWhiteSpace:getComputedStyle(logo).whiteSpace,background:getComputedStyle(kv).backgroundImage,order:!!(facts&&intro&&news&&(facts.compareDocumentPosition(intro)&Node.DOCUMENT_POSITION_FOLLOWING)&&(intro.compareDocumentPosition(news)&Node.DOCUMENT_POSITION_FOLLOWING)),topHeaderGone:!el.querySelector('.trip-flight-info')&&!el.querySelector('.trip-ticket')};
    });
    expect(layout.heroHeight).toBeGreaterThanOrEqual(layout.viewport-4);
    expect(layout.kvWidth).toBeGreaterThanOrEqual(layout.viewportWidth-8);
    expect(layout.kvHeight).toBeGreaterThanOrEqual(layout.viewport-4);
    expect(layout.nameWhiteSpace).toBe('nowrap');
    expect(layout.order).toBe(true);
    expect(layout.topHeaderGone).toBe(true);
  });
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
    await expect(frame.locator('.trip-flight-info [data-oe-field="date"]').first()).toHaveAttribute('contenteditable','true');

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
    await expect(frame.locator('.trip-weather-strip')).toHaveCount(0);
    await expect(frame.locator('.trip-event-fact')).toHaveCount(4);
    await expect(frame.locator('.trip-event-facts')).toBeVisible();
    const factsAboveIntro=await frame.locator('.trip-site').evaluate(el=>{
      const facts=el.querySelector('.trip-event-facts'),intro=el.querySelector('#event-introduction');
      return Boolean(facts&&intro&&(facts.compareDocumentPosition(intro)&Node.DOCUMENT_POSITION_FOLLOWING));
    });
    expect(factsAboveIntro).toBe(true);
    await expect(frame.locator('.scrap-entry [data-oe-field="eventName"]')).toHaveAttribute('contenteditable','false');
    await expect(frame.locator('.trip-logo [data-oe-field="eventName"]')).toHaveAttribute('contenteditable','true');
    const names=await frame.locator('.trip-site [data-oe-field="eventName"]').allTextContents();
    expect(new Set(names.map(name=>name.trim())).size).toBe(1);
    const dates=await frame.locator('.trip-site [data-oe-field="date"]').allTextContents();
    expect(new Set(dates.map(value=>value.trim())).size).toBe(1);
  });

  test('introduction precedes NEWS and duplicate hero summary is absent',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-intro-structure');
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('#event-introduction')).toBeVisible();
    await expect(frame.locator('#event-introduction [data-oe-field="tagline"]')).toBeVisible();
    await expect(frame.locator('.trip-weather-strip')).toHaveCount(0);
    await expect(frame.locator('.trip-hero-meta')).toHaveCount(0);
    const correctOrder=await frame.locator('.trip-site').evaluate(el=>{
      const intro=el.querySelector('#event-introduction'),news=el.querySelector('#updates'),hero=el.querySelector('#home');
      return !!(intro&&news&&hero&&(hero.compareDocumentPosition(intro)&Node.DOCUMENT_POSITION_FOLLOWING)&&(intro.compareDocumentPosition(news)&Node.DOCUMENT_POSITION_FOLLOWING));
    });
    expect(correctOrder).toBe(true);
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
    await expect(frame.locator('.trip-route-ticker .ribbon-edit').first()).toHaveAttribute('data-oe-field',/^ribbonItems[.][0-9]+[.]text$/);
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

  test('localized NEWS, intro size and four home facts match CMS state',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-facts-check');
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.trip-news header b')).toHaveText('最新公告');
    await expect(frame.locator('.trip-event-fact')).toHaveCount(4);
    const fields=['date','location','edition','eventName'];
    for(const field of fields)await expect(frame.locator('.trip-event-facts [data-oe-field="'+field+'"]')).toBeVisible();
    const heights=await frame.locator('#event-introduction').evaluate(el=>({height:el.getBoundingClientRect().height,visible:getComputedStyle(el).display!=='none'}));
    expect(heights.visible).toBe(true);
    expect(heights.height).toBeLessThan(390);
  });

  test('CMS event facts update all four displayed values without stale copies',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-facts-sync');
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.trip-event-facts')).toBeVisible();
    await page.locator('#liveFrame').evaluate(iframe=>{
      const data={eventName:'星辰ONLY中文测试',date:'2027.05.21',location:'南京',edition:'南京国际中心'};
      for(const [path,value] of Object.entries(data))iframe.contentWindow.postMessage({type:'OE_PATCH_FIELD',path,value},location.origin);
    });
    for(const [path,value] of Object.entries({eventName:'星辰ONLY中文测试',date:'2027.05.21',location:'南京',edition:'南京国际中心'}))
      await expect(frame.locator('.trip-event-facts [data-oe-field="'+path+'"]')).toHaveText(value);
  });

});
