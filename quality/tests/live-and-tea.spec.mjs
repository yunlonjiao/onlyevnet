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
    await page.goto('/v8/?template='+c.id+'&project=case-'+c.id+'');
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

test('the gallery shows every template and filters by category',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'gallery-organizer');
  await page.goto('/admin/');
  await page.locator('[data-admin-page="templates"]').click();
  const chips=page.locator('#templateFilters button');
  await expect(chips).toHaveCount(5);
  await expect(chips.first()).toContainText('全部');
  await expect(page.locator('#templateGrid .template-card')).toHaveCount(8);
  await expect(page.locator('#templateGrid .template-group')).toHaveCount(0);
  for(const [label,count] of [['IP ONLY',2],['创作者展',2],['舞台演出',2],['小型活动',2]]){
    await chips.filter({hasText:label}).click();
    await expect(page.locator('#templateGrid .template-card')).toHaveCount(count);
  }
  await chips.first().click();
  await expect(page.locator('#templateGrid .template-card')).toHaveCount(8);
});

test('every template can be previewed on desktop and phone before it is used',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'preview-organizer');
  await page.goto('/admin/');
  await page.locator('[data-admin-page="templates"]').click();
  for(const id of ['01-ip-only','05-live-poster','08-birthday']){
    await page.locator('#templateGrid [data-template-id="'+id+'"] .preview-template').click();
    await expect(page.locator('#previewDialog')).toBeVisible();
    const frame=page.frameLocator('#previewFrame').frameLocator('#liveFrame');
    await expect(frame.locator('.hero').first()).toBeAttached({timeout:15000});
    await page.locator('[data-preview-device="mobile"]').click();
    await expect(page.locator('#previewStage')).toHaveClass(/mobile/);
    await page.locator('[data-preview-device="desktop"]').click();
    await page.locator('#previewClose').click();
    await expect(page.locator('#previewDialog')).toBeHidden();
  }
  // previewing creates nothing
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('onlyevent-admin-projects-v1')||'[]').length)).toBe(0);
  // from the preview, "use this template" goes to the normal create dialog
  await page.locator('#templateGrid [data-template-id="07-tea-party"] .template-cover').click();
  await page.locator('#previewUse').click();
  await expect(page.locator('#createDialog')).toBeVisible();
  await expect(page.locator('#createProjectName')).toBeVisible();
});

test('small-event templates are created like every other template, with no extra questions',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'plain-organizer');
  await page.goto('/admin/');
  await page.locator('[data-admin-page="templates"]').click();
  await page.locator('#templateGrid [data-template="07-tea-party"]').click();
  await expect(page.locator('#createDialog input:visible')).toHaveCount(1);
  await page.locator('#createProjectName').fill('周末茶会');
  await page.locator('#createForm button[type=submit]').click();
  await page.waitForURL(/\/v8\//);
  await expect(page.frameLocator('#liveFrame').locator('.tp-site .hero')).toBeAttached();
  await page.waitForTimeout(900);
  await expect(page.locator('dialog[open]')).toHaveCount(0);
});
