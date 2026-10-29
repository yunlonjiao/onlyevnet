import {test,expect} from '@playwright/test';
import {useCloudPublisher,signInCloud,visitSite} from './cloud-publisher.mjs';

test.use({viewport:{width:1440,height:900}});

const cases=[
  {id:'05-live-poster',site:'.ls-site',slug:'live-demo',lineup:4,rows:6},
  {id:'06-tea-party',site:'.tp-site',slug:'tea-demo',lineup:2,rows:6}
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
  await page.evaluate(()=>localStorage.setItem('onlyevent-admin-projects-v1',JSON.stringify([{id:'nb1',name:'茶会',templateId:'06-tea-party',status:'draft',siteUrl:'',updatedAt:new Date().toISOString()}])));
  await page.reload();
  await page.locator('[data-admin-page="collect"]').click();
  await expect(page.locator('#collectMessage')).toContainText('没有摊位页');
  await expect(page.locator('#collectSetup')).toBeHidden();
});
