import {test,expect} from '@playwright/test';
import {useCloudPublisher,signInCloud,visitSite} from './cloud-publisher.mjs';

test.use({viewport:{width:1440,height:900}});

async function publish(page,cloud,slug,template='01-ip-only'){
  await page.goto('/v8/?template='+template+'&project=growth-'+slug);
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeAttached();
  await page.locator('#publishBtn').click();
  await page.locator('#publishSlug').fill(slug);
  await page.locator('#publishPrimary').click();
  await expect(page.locator('#publishStatus')).toHaveText('网站已上线');
}

test('the share dialog shows a scannable QR code for the published site',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'qr-organizer');
  await page.goto('/v8/?template=01-ip-only&project=growth-qr');
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeAttached();
  await page.locator('#shareBtn').click();
  await expect(page.locator('#shareQr')).toHaveCount(0);
  await page.locator('#shareClose').click();
  await publish(page,cloud,'qr-site');
  await page.locator('#publishShare').click();
  await expect(page.locator('#shareQr svg')).toBeVisible();
  const download=page.waitForEvent('download');
  await page.locator('#shareQrSave').click();
  expect((await download).suggestedFilename()).toContain('二维码');
});

test('tagged links count visits per channel and the stats page lists them',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'channel-organizer');
  await publish(page,cloud,'channel-site');
  await page.locator('#publishShare').click();
  await expect(page.locator('.share-channel')).toHaveCount(5);
  await expect(page.locator('.share-channel code').first()).toContainText('channel-site.onlyevent.cn/?from=weibo');
  const human='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1';
  const {default:worker}=await import('../../cloud/src/worker.js');
  const hit=async q=>{const r=await worker.fetch(new Request('https://channel-site.onlyevent.cn/'+q,{headers:{'user-agent':human}}),cloud.env);expect(r.status).toBe(200)};
  await hit('?from=weibo');await hit('?from=weibo');await hit('?from=bilibili');await hit('');await hit('?from=Bad Value!');
  await page.goto('/admin/');
  await page.locator('[data-admin-page="stats"]').click();
  await expect(page.locator('#statsChannelBox')).toBeVisible();
  await expect(page.locator('#statsChannels')).toContainText('微博');
  await expect(page.locator('#statsChannels .stats-channel').first().locator('b')).toHaveText('2 次');
  await expect(page.locator('#statsChannels')).toContainText('直接访问');
});

test('cost estimate adds up expenses and finds the break-even head count',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'cost-organizer');
  await page.goto('/admin/');
  await page.evaluate(()=>localStorage.setItem('onlyevent-admin-projects-v1',JSON.stringify([{id:'c1',name:'春季茶会',templateId:'07-tea-party',status:'draft',siteUrl:'',updatedAt:new Date().toISOString()}])));
  await page.reload();
  await page.locator('[data-admin-page="cost"]').click();
  await page.locator('[data-group="venue"] [data-add]').click();
  await page.locator('[data-group="venue"] [data-name="0"]').fill('场地');
  await page.locator('[data-group="venue"] [data-amount="0"]').fill('1500');
  await page.locator('[data-group="promo"] [data-add]').click();
  await page.locator('[data-group="promo"] [data-amount="0"]').fill('500');
  await page.locator('[data-field="price"]').fill('50');
  await page.locator('[data-field="variable"]').fill('10');
  await page.locator('[data-field="people"]').fill('80');
  const cards=page.locator('.cost-cards b');
  await expect(cards.nth(0)).toHaveText('¥2,000');
  await expect(cards.nth(2)).toHaveText('50 人');
  await expect(cards.nth(1)).toHaveText('¥1,200');
  await page.reload();
  await page.locator('[data-admin-page="cost"]').click();
  await expect(page.locator('[data-group="venue"] [data-amount="0"]')).toHaveValue('1500');
});

test('the start page lists the event date and custom deadlines, soonest first',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'deadline-organizer');
  await page.goto('/admin/');
  const soon=new Date(Date.now()+8*3600000+5*86400000).toISOString().slice(0,10);
  await page.evaluate(day=>{
    localStorage.setItem('onlyevent-admin-projects-v1',JSON.stringify([{id:'d1',name:'夏日展',templateId:'01-ip-only',status:'draft',siteUrl:'',updatedAt:new Date().toISOString()}]));
    localStorage.setItem('onlyevent-studio-v8:01-ip-only:d1:iframe',JSON.stringify({eventName:'夏日展',eventStartDateTime:day+'T10:00'}));
  },new Date(Date.now()+8*3600000+25*86400000).toISOString().slice(0,10));
  await page.reload();
  await expect(page.locator('#deadlinePanel li')).toHaveCount(1);
  await expect(page.locator('#deadlinePanel li').first()).toContainText('活动举办');
  await page.locator('[data-deadline-add]').click();
  await page.locator('.deadline-form input[name=label]').fill('社团招募截止');
  await page.locator('.deadline-form input[name=date]').fill(soon);
  await page.locator('.deadline-form button[type=submit]').click();
  await expect(page.locator('#deadlinePanel li')).toHaveCount(2);
  await expect(page.locator('#deadlinePanel li').first()).toContainText('社团招募截止');
  await expect(page.locator('#deadlinePanel li').first()).toHaveClass(/soon/);
  await page.reload();
  await expect(page.locator('#deadlinePanel li')).toHaveCount(2);
  await page.locator('[data-deadline-del]').click();
  await expect(page.locator('#deadlinePanel li')).toHaveCount(1);
});

test('visitors can ask a question and the answer shows up as a public FAQ',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'ask-organizer');
  await publish(page,cloud,'ask-site');
  const {default:worker}=await import('../../cloud/src/worker.js');
  const human='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1';
  const visit=()=>worker.fetch(new Request('https://ask-site.onlyevent.cn/',{headers:{'user-agent':human}}),cloud.env).then(r=>r.text());
  expect(await visit()).not.toContain('oe-ask-btn');
  const post=text=>worker.fetch(new Request('https://ask-site.onlyevent.cn/api/ask/ask-site',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text})}),cloud.env);
  expect((await post('现场能寄存行李吗？')).status).toBe(404);
  await page.goto('/admin/');
  await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('onlyevent-admin-projects-v1')||'[]');window.__n=p.length});
  await page.locator('[data-admin-page="ask"]').click();
  await expect(page.locator('#askSetup')).toBeVisible();
  await page.locator('#askEnabled').check();
  await expect(page.locator('#askMessage')).toContainText('已打开');
  const withWidget=await visit();
  expect(withWidget).toContain('oe-ask-btn');
  const start=withWidget.indexOf('<script>(function(slug)'),code=withWidget.slice(start+8,withWidget.indexOf('</script>',start));
  expect(()=>new Function(code)).not.toThrow();
  expect((await post('现场能寄存行李吗？')).status).toBe(201);
  expect((await post(' ')).status).toBe(400);
  await page.locator('#askRefresh').click();
  await expect(page.locator('.ask-item')).toHaveCount(1);
  await expect(page.locator('#askCount')).toHaveText('1');
  await page.locator('.ask-item textarea').fill('可以，入口旁边有寄存处。');
  await page.locator('.ask-item [data-save]').click();
  await expect(page.locator('.ask-item textarea')).toHaveValue('可以，入口旁边有寄存处。');
  const faq=await worker.fetch(new Request('https://ask-site.onlyevent.cn/api/ask/ask-site'),cloud.env).then(r=>r.json());
  expect(faq.faq).toEqual([{q:'现场能寄存行李吗？',a:'可以，入口旁边有寄存处。'}]);
  await page.locator('#askEnabled').uncheck();
  await expect(page.locator('#askMessage')).toContainText('已关闭');
  expect(await visit()).not.toContain('oe-ask-btn');
});

test('staged reveal: pages that are not public yet are not served, and appear when their time comes',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'stage-organizer');
  await page.goto('/v8/?template=03-creator-market&project=growth-stage');
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeAttached();
  await page.locator('#publishBtn').click();
  await page.locator('#publishSlug').fill('stage-site');
  await page.locator('#publishStages summary').click();
  const local=ms=>{const d=new Date(Date.now()+ms-new Date().getTimezoneOffset()*60000);return d.toISOString().slice(0,16)};
  await page.locator('#stageAdd').click();
  await page.locator('.stage-row').nth(0).locator('.stage-label').fill('二宣');
  await page.locator('.stage-row').nth(0).locator('.stage-at').fill(local(86400000*30));
  await page.locator('.stage-row').nth(0).locator('[data-mod="booths"]').check();
  await page.locator('#publishPrimary').click();
  await expect(page.locator('#publishStatus')).toHaveText('网站已上线',{timeout:20000});
  const base=JSON.parse(cloud.requests.find(r=>r.method==='POST'&&r.path==='/api/sites').body).html;
  expect(base).not.toContain('浮光工房');
  expect(cloud.requests.some(r=>r.method==='PUT'&&/\/stages$/.test(r.path))).toBe(true);
  expect((await visitSite(cloud,'stage-site')).html).not.toContain('浮光工房');
  // the editor itself still has the full page
  await expect(page.frameLocator('#liveFrame').locator('#booths')).toHaveCount(1);
  // move the stage into the past: the next publish serves the full version
  await page.locator('.stage-row').nth(0).locator('.stage-at').fill(local(-3600000));
  await page.locator('#publishPrimary').click();
  await expect(page.locator('#publishStatus')).toHaveText('网站已上线',{timeout:20000});
  expect((await visitSite(cloud,'stage-site')).html).toContain('浮光工房');
});

test('sign-up forms can be created, filled by a visitor, reviewed and exported',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'signup-organizer');
  await page.goto('/admin/');
  await page.evaluate(()=>localStorage.setItem('onlyevent-admin-projects-v1',JSON.stringify([{id:'su1',name:'秋季展',templateId:'01-ip-only',status:'draft',siteUrl:'',updatedAt:new Date().toISOString()}])));
  await page.reload();
  await page.locator('[data-admin-page="signup"]').click();
  await page.locator('[data-new="cos"]').click();
  await expect(page.locator('.signup-card')).toHaveCount(1);
  await expect(page.locator('.signup-link code')).toContainText('/signup/?t=');
  const token=(await page.locator('.signup-link code').innerText()).match(/t=([a-f0-9]{20})/)[1];
  const {default:worker}=await import('../../cloud/src/worker.js');
  const submit=values=>worker.fetch(new Request('https://convention-publisher.onlyevents.workers.dev/api/signup/'+token,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({values})}),cloud.env);
  expect((await submit({f1:'小明',f2:'某角色',f3:'qq123'})).status).toBe(201);
  await page.locator('#signupRefresh').click();
  await expect(page.locator('#signupCount')).toHaveText('1');
  await page.locator('[data-entries]').click();
  await expect(page.locator('.signup-entry')).toHaveCount(1);
  await expect(page.locator('.signup-entry')).toContainText('小明');
  await page.locator('.signup-entry [data-st="approved"]').click();
  await expect(page.locator('.signup-entry em')).toHaveText('已通过');
  const download=page.waitForEvent('download');
  await page.locator('[data-export]').click();
  expect((await download).suggestedFilename()).toContain('.csv');
  await page.locator('[data-edit]').click();
  await page.locator('.sf-title').fill('COS 报名（改）');
  await page.locator('[data-saveform]').click();
  await expect(page.locator('.signup-card b').first()).toHaveText('COS 报名（改）');
  await page.locator('[data-open]').uncheck();
  expect((await submit({f1:'小红',f2:'x',f3:'y'})).status).toBe(403);
});

test('live updates and recap: the editor builds the section and it ships in the exported page',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'recap-organizer');
  await page.goto('/v8/?template=03-creator-market&project=growth-recap');
  const frame=page.frameLocator('#liveFrame');
  await expect(frame.locator('.hero')).toBeAttached();
  await expect(frame.locator('#recap')).toHaveCount(0);
  await page.locator('[data-page-tool="recap"]').click();
  await expect(page.locator('#recapDialog')).toBeVisible();
  await page.locator('[data-recap="mode"]').selectOption('recap');
  await page.locator('[data-recap="summary"]').fill('两天一共来了三千多位同好。');
  await page.locator('[data-add="posts"]').click();
  await page.locator('[data-list="posts"] [data-f="time"]').fill('15:00');
  await page.locator('[data-list="posts"] [data-f="text"]').fill('舞台环节开始');
  await page.locator('[data-add="videos"]').click();
  await page.locator('[data-list="videos"] [data-f="url"]').fill('https://www.bilibili.com/video/BV1xx411c7mD');
  await page.locator('[data-add="links"]').click();
  await page.locator('[data-list="links"] [data-f="label"]').fill('微博话题');
  await page.locator('[data-list="links"] [data-f="url"]').fill('https://weibo.com/topic');
  await page.locator('[data-add="links"]').click();
  await page.locator('[data-list="links"]').nth(1).locator('[data-f="url"]').fill('javascript:alert(1)');
  await expect(frame.locator('#recap h2')).toHaveText('活动回顾');
  await expect(frame.locator('#recap iframe')).toHaveAttribute('src',/player\.bilibili\.com\/player\.html\?bvid=BV1xx411c7mD/);
  await expect(frame.locator('#recap .oe-recap-links a')).toHaveCount(1);
  await page.locator('#recapClose').click();
  await page.locator('#publishBtn').click();
  await page.locator('#publishSlug').fill('recap-site');
  await page.locator('#publishPrimary').click();
  await expect(page.locator('#publishStatus')).toHaveText('网站已上线',{timeout:20000});
  const html=(await visitSite(cloud,'recap-site')).html;
  expect(html).toContain('id="recap"');
  expect(html).toContain('舞台环节开始');
  expect(html).toContain('两天一共来了三千多位同好');
  expect(html).not.toContain('href="javascript:');
  // switched off: the section is gone again
  await page.locator('#publishClose').click();
  await page.locator('[data-page-tool="recap"]').click();
  await page.locator('[data-recap="mode"]').selectOption('off');
  await expect(frame.locator('#recap')).toHaveCount(0);
});

test('on a phone the admin bottom bar is one short row and the page content stays visible',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'phone-organizer');
  await page.goto('/admin/');
  const bar=await page.locator('.admin-sidebar').boundingBox();
  expect(bar.height).toBeLessThan(90);
  for(const p of ['templates','cost','stats','ask','signup','collect','settings']){
    await page.locator('[data-admin-page="'+p+'"]').click();
    const h1=await page.locator('[data-page-panel="'+p+'"] h1').boundingBox();
    expect(h1,p).not.toBeNull();
    expect(h1.y+h1.height,p).toBeLessThan(844-bar.height);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('the feedback and share dialogs keep their content away from the edges',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'dialog-organizer');
  await page.goto('/admin/');
  await page.locator('#feedbackBtn').click();
  const box=await page.locator('#feedbackDialog').boundingBox(),area=await page.locator('#feedbackText').boundingBox();
  expect(area.x-box.x).toBeGreaterThanOrEqual(12);
  expect(box.x+box.width-(area.x+area.width)).toBeGreaterThanOrEqual(12);
  await page.goto('/v8/?template=01-ip-only&project=dialog-1');
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeAttached();
  await page.locator('#shareBtn').click();
  const title=await page.locator('#shareDialog [data-seo-field="ogTitle"]').boundingBox();
  expect(title.height).toBeGreaterThanOrEqual(36);
  expect(title.width).toBeGreaterThan(300);
});
