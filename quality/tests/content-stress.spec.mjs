import {test,expect} from '@playwright/test';

const STORAGE='onlyevent-studio-v8:01-ip-only:iframe';

async function loadWith(page,mutator){
  await page.goto('/v8/');
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeVisible();
  await page.evaluate(async({storage,mutatorSource})=>{
    const mod=await import('/v8/templates/01-ip-only.js?v=qa-stress');
    const state=structuredClone(mod.template01.defaults);
    const fn=(0,eval)('('+mutatorSource+')');
    fn(state);
    localStorage.setItem(storage,JSON.stringify(state));
  },{storage:STORAGE,mutatorSource:mutator.toString()});
  await page.reload();
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeVisible();
  return page.frameLocator('#liveFrame');
}

async function assertNoRealHorizontalScroll(frame){
  const result=await frame.locator('html').evaluate(()=>{
    window.scrollTo(99999,0);
    const x=window.scrollX;
    window.scrollTo(0,0);
    return x;
  });
  expect(result).toBe(0);
}

test('long event name and long subtitle stay readable without horizontal scrolling',async({page})=>{
  const frame=await loadWith(page,s=>{
    s.eventName='这是一个用于测试超长活动名称在桌面端与移动端都不会破坏页面布局的超长ONLY活动名称2027';
    s.tagline='这是一段用于压力测试的超长副标题与活动介绍文字，用来确认在真实主办方输入较长中文说明时，页面能够正常换行、自适应并且不会出现横向滚动或覆盖其他重要内容。'.repeat(2);
  });
  await expect(frame.locator('.hero')).toBeVisible();
  await assertNoRealHorizontalScroll(frame);
  const title=frame.locator('.brand').first();
  await expect(title).toContainText('这是一个用于测试超长活动名称');
});

test('zero, one and twelve guests render safely',async({page})=>{
  let frame=await loadWith(page,s=>{s.guests=[]});
  await page.locator('.page-nav [data-page="guests"]').click();
  await expect(frame.locator('#guests')).toBeVisible();
  await expect(frame.locator('#guests [data-oe-item="guests"]')).toHaveCount(0);

  frame=await loadWith(page,s=>{s.guests=[{id:'g1',guestType:'person',name:'唯一嘉宾',role:'GUEST',members:'',attendanceNote:'',works:'代表作',intro:'单嘉宾状态测试',image:'',socialLinks:[]} ]});
  await page.locator('.page-nav [data-page="guests"]').click();
  await expect(frame.locator('#guests [data-oe-item="guests"]')).toHaveCount(1);

  frame=await loadWith(page,s=>{s.guests=Array.from({length:12},(_,i)=>({id:'g'+i,guestType:'person',name:'嘉宾 '+String(i+1).padStart(2,'0'),role:'GUEST',members:'',attendanceNote:'',works:'作品',intro:'测试简介 '+i,image:'',socialLinks:[]}))});
  await page.locator('.page-nav [data-page="guests"]').click();
  await expect(frame.locator('#guests [data-oe-item="guests"]')).toHaveCount(12);
  await assertNoRealHorizontalScroll(frame);
});

test('zero, one and 100 booths render and search without false errors',async({page})=>{
  let frame=await loadWith(page,s=>{s.booths=[]});
  await page.locator('.page-nav [data-page="booths"]').click();
  await expect(frame.locator('#booths [data-directory-card]')).toHaveCount(0);
  await expect(frame.locator('#booths [data-directory-search]')).toBeVisible();

  frame=await loadWith(page,s=>{s.booths=[{id:'b1',no:'A01',name:'唯一社团',logo:'',type:'同人',intro:'单摊位测试',products:[]} ]});
  await page.locator('.page-nav [data-page="booths"]').click();
  await expect(frame.locator('#booths [data-directory-card][data-kind="booth"]')).toHaveCount(1);

  frame=await loadWith(page,s=>{s.booths=Array.from({length:100},(_,i)=>({id:'b'+i,no:'A'+String(i+1).padStart(3,'0'),name:'压力测试社团 '+(i+1),logo:'',type:'同人制品',intro:'第 '+(i+1)+' 个社团',products:[{id:'p'+i,name:'制品 '+(i+1),tag:'测试',price:'¥10',note:'',image:''}]}))});
  await page.locator('.page-nav [data-page="booths"]').click();
  await expect(frame.locator('#booths [data-directory-card][data-kind="booth"]')).toHaveCount(100);
  const search=frame.locator('#booths [data-directory-search]');
  await search.fill('压力测试社团 100');
  await expect(frame.locator('#booths [data-directory-card][data-kind="booth"]:visible')).toHaveCount(1);
  await assertNoRealHorizontalScroll(frame);
});

test('zero activities and 30+ schedule rows render safely across two days',async({page})=>{
  let frame=await loadWith(page,s=>{s.participation=[];s.schedule=[];s.featuredActivities=[]});
  await page.locator('.page-nav [data-page="activities"]').click();
  await expect(frame.locator('#activities')).toBeVisible();
  await expect(frame.locator('#activities [data-oe-item="schedule"]')).toHaveCount(0);

  frame=await loadWith(page,s=>{
    s.participation=[];
    s.schedule=Array.from({length:32},(_,i)=>({id:'s'+i,day:i<16?'DAY 1':'DAY 2',time:String(10+Math.floor((i%16)/2)).padStart(2,'0')+':'+(i%2?'30':'00'),endTime:'',title:'压力测试活动 '+(i+1),stage:i%2?'副舞台':'主舞台',category:'舞台',detail:'用于测试大量活动日程的展示。',guestIds:[],registrationUrl:''}));
  });
  await page.locator('.page-nav [data-page="activities"]').click();
  await expect(frame.locator('#activities [data-oe-item="schedule"]')).toHaveCount(32);
  await expect(frame.locator('#activities .activity-day-tabs button')).toHaveCount(2);
  await assertNoRealHorizontalScroll(frame);
});

test('updates handle zero items and very long titles',async({page})=>{
  let frame=await loadWith(page,s=>{s.updates=[]});
  await expect(frame.locator('#updates .update-item')).toHaveCount(0);

  frame=await loadWith(page,s=>{s.updates=[{id:'u1',date:'10/11',title:'这是一个用于验证重要更新区域超长资讯标题换行和布局稳定性的测试标题，它不应该撑破页面宽度或遮挡其他内容',target:'activities'}]});
  await expect(frame.locator('#updates .update-item')).toHaveCount(1);
  await expect(frame.locator('#updates .update-item')).toContainText('这是一个用于验证重要更新区域');
  await assertNoRealHorizontalScroll(frame);
});

test('zero sponsors hide in visitor preview while populated sponsors render',async({page})=>{
  let frame=await loadWith(page,s=>{s.sponsors=[];s.modules.sponsors=true});
  await page.locator('#previewBtn').click();
  await expect(frame.locator('#sponsors')).toHaveClass(/oe-page-hidden/);

  frame=await loadWith(page,s=>{s.modules.sponsors=true;s.sponsors=[{id:'sp1',name:'测试赞助商',level:'合作伙伴',url:'https://example.com',logo:''}]});
  await page.locator('#previewBtn').click();
  await expect(frame.locator('#sponsors')).not.toHaveClass(/oe-page-hidden/);
  await expect(frame.locator('#sponsors .sponsor-card')).toHaveCount(1);
});

test('zero-content standalone modules disappear from visitor navigation but remain editable',async({page})=>{
  const frame=await loadWith(page,s=>{
    s.booths=[];s.guests=[];s.participation=[];s.schedule=[];
    s.modules.booths=true;s.modules.guests=true;s.modules.activities=true;
  });
  await expect(page.locator('.page-nav [data-page="booths"]')).toBeVisible();
  await expect(page.locator('.page-nav [data-page="guests"]')).toBeVisible();
  await expect(page.locator('.page-nav [data-page="activities"]')).toBeVisible();

  await page.locator('#previewBtn').click();
  await expect(frame.locator('.quick-grid [data-page-link="booths"]')).toHaveCount(0);
  await expect(frame.locator('.quick-grid [data-page-link="activities"]')).toHaveCount(0);
  await expect(frame.locator('.nav [data-page-link="booths"]')).toBeHidden();
  await expect(frame.locator('.nav [data-page-link="guests"]')).toBeHidden();
  await expect(frame.locator('.nav [data-page-link="activities"]')).toBeHidden();
});

test('missing hero, guest, product and guide images keep usable fallback surfaces',async({page})=>{
  const frame=await loadWith(page,s=>{
    s.heroImage='';
    s.guests=[{id:'g1',guestType:'person',name:'无图嘉宾',role:'GUEST',members:'',attendanceNote:'',works:'',intro:'',image:'',socialLinks:[]}];
    s.booths=[{id:'b1',no:'A01',name:'无图社团',logo:'',type:'测试',intro:'',products:[{id:'p1',name:'无图制品',tag:'测试',price:'¥10',note:'',image:''}]}];
    s.guide.items[0].image='';
  });
  await expect(frame.locator('.kv')).toBeVisible();
  await page.locator('.page-nav [data-page="guests"]').click();
  await expect(frame.locator('#guests .guest-image.empty')).toBeVisible();
  await page.locator('.page-nav [data-page="booths"]').click();
  await frame.locator('#booths [data-directory-view-btn="products"]').click();
  await expect(frame.locator('#booths .directory-product-image.empty')).toBeVisible();
  await page.locator('.page-nav [data-page="guide"]').click();
  await expect(frame.locator('#guide .guide-access')).toBeVisible();
});

test('broken remote images do not crash renderer',async({page})=>{
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const frame=await loadWith(page,s=>{
    const bad='https://127.0.0.1:1/definitely-missing.jpg';
    s.heroImage=bad;
    s.guests=[{id:'g1',guestType:'person',name:'坏图嘉宾',role:'GUEST',members:'',attendanceNote:'',works:'',intro:'',image:bad,socialLinks:[]}];
    s.booths=[{id:'b1',no:'A01',name:'坏图社团',logo:bad,type:'测试',intro:'',products:[{id:'p1',name:'坏图制品',tag:'测试',price:'¥10',note:'',image:bad}]}];
  });
  await expect(frame.locator('.hero')).toBeVisible();
  await page.locator('.page-nav [data-page="guests"]').click();
  await expect(frame.locator('#guests [data-oe-item="guests"]')).toHaveCount(1);
  await page.locator('.page-nav [data-page="booths"]').click();
  await expect(frame.locator('#booths [data-directory-card][data-kind="booth"]')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('one-day schedule hides day selector; two-day schedule exposes it',async({page})=>{
  let frame=await loadWith(page,s=>{s.schedule=[{id:'s1',day:'DAY 1',time:'12:00',endTime:'13:00',title:'单日活动',stage:'MAIN STAGE',category:'舞台',detail:'',guestIds:[],registrationUrl:''}]});
  await page.locator('.page-nav [data-page="activities"]').click();
  await expect(frame.locator('#activities .activity-day-tabs')).toBeHidden();

  frame=await loadWith(page,s=>{s.schedule=[{id:'s1',day:'DAY 1',time:'12:00',endTime:'13:00',title:'第一天',stage:'MAIN STAGE',category:'舞台',detail:'',guestIds:[],registrationUrl:''},{id:'s2',day:'DAY 2',time:'12:00',endTime:'13:00',title:'第二天',stage:'MAIN STAGE',category:'舞台',detail:'',guestIds:[],registrationUrl:''}]});
  await page.locator('.page-nav [data-page="activities"]').click();
  await expect(frame.locator('#activities .activity-day-tabs')).toBeVisible();
  await expect(frame.locator('#activities .activity-day-tabs button')).toHaveCount(2);
});

test('interactive-looking controls are keyboard reachable in visitor preview',async({page})=>{
  const frame=await loadWith(page,s=>{s.ticketUrl='https://example.com';s.navigationUrl='https://example.com'});
  await page.locator('#previewBtn').click();
  await expect(frame.locator('#loader')).toBeVisible();
  await frame.locator('.gate').click();
  await expect.poll(async()=>await frame.locator('#loader').evaluate(el=>el.classList.contains('hide')),{timeout:5000}).toBe(true);
  const controls=frame.locator('a[href],button,input,[tabindex="0"]');
  expect(await controls.count()).toBeGreaterThan(5);
  const unlabeled=await frame.locator('button').evaluateAll(btns=>btns.filter(b=>!((b.textContent||'').trim()||b.getAttribute('aria-label')||b.getAttribute('title'))).length);
  expect(unlabeled).toBe(0);
});
