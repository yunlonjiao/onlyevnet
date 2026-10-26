import {test,expect} from '@playwright/test';

test.use({viewport:{width:1440,height:900}});

const png=color=>'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="'+color+'"/></svg>');

async function open(page,id,project,patch){
  await page.goto('/v8/market-01-preview.html');
  await page.evaluate(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),['onlyevent-studio-v8:'+id+':'+project+':iframe',patch]);
  await page.goto('/v8/?template='+id+'&project='+project);
  const frame=page.frameLocator('#liveFrame');
  await expect(frame.locator('[data-oe-field="eventName"]').first()).toBeAttached();
  return frame;
}
async function exportHtml(page){
  return page.evaluate(()=>new Promise(resolve=>{
    addEventListener('message',e=>{if(e.data?.type==='OE_EXPORT_HTML_RESULT')resolve(e.data.html)});
    document.querySelector('#liveFrame').contentWindow.postMessage({type:'OE_EXPORT_HTML'},location.origin);
  }));
}

for(const id of ['01-ip-only','02-scrapbook','03-creator-market']){
  test(id+' keeps a single venue map unchanged',async({page})=>{
    const frame=await open(page,id,'one-map',{venueMap:{image:png('#3366cc'),links:[]}});
    await expect(frame.locator('#venueMap > .map-image-view img')).toHaveCount(1);
    await expect(frame.locator('[data-map-carousel]')).toHaveCount(0);
  });

  test(id+' lets visitors swipe between several venue maps, also when exported',async({page,browser})=>{
    const frame=await open(page,id,'many-maps',{venueMap:{image:png('#3366cc'),imageTitle:'一层',links:[],more:[{id:'m2',title:'二层',image:png('#cc3366')},{id:'m3',title:'',image:''}]}});
    await expect(frame.locator('#venueMap .map-slide')).toHaveCount(2);
    await expect(frame.locator('[data-map-count]')).toHaveText('1 / 2');
    await frame.locator('[data-map-step="1"]').click();
    await expect(frame.locator('[data-map-count]')).toHaveText('2 / 2');
    const visitor=await browser.newPage({viewport:{width:390,height:844}});
    const errors=[];visitor.on('pageerror',e=>errors.push(e.message));
    await visitor.setContent(await exportHtml(page));
    await visitor.evaluate(()=>document.querySelector('#skip')?.click());
    await expect(visitor.locator('.map-slide figcaption').first()).toHaveText('一层');
    await visitor.evaluate(()=>document.querySelector('[data-map-step="1"]').click());
    await expect(visitor.locator('[data-map-count]')).toHaveText('2 / 2');
    expect(errors).toEqual([]);
    await visitor.close();
  });
}

test('editor adds and removes extra venue maps',async({page})=>{
  const frame=await open(page,'01-ip-only','map-editor',{venueMap:{image:png('#3366cc'),links:[]}});
  await frame.locator('#venueMap').click();
  await expect(page.locator('#inspector .more-maps-editor')).toBeVisible();
  await page.evaluate(()=>{HTMLInputElement.prototype.click=function(){}});
  await page.locator('#addMoreMap').click();
  await expect(page.locator('#inspector [data-more-map]')).toHaveCount(1);
  await page.locator('#inspector [data-more-map-remove="0"]').click();
  await expect(page.locator('#inspector [data-more-map]')).toHaveCount(0);
});

test('old 03 projects keep every venue map',async({page})=>{
  const frame=await open(page,'03-creator-market','legacy-maps',{eventName:'旧场地图',creators:[],products:[],maps:[{title:'一层',image:png('#111')},{title:'二层',image:png('#222')},{title:'三层',image:png('#333')}]});
  await expect(frame.locator('#venueMap .map-slide')).toHaveCount(3);
  await expect(frame.locator('#venueMap .map-slide figcaption')).toHaveText(['一层','二层','三层']);
});

test('01 header ticket button follows the organizer ticket link instead of a placeholder',async({page})=>{
  await open(page,'01-ip-only','nav-ticket',{ticketUrl:'https://tickets.example.com/stardust'});
  const html=await exportHtml(page);
  expect(html).not.toContain('https://www.bilibili.com/');
  expect(html).toMatch(/<a class="btn ticket-purchase-link" href="https:\/\/tickets\.example\.com\/stardust"/);
  await open(page,'01-ip-only','nav-ticket-empty',{ticketUrl:''});
  expect(await exportHtml(page)).not.toContain('前往购票平台');
});

test('exported visitor pages carry no developer comments',async({page})=>{
  for(const id of ['01-ip-only','02-scrapbook','03-creator-market']){
    await open(page,id,'no-comments',{});
    const html=await exportHtml(page);
    expect(html).not.toContain('<!--');
    expect(html).not.toContain('/*');
  }
});
