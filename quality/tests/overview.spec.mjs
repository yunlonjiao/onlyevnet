import {test,expect} from '@playwright/test';
import worker from '../../cloud/src/worker.js';
import {useCloudPublisher,signInCloud} from './cloud-publisher.mjs';

test.use({viewport:{width:1440,height:900}});

test('start page shows counts, waiting circles and unpublished changes',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'overview-organizer');
  await page.goto('/admin/');
  const old=new Date(Date.now()-3600*1000).toISOString(),now=new Date().toISOString();
  await page.evaluate(([old,now])=>{
    localStorage.setItem('onlyevent-admin-projects-v1',JSON.stringify([
      {id:'o1',name:'已发布且改过',templateId:'01-ip-only',status:'published',siteUrl:'https://o1.onlyevent.cn',updatedAt:now},
      {id:'o2',name:'草稿',templateId:'01-ip-only',status:'draft',siteUrl:'',updatedAt:now}
    ]));
    localStorage.setItem('onlyevent-studio-publish:01-ip-only:o1:iframe',JSON.stringify({siteId:'s1',cloudProjectId:'x',slug:'o1',url:'https://o1.onlyevent.cn',publishedAt:old}));
    localStorage.setItem('onlyevent-studio-v8:01-ip-only:o1:iframe',JSON.stringify({eventName:'已发布且改过',booths:[]}));
  },[old,now]);
  await page.reload();
  await expect(page.locator('#ovProjects')).toHaveText('2');
  await expect(page.locator('#ovPublished')).toHaveText('1');
  await expect(page.locator('#ovStaleCount')).toHaveText('1');
  await expect(page.locator('.project-status.stale-pill')).toHaveCount(1);
  await expect(page.locator('#ovPendingBtn')).toBeHidden();

  // A circle submits through the public link; the start page then shows it as waiting.
  await page.locator('[data-admin-page="collect"]').click();
  await page.locator('#collectEnable').click();
  await expect(page.locator('#collectLinkBox')).toBeVisible();
  const token=(await page.locator('#collectLinkInput').inputValue()).match(/t=([a-f0-9]{20})/)[1];
  await worker.fetch(new Request('https://convention-publisher.onlyevents.workers.dev/api/collect/'+token,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'等审核的社',contact:'QQ 1'})}),cloud.env);
  await page.reload();
  await expect(page.locator('#ovPendingBtn')).toBeVisible();
  await expect(page.locator('#ovPending')).toHaveText('1');
  await expect(page.locator('#collectCount')).toHaveText('1');
  await page.locator('#ovPendingBtn').click();
  await expect(page.locator('[data-page-panel="collect"]')).toBeVisible();
});

test('the publish dialog lists what is still missing, and stays out of the way',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'checks-organizer');
  await page.goto('/v8/?template=01-ip-only&project=checks-1');
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeAttached();
  await page.locator('#publishBtn').click();
  const list=page.locator('#publishChecks');
  await expect(list).toBeVisible();
  await expect(list).toContainText('还没有上传主视觉图');
  await expect(list).toContainText('【】没有填写');
  await expect(page.locator('#publishPrimary')).toBeEnabled();
});
