import {test,expect} from '@playwright/test';
import {useCloudPublisher,signInCloud,loginCloud,PUBLISHER} from './cloud-publisher.mjs';

test.use({viewport:{width:1440,height:900}});

test('a signed-in organizer\'s project follows them to a second device',async({page,browser})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'sync-organizer');
  await page.goto('/v8/?template=04-creator-catalogue&project=device-one');
  const brand=page.frameLocator('#liveFrame').locator('.brand');
  await expect(brand).toHaveAttribute('contenteditable','true');
  await brand.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.type('跨设备同步测试');
  await expect(page.locator('#saveState')).toHaveText('已保存 · 云端已同步',{timeout:15000});
  const put=cloud.requests.find(r=>r.method==='PUT'&&r.path==='/api/config');
  expect(put.status).toBe(200);

  const second=await browser.newContext({viewport:{width:1440,height:900}});
  const phone=await second.newPage();
  const secondCloud=await useCloudPublisher(phone,cloud);
  await loginCloud(phone,secondCloud,'sync-organizer');
  await phone.goto('/admin/');
  await expect(phone.locator('#projectGrid .project-card')).toContainText('跨设备同步测试');
  await phone.locator('.edit-project').click();
  await expect(phone).toHaveURL(/template=04-creator-catalogue/);
  await expect(phone.frameLocator('#liveFrame').locator('.hero-copy h1')).toHaveText('跨设备同步测试');
  await second.close();
});

test('deleting a project also removes its cloud copy, so it does not come back',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'delete-organizer');
  await page.goto('/v8/?template=01-ip-only&project=to-delete');
  const field=page.frameLocator('#liveFrame').locator('[data-oe-field="eventName"]').first();
  await expect(field).toHaveAttribute('contenteditable','true');
  await field.click();await page.keyboard.press('Control+A');await page.keyboard.type('将被删除');
  await expect(page.locator('#saveState')).toHaveText('已保存 · 云端已同步',{timeout:15000});
  await page.goto('/admin/');
  await expect(page.locator('#projectGrid .project-card')).toContainText('将被删除');
  page.once('dialog',d=>d.accept());
  await page.locator('.delete-project').click();
  await expect(page.locator('#projectGrid .project-card')).toHaveCount(0);
  await expect.poll(()=>cloud.requests.filter(r=>r.method==='DELETE'&&r.path.startsWith('/api/projects/')).length).toBe(1);
  await page.reload();
  await expect(page.locator('#adminShell')).toBeVisible();
  await page.waitForTimeout(800);
  await expect(page.locator('#projectGrid .project-card')).toHaveCount(0);
});

test('signed-in image uploads go to R2 and are served back by the Worker',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'upload-organizer');
  await page.goto('/v8/?template=01-ip-only&project=upload-check');
  await expect(page.frameLocator('#liveFrame').locator('[data-oe-field="eventName"]').first()).toBeAttached();
  const url=await page.evaluate(async()=>{
    const m=await import('/v8/publisher.js?v=8.44.0');
    const cloudProjectId=await m.ensureCloudProjectFor({templateId:'01-ip-only',projectId:'upload-check',name:'上传测试'});
    return m.uploadCloudImage({blob:new Blob([new Uint8Array([71,73,70,56,57,97])],{type:'image/gif'}),projectId:cloudProjectId,filename:'x.gif'});
  });
  expect(url.startsWith(PUBLISHER+'/media/uploads/')).toBe(true);
  expect(cloud.requests.find(r=>r.path==='/api/upload').status).toBe(201);
  const stored=[...cloud.env.SITES.objects.keys()].filter(k=>k.startsWith('uploads/'));
  expect(stored).toHaveLength(1);
});

test('signed-out editing never calls the Worker and keeps local saves',async({page})=>{
  const cloud=await useCloudPublisher(page);
  await page.goto('/v8/?template=02-scrapbook&project=offline-only');
  const field=page.frameLocator('#liveFrame').locator('[data-oe-field="eventName"]').first();
  await expect(field).toHaveAttribute('contenteditable','true');
  await field.click();await page.keyboard.press('Control+A');await page.keyboard.type('仅本机');
  await expect(page.locator('#saveState')).toHaveText('已保存');
  expect(cloud.requests).toHaveLength(0);
});
