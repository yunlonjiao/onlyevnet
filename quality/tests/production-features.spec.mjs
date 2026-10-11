import {test,expect} from '@playwright/test';

const STORAGE='onlyevent-studio-v8:01-ip-only:iframe';

async function setState(page,mutator){
  await page.goto('/v8/');
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeVisible();
  await page.evaluate(async({storage,source})=>{
    const mod=await import('/v8/templates/01-ip-only.js?v=8.35.0');
    const state=structuredClone(mod.template01.defaults);
    (0,eval)('('+source+')')(state);
    localStorage.setItem(storage,JSON.stringify(state));
  },{storage:STORAGE,source:mutator.toString()});
  await page.reload();
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeVisible();
  return page.frameLocator('#liveFrame');
}

test('mobile Studio exposes sidebar and inspector as drawers',async({page})=>{
  await page.setViewportSize({width:430,height:900});
  await page.goto('/v8/');
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeVisible();
  await expect(page.locator('#studioSidebar')).toBeHidden();
  await expect(page.locator('#inspector')).toBeHidden();

  await page.locator('#mobilePagesBtn').click();
  await expect(page.locator('#studioSidebar')).toBeVisible();
  await expect(page.locator('#mobilePanelBackdrop')).toBeVisible();

  await page.locator('#mobilePanelBackdrop').click({position:{x:410,y:120}});
  await expect(page.locator('#studioSidebar')).toBeHidden();

  await page.locator('#mobileInspectorBtn').click();
  await expect(page.locator('#inspector')).toBeVisible();
  await expect(page.locator('#mobilePanelBackdrop')).toBeVisible();
});

test('mobile KV can differ from desktop KV and keeps independent focal point',async({page})=>{
  const frame=await setState(page,s=>{
    s.heroImage='data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20"%3E%3Crect width="20" height="20" fill="red"/%3E%3C/svg%3E';
    s.mobileHeroImage='data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="30"%3E%3Crect width="20" height="30" fill="blue"/%3E%3C/svg%3E';
    s.heroFocalDesktop='20% 30%';
    s.heroFocalMobile='70% 40%';
  });
  const hero=frame.locator('.hero');
  await expect.poll(()=>hero.evaluate(el=>getComputedStyle(el).getPropertyValue('--oe-hero-image-desktop'))).toContain('data:image/svg+xml');
  await expect.poll(()=>hero.evaluate(el=>getComputedStyle(el).getPropertyValue('--oe-hero-image-mobile'))).toContain('data:image/svg+xml');
  await expect.poll(()=>hero.evaluate(el=>getComputedStyle(el).getPropertyValue('--oe-hero-focal-desktop').trim())).toBe('20% 30%');
  await expect.poll(()=>hero.evaluate(el=>getComputedStyle(el).getPropertyValue('--oe-hero-focal-mobile').trim())).toBe('70% 40%');

  await page.locator('#deviceMobileBtn').click();
  await expect.poll(()=>frame.locator('html').evaluate(()=>matchMedia('(max-width:560px)').matches)).toBe(true);
  const position=await frame.locator('.kv').evaluate(el=>getComputedStyle(el).backgroundPosition);
  expect(position).toContain('70% 40%');
});

test('lifecycle changes visitor emphasis and ended mode removes ticket CTA',async({page})=>{
  let frame=await setState(page,s=>{s.eventStatus='live';s.ticketUrl='https://example.com/tickets'});
  await expect(frame.locator('.event-status-badge')).toContainText('活动进行中');
  await page.locator('#previewBtn').click();
  await frame.locator('.gate').click();
  await expect.poll(()=>frame.locator('#loader').evaluate(el=>el.classList.contains('hide')),{timeout:5000}).toBe(true);
  await expect(frame.locator('.quick-grid .quick-card').first()).toHaveAttribute('data-page-link','activities');

  frame=await setState(page,s=>{s.eventStatus='ended';s.ticketUrl='https://example.com/tickets'});
  await expect(frame.locator('.event-status-badge')).toContainText('活动已结束');
  await page.locator('#previewBtn').click();
  await expect(frame.locator('.ticket-purchase-link')).toBeHidden();
  await expect(frame.locator('.nav>.wrap>.btn')).toBeHidden();
  await expect(frame.locator('.quick-grid [data-page-link="tickets"]')).toHaveCount(0);
});

test('broken images become graceful placeholders and content images are lazy-loaded',async({page})=>{
  const frame=await setState(page,s=>{
    s.guests=[{id:'g1',guestType:'person',name:'坏图嘉宾',role:'GUEST',members:'',attendanceNote:'',works:'',intro:'',image:'data:image/png;base64,broken',socialLinks:[]}];
    s.booths=[{id:'b1',no:'A01',name:'坏图社团',logo:'data:image/png;base64,broken',type:'测试',intro:'',products:[{id:'p1',name:'坏图制品',tag:'测试',price:'¥10',note:'',image:'data:image/png;base64,broken'}]}];
  });
  await page.locator('.page-nav [data-page="guests"]').click();
  await expect.poll(()=>frame.locator('#guests .guest-image').first().evaluate(el=>el.classList.contains('image-failed'))).toBe(true);
  const guestImg=frame.locator('#guests .guest-image img').first();
  await expect(guestImg).toHaveAttribute('loading','lazy');
  await expect(guestImg).toHaveAttribute('decoding','async');

  await page.locator('.page-nav [data-page="booths"]').click();
  await frame.locator('#booths [data-directory-view-btn="products"]').click();
  const productImg=frame.locator('#booths .directory-product-image img').first();
  await expect(productImg).toHaveAttribute('loading','lazy');
  await expect.poll(()=>frame.locator('#booths .directory-product-image').first().evaluate(el=>el.classList.contains('image-failed'))).toBe(true);
});

test('SEO and lifecycle are written into exported visitor HTML',async({page})=>{
  let requestBody=null;
  await page.route('https://convention-publisher.onlyevents.workers.dev/api/sites',async route=>{
    requestBody=route.request().postDataJSON();
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
      siteId:'seo-site',slug:'seo-test',url:'https://seo-test.onlyevent.cn',editToken:'seo-token'
    })});
  });

  await setState(page,s=>{
    s.eventName='SEO 测试活动';
    s.eventStatus='ended';
    s.ticketUrl='https://example.com/tickets';
    s.heroImage='https://example.com/kv.jpg';
    s.seo={
      pageTitle:'自定义页面标题',
      metaDescription:'这是搜索摘要。',
      canonical:'https://seo-test.onlyevent.cn/',
      ogTitle:'分享标题',
      ogDescription:'分享摘要',
      ogImage:'https://example.com/share.jpg'
    };
  });

  await page.locator('#publishBtn').click();
  await page.locator('#publishSlug').fill('seo-test');
  await page.locator('#publishPrimary').click();
  await expect.poll(()=>requestBody).not.toBeNull();

  const html=requestBody.html;
  expect(html).toContain('<title>自定义页面标题</title>');
  expect(html).toContain('name="description" content="这是搜索摘要。"');
  expect(html).toContain('rel="canonical" href="https://seo-test.onlyevent.cn/"');
  expect(html).toContain('property="og:title" content="分享标题"');
  expect(html).toContain('property="og:image" content="https://example.com/share.jpg"');
  expect(html).toContain('class="event-status-ended"');
  expect(html).not.toContain('href="https://example.com/tickets"');
  expect(html).toContain('loading="lazy"');
});

test('new production feature inspectors are present and editable',async({page})=>{
  await page.goto('/v8/');
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeVisible();

  await page.locator('[data-page-tool="lifecycle"]').click();
  await expect(page.locator('#inspector [data-event-status="upcoming"]')).toBeVisible();
  await expect(page.locator('#inspector [data-event-status="live"]')).toBeVisible();
  await expect(page.locator('#inspector [data-event-status="ended"]')).toBeVisible();

  await page.locator('[data-page-tool="hero"]').click();
  await expect(page.locator('#inspector [data-hero-image="heroImage"]')).toBeVisible();
  await expect(page.locator('#inspector [data-hero-image="mobileHeroImage"]')).toBeVisible();
  await expect(page.locator('#inspector [data-sync-path="heroFocalMobile"]')).toBeVisible();

  await page.locator('[data-page-tool="seo"]').click();
  await expect(page.locator('#inspector [data-seo-field="pageTitle"]')).toBeVisible();
  await expect(page.locator('#inspector [data-seo-field="metaDescription"]')).toBeVisible();
  await expect(page.locator('#inspector [data-seo-image]')).toBeVisible();
});
