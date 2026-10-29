import {test,expect} from '@playwright/test';
import worker from '../../cloud/src/worker.js';
import {useCloudPublisher,signInCloud} from './cloud-publisher.mjs';

test.use({viewport:{width:1440,height:900}});

// The public form calls its own origin, so those calls are sent into the same in-memory Worker.
async function routeSameOrigin(page,env){
  await page.route('http://127.0.0.1:4173/api/**',async route=>{
    const req=route.request(),body=['GET','HEAD'].includes(req.method())?undefined:req.postDataBuffer()||undefined;
    const res=await worker.fetch(new Request(req.url(),{method:req.method(),headers:req.headers(),body}),env);
    await route.fulfill({status:res.status,headers:Object.fromEntries(res.headers),body:Buffer.from(await res.arrayBuffer())});
  });
}

test('organizer collects circle info through a public link and approves it into booths',async({page,context})=>{
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'collect-organizer');
  await page.goto('/admin/');
  await expect(page.locator('#adminShell')).toBeVisible();
  await page.evaluate(()=>{
    const p={id:'c1',name:'收集测试展',templateId:'01-ip-only',status:'draft',siteUrl:'',updatedAt:new Date().toISOString()};
    localStorage.setItem('onlyevent-admin-projects-v1',JSON.stringify([p]));
    localStorage.setItem('onlyevent-studio-v8:01-ip-only:c1:iframe',JSON.stringify({eventName:'收集测试展',booths:[]}));
  });
  await page.reload();
  await page.locator('[data-admin-page="collect"]').click();
  await expect(page.locator('#collectSetup')).toBeVisible();
  await page.locator('#collectEnable').click();
  await expect(page.locator('#collectLinkBox')).toBeVisible();
  const link=await page.locator('#collectLinkInput').inputValue();
  const token=link.match(/t=([a-f0-9]{20})/)[1];

  const form=await context.newPage();
  await routeSameOrigin(form,cloud.env);
  await form.goto('/collect/?t='+token);
  await expect(form.locator('#formTitle')).toContainText('收集测试展');
  await form.locator('#fName').fill('浮光工房');
  await form.locator('#fType').fill('原创插画');
  await form.locator('#fIntro').fill('原创插画与画集');
  await form.locator('#fContact').fill('QQ 12345');
  await form.locator('#logoFile').setInputFiles({name:'logo.gif',mimeType:'image/gif',buffer:Buffer.from([71,73,70,56,57,97])});
  await expect(form.locator('#logoThumb')).toHaveCSS('background-image',/media\/uploads\/collect/);
  await form.locator('.p-name').first().fill('星空画集');
  await form.locator('.p-price').first().fill('¥45');
  await form.locator('#submitBtn').click();
  await expect(form.locator('#stateTitle')).toHaveText('提交成功');
  await form.close();

  await page.locator('#collectRefresh').click();
  await expect(page.locator('.collect-entry')).toHaveCount(1);
  await expect(page.locator('.collect-entry')).toContainText('浮光工房');
  await expect(page.locator('.collect-entry')).toContainText('QQ 12345');
  await expect(page.locator('#collectCount')).toHaveText('1');
  await page.locator('.collect-no input').fill('A07');
  await page.locator('.collect-entry .approve').click();
  await expect(page.locator('.collect-pill')).toHaveText('已加入摊位');
  const booths=await page.evaluate(()=>JSON.parse(localStorage.getItem('onlyevent-studio-v8:01-ip-only:c1:iframe')).booths);
  expect(booths).toHaveLength(1);
  expect(booths[0]).toMatchObject({no:'A07',name:'浮光工房',type:'原创插画'});
  expect(booths[0].products[0]).toMatchObject({name:'星空画集',price:'¥45'});
  expect(booths[0].logo).toMatch(/\/media\/uploads\/collect\//);

  await page.locator('#collectToggle').click();
  const closed=await context.newPage();
  await routeSameOrigin(closed,cloud.env);
  await closed.goto('/collect/?t='+token);
  await expect(closed.locator('#stateTitle')).toHaveText('收集已结束');
});
