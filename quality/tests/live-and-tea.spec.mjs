import {test,expect} from '@playwright/test';
import {useCloudPublisher,signInCloud,visitSite} from './cloud-publisher.mjs';

test.use({viewport:{width:1440,height:900}});

const cases=[
  {id:'05-live-poster',site:'.ls-site',slug:'live-demo',lineup:4,rows:6},
  {id:'06-band-live',site:'.bl-site',slug:'band-demo',lineup:4,rows:6},
  {id:'07-tea-party',site:'.tp-site',slug:'tea-demo',lineup:2,rows:6},
  {id:'08-birthday',site:'.bd-site',slug:'bday-demo',lineup:2,rows:5}
];

for(const c of cases){
  test(c.id+' home shows the guest list and running order and publishes cleanly',async({page})=>{
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const cloud=await useCloudPublisher(page);
    await signInCloud(page,cloud,'tpl-'+c.id);
    await page.goto('/v8/?template='+c.id+'&project=case-'+c.id);
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator(c.site+' .hero')).toBeAttached();
    await expect(frame.locator('[data-oe-mirror="lineup"] .lineup-card')).toHaveCount(c.lineup);
    await expect(frame.locator('[data-oe-mirror="timetable"] .timeline-row')).toHaveCount(c.rows);
    // The booth page does not exist for these templates, so the editor must not offer it.
    await expect(frame.locator('#booths')).toHaveCount(0);
    await page.locator('#publishBtn').click();
    await page.locator('#publishSlug').fill(c.slug);
    await page.locator('#publishPrimary').click();
    await expect(page.locator('#publishUrl')).toHaveText('https://'+c.slug+'.onlyevent.cn');
    const visit=await visitSite(cloud,c.slug);
    expect(visit.status).toBe(200);
    expect(visit.html).toContain('lineup-card');
    expect(visit.html).toContain('timeline-row');
    expect(visit.html).not.toContain('contenteditable');
    expect(errors).toEqual([]);
  });
}

test('circle collection says so when the template has no booth page',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'no-booth-organizer');
  await page.goto('/admin/');
  await page.evaluate(()=>localStorage.setItem('onlyevent-admin-projects-v1',JSON.stringify([{id:'nb1',name:'茶会',templateId:'07-tea-party',status:'draft',siteUrl:'',updatedAt:new Date().toISOString()}])));
  await page.reload();
  await page.locator('[data-admin-page="collect"]').click();
  await expect(page.locator('#collectMessage')).toContainText('没有摊位页');
  await expect(page.locator('#collectSetup')).toBeHidden();
});

for(const id of ['05-live-poster','06-band-live','07-tea-party','08-birthday']){
  test(id+' does not scroll sideways on a phone',async({page})=>{
    await page.setViewportSize({width:390,height:844});
    const cloud=await useCloudPublisher(page);
    await signInCloud(page,cloud,'wide-'+id);
    await page.goto('/v8/?template='+id+'&project=wide-1');
    await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeAttached();
    await page.waitForTimeout(800);
    const widths=await page.evaluate(()=>{const d=document.querySelector('#liveFrame').contentDocument;return {frame:d.documentElement.scrollWidth,page:document.documentElement.scrollWidth}});
    expect(widths.frame).toBeLessThanOrEqual(390);
    expect(widths.page).toBeLessThanOrEqual(390);
  });
}

test('the gallery shows four groups with two templates each',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'gallery-organizer');
  await page.goto('/admin/');
  await page.locator('[data-admin-page="templates"]').click();
  await expect(page.locator('#templateGrid .template-group')).toHaveText([/IP ONLY/,/创作者展/,/舞台演出/,/小型活动/]);
  const groups=await page.evaluate(()=>{
    const out=[];let cur=null;
    for(const el of document.querySelector('#templateGrid').children){
      if(el.classList.contains('template-group'))out.push(cur={count:0});else if(cur&&el.dataset.templateId)cur.count++;
    }
    return out.map(g=>g.count);
  });
  expect(groups).toEqual([2,2,2,2]);
});

test('a small-event template starts with the quick answers already in the editor',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'quick-organizer');
  await page.goto('/admin/');
  await page.locator('[data-admin-page="templates"]').click();
  await page.locator('#templateGrid [data-template="07-tea-party"]').click();
  await expect(page.locator('#quickSetup')).toBeVisible();
  await page.locator('#createProjectName').fill('周末茶会');
  await page.locator('#quickHero').setInputFiles({name:'hero.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==','base64')});
  await page.locator('#quickDate').fill('2026.12.20');
  await page.locator('#quickPlace').fill('上海');
  await page.locator('#quickTicketUrl').fill('https://example.com/signup');
  await page.locator('#quickTagline').fill('下午茶，聊聊天。');
  await page.locator('#quickModules input[value="guide"]').uncheck();
  await page.locator('#createForm button[type=submit]').click();
  await page.waitForURL(/\/v8\//);
  const frame=page.frameLocator('#liveFrame');
  await expect(frame.locator('.tp-site .hero')).toBeAttached();
  await expect(frame.locator('.tp-site .hero p')).toHaveText('下午茶，聊聊天。');
  await expect(frame.locator('.tp-site .hero [data-oe-field="date"]')).toHaveText('2026.12.20');
  await expect(frame.locator('.tp-site .hero [data-oe-field="location"]')).toHaveText('上海');
  await expect(frame.locator('.tp-site #guide')).toBeHidden();
  const state=await page.evaluate(()=>{const k=Object.keys(localStorage).find(x=>x.startsWith('onlyevent-studio-v8:07-tea-party:'));return JSON.parse(localStorage.getItem(k))});
  expect(state.heroImage).toMatch(/\/media\/uploads\//);
  expect(state.ticketUrl).toBe('https://example.com/signup');
  expect(state.modules.guide).toBe(false);
});
