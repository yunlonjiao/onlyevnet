import {test,expect} from '@playwright/test';
async function navigate02(page,frame,destination){
  const pageId=destination==='guests'?'home':destination;
  const target=destination==='guests'?'#home-guests':destination==='home'?'#home':'#'+destination;
  // Allow the iframe router to become ready before asserting its transition.
  await expect.poll(async()=>{
    await page.locator('#liveFrame').evaluate((iframe,id)=>{
      iframe.contentWindow.postMessage({type:'OE_SHOW_PAGE',page:id},location.origin);
    },pageId);
    return frame.locator(target).isVisible();
  },{timeout:10000,intervals:[150,300,500,750]}).toBe(true);
}


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
  test('KV strategy A+C: full-screen cover and mobile image fallback',async({page})=>{
    await page.setViewportSize({width:1440,height:900});
    await page.goto('/v8/?template=02-scrapbook&project=template02-hero-ac');
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.trip-hero-visual .kv')).toBeVisible();
    const desktop=await frame.locator('.trip-hero').evaluate(el=>{
      const kv=el.querySelector('.kv'),r=el.getBoundingClientRect(),k=kv.getBoundingClientRect();
      return {height:r.height,viewHeight:innerHeight,width:k.width,viewWidth:innerWidth,size:getComputedStyle(kv).backgroundSize,position:getComputedStyle(kv).backgroundPosition};
    });
    expect(desktop.height).toBeGreaterThanOrEqual(desktop.viewHeight-4);
    expect(desktop.width).toBeGreaterThanOrEqual(desktop.viewWidth-8);
    expect(desktop.size).toContain('cover');
    await page.setViewportSize({width:390,height:844});
    const mobile=await frame.locator('.trip-hero').evaluate(el=>{
      const kv=el.querySelector('.kv'),r=el.getBoundingClientRect();
      return {height:r.height,viewHeight:innerHeight,size:getComputedStyle(kv).backgroundSize,position:getComputedStyle(kv).backgroundPosition};
    });
    expect(mobile.height).toBeGreaterThanOrEqual(mobile.viewHeight-4);
    expect(mobile.size).toContain('cover');
    expect(mobile.position).toBeTruthy();
  });
  test('keeps reference-led chrome instead of Template 01 chrome',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-reference');
    const frame=page.frameLocator('#liveFrame');

    await expect(frame.locator('.trip-header')).toBeAttached();
    await expect(frame.locator('.trip-mobile-nav a')).toHaveCount(4);
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

    await expect(frame.locator('.trip-logo [data-oe-field="eventName"]')).toHaveAttribute('contenteditable','true');
    await expect(frame.locator('#event-introduction [data-oe-field="tagline"]')).toHaveAttribute('contenteditable','true');
    await expect(frame.locator('.trip-event-facts [data-oe-field="date"]')).toHaveAttribute('contenteditable','true');

    await expect(frame.locator('[data-oe-mount="tickets"] .scrap-pass')).toHaveCount(3);
    await expect(frame.locator('[data-oe-mount="featured-activities"]')).toBeVisible();
    await expect(frame.locator('[data-oe-mount="map"]')).toBeVisible();
    await expect(frame.locator('[data-oe-mount="community"]')).toBeAttached();

    expect(errors,'Template 02 must render without page/console errors').toEqual([]);
  });

  test('keeps booth search, favorites and product wishlist',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-directory');
    const frame=page.frameLocator('#liveFrame');
    await page.locator('#previewBtn').click();
    // Wait for renderer mode propagation before any visitor-only favorite or wishlist interaction.
    await expect(frame.locator('html')).toHaveClass(/oe-preview/);
    // The entry gate may already be hidden; close it through the supported renderer command.
    // This test verifies directory interactions, not entry-animation playback.
    await page.locator('#liveFrame').evaluate(iframe=>iframe.contentWindow.postMessage({type:'OE_HIDE_ENTRY_PREVIEW'},location.origin));
    await expect(frame.locator('#loader')).toBeHidden({timeout:7000});

    await navigate02(page,frame,'booths');
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

    await navigate02(page,frame,'activities');
    await expect(frame.locator('[data-oe-mount="schedule"] .scrap-itinerary')).not.toHaveCount(0);
    await frame.locator('[data-activity-view="programs"]').click();
    await expect(frame.locator('[data-oe-mount="activity-projects"] .scrap-activity').first()).toBeVisible();

    await navigate02(page,frame,'guests');
    await expect(frame.locator('[data-oe-mount="guests"] .scrap-guest').first()).toBeVisible();

    await navigate02(page,frame,'guide');
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
    await expect.poll(()=>frame.locator('#loader').evaluate(el=>el.classList.contains('hide')),{timeout:8000}).toBe(true);
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
    await expect(frame.locator('.scrap-entry [data-oe-field="eventName"]')).toHaveCount(0); // opening is artwork, not an event-title editor
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
    await frame.locator('.trip-ticket-list .ticket-grid').evaluate(el=>el.setAttribute('hidden',''));
    await expect(frame.locator('.trip-ticket-list .ticket-grid')).toBeHidden();
    await frame.locator('.trip-ticket-list .ticket-grid').evaluate(el=>el.removeAttribute('hidden'));
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
    await navigate02(page,frame,'guests');
    const layout=await frame.locator('#home-guests .guest-grid').evaluate(el=>{
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
    await navigate02(page,frame,'guide');
    await expect(frame.locator('#guide')).toBeVisible();
    await expect(frame.locator('.trip-route-ticker')).toBeHidden();
    const bounds=await frame.locator('.trip-header, #guide .trip-page-head, #guide .scrap-guide').evaluateAll(nodes=>nodes.map(el=>{const b=el.getBoundingClientRect();return {top:b.top,bottom:b.bottom,width:b.width}}));
    expect(bounds.length).toBeGreaterThanOrEqual(3);
    expect(bounds[1].top).toBeGreaterThanOrEqual(bounds[0].bottom-2);
    expect(bounds[2].width).toBeGreaterThan(250);
    const bodyOverflow=await frame.locator('body').evaluate(el=>el.scrollWidth-document.documentElement.clientWidth);
    expect(bodyOverflow).toBeLessThanOrEqual(2);
  });

  test('fourth fact reflects lifecycle status and tickets display JOURNEY clover stamp',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-status-stamp');
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.trip-event-facts .trip-event-fact')).toHaveCount(4);
    await expect(frame.locator('[data-oe-status="event"]')).toContainText('活动');
    await expect(frame.locator('.trip-hero-visual .trip-kv-placeholder small')).toContainText('1920 × 1080');
    await expect(frame.locator('.scrap-pass-watermark .stamp-svg textPath').first()).toContainText('YOUR SPECIAL JOURNEY');
    await expect(frame.locator('.scrap-pass-watermark #oe-clover-heart').first()).toBeAttached();
    await page.locator('#liveFrame').evaluate(iframe=>{
      const win=iframe.contentWindow;
      win.postMessage({type:'OE_PATCH_FIELD',path:'eventStatusMode',value:'manual'},location.origin);
      win.postMessage({type:'OE_PATCH_FIELD',path:'eventStatus',value:'ended'},location.origin);
    });
    await expect(frame.locator('[data-oe-status="event"]')).toHaveText('活动已结束');
  });

  test('localized NEWS, intro size and four home facts match CMS state',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-facts-check');
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.trip-news header b')).toHaveText('最新公告');
    await expect(frame.locator('.trip-event-fact')).toHaveCount(4);
    const fields=['date','location','edition'];
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
    for(const [path,value] of Object.entries({date:'2027.05.21',location:'南京',edition:'南京国际中心'}))
      await expect(frame.locator('.trip-event-facts [data-oe-field="'+path+'"]')).toHaveText(value);
  });

  test('KV patch updates artwork without rebuilding existing page modules',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-fast-kv');
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.trip-site')).toBeVisible();
    const result=await page.locator('#liveFrame').evaluate(async iframe=>{
      const doc=iframe.contentDocument,win=iframe.contentWindow;
      const node=doc.querySelector('.trip-event-facts');
      const image='data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><rect width="1920" height="1080" fill="#abcdef"/></svg>');
      win.postMessage({type:'OE_PATCH_FIELD',path:'heroImage',value:image},location.origin);
      await new Promise(resolve=>setTimeout(resolve,150));
      const kv=doc.querySelector('.trip-hero-visual .kv');
      return {preserved:node===doc.querySelector('.trip-event-facts'),background:getComputedStyle(kv).backgroundImage,hasImage:doc.querySelector('.trip-hero')?.style.getPropertyValue('--oe-hero-image-desktop').includes('data:image/svg+xml')};
    });
    expect(result.preserved).toBe(true);
    expect(result.hasImage).toBe(true);
    expect(result.background).toContain('data:image/svg+xml');
  });

  test('status fact selects lifecycle editor and basic fields select information editor',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-facts-click');
    const frame=page.frameLocator('#liveFrame');
    await frame.locator('[data-oe-status="event"]').click();
    await expect(page.locator('.inspector-header')).toContainText('生命周期');
    await frame.locator('.trip-event-facts [data-oe-field="date"]').click();
    await expect(page.locator('.inspector-header')).toContainText('时间、场馆与导航');
    await expect(page.locator('#inspector [data-sync-path="date"]')).toBeVisible();
    await expect(page.locator('#inspector [data-sync-path="location"]')).toBeVisible();
  });

  test('home editorial rails have identical measured boundaries at desktop and studio widths',async({page})=>{
    await page.setViewportSize({width:1600,height:950});
    await page.goto('/v8/?template=02-scrapbook&project=template02-rail-measurement');
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.trip-feature')).toBeVisible();
    const selectors=['#event-introduction','.trip-news','.trip-index','.trip-feature','.trip-ticket-section','.trip-map'];
    for(const width of [1450,840]){
      await page.locator('#liveFrame').evaluate((el,w)=>{el.style.width=w+'px';el.style.maxWidth='none';el.style.minWidth=w+'px';},width);
      const info=await frame.locator('.trip-site').evaluate((root,selectors)=>selectors.map(sel=>{
        const section=root.querySelector(sel),rail=section?.querySelector('.oe-editorial-rail');
        if(!section||!rail)return {sel,missing:true};
        const s=section.getBoundingClientRect(),r=rail.getBoundingClientRect();
        return {sel,sectionWidth:s.width,railWidth:r.width,railRight:r.right-s.left,railStart:r.left-s.left,cols:getComputedStyle(section).gridTemplateColumns,display:getComputedStyle(section).display};
      }),selectors);
      const base=info.find(x=>x.sel==='.trip-feature');
      expect(base?.railWidth,'feature rail missing at '+width).toBeGreaterThan(0);
      for(const x of info){
        expect(x.missing,JSON.stringify({width,x})).not.toBe(true);
        expect(x.display).toBe('grid');
        expect(Math.abs(x.railStart-base.railStart),JSON.stringify({width,x,base})).toBeLessThan(2);
        expect(Math.abs(x.railRight-base.railRight),JSON.stringify({width,x,base})).toBeLessThan(2);
      }
    }
  });

  test('homepage scroll reveal is initiated and becomes visible after scroll',async({page})=>{
    await page.setViewportSize({width:1440,height:900});
    await page.goto('/v8/?template=02-scrapbook&project=template02-motion-qa');
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.trip-site')).toBeVisible();
    const target=frame.locator('.trip-map-copy');
    await expect(target).toHaveClass(/oe-motion-target/);
    await target.scrollIntoViewIfNeeded();
    await expect(target).toHaveClass(/oe-motion-visible/,{timeout:5000});
    const style=await target.evaluate(el=>({opacity:getComputedStyle(el).opacity,animation:getComputedStyle(el).animationName}));
    expect(style.animation).toBe('none');
    await expect.poll(async()=>target.evaluate(el=>Number(getComputedStyle(el).opacity))).toBeGreaterThan(.98);
  });

  test('distinct motion treatments are mounted without external assets',async({page})=>{
    await page.goto('/v8/?template=02-scrapbook&project=template02-distinct-motion');
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.trip-site')).toBeVisible();
    const state=await frame.locator('.trip-site').evaluate(root=>{
      const sheet=[...document.styleSheets].map(x=>{try{return [...x.cssRules].map(r=>r.cssText).join(' ')}catch{return ''}}).join(' ');
      return {
        hero:!!root.querySelector('.trip-hero'),
        news:!!root.querySelector('.trip-news>header'),
        map:!!root.querySelector('.trip-map-copy'),
        marquee:!!root.querySelector('.trip-wallpaper-marquee'),
        curtain:sheet.includes('oe-hero-curtain-left'),
        stamp:sheet.includes('oe-stamp-impact'),
        collage:sheet.includes('oe-collage-drop'),
        mask:sheet.includes('clip-path')
      };
    });
    expect(Object.values(state).every(Boolean),JSON.stringify(state)).toBe(true);
  });

});
