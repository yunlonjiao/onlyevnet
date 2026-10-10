import {test,expect} from '@playwright/test';

test.use({viewport:{width:1440,height:900}});

test('publishes and updates the generated visitor site through Publisher API',async({page})=>{
  const requests=[];
  await page.route('https://convention-publisher.onlyevents.workers.dev/api/sites',async route=>{
    requests.push({method:route.request().method(),body:route.request().postDataJSON()});
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
      siteId:'site-test-1',slug:'stardust-only',url:'https://stardust-only.onlyevent.cn',editToken:'edit-test-token'
    })});
  });
  await page.route('https://convention-publisher.onlyevents.workers.dev/api/sites/site-test-1',async route=>{
    requests.push({
      method:route.request().method(),
      body:route.request().postDataJSON(),
      auth:route.request().headers()['authorization'],
      edit:route.request().headers()['x-edit-token']
    });
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
      siteId:'site-test-1',slug:'stardust-only',url:'https://stardust-only.onlyevent.cn'
    })});
  });

  await page.goto('/v8/');
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeVisible();
  await expect(page.locator('#publishBtnLabel')).toHaveText('发布网站');

  await page.locator('#publishBtn').click();
  await expect(page.locator('#publishDialog')).toBeVisible();
  await page.locator('#publishSlug').fill('stardust-only');
  await page.locator('#publishPrimary').click();

  await expect(page.locator('#publishStatus')).toHaveText('网站已上线');
  await expect(page.locator('#publishUrl')).toHaveText('https://stardust-only.onlyevent.cn');
  await expect(page.locator('#publishBtnLabel')).toHaveText('更新网站');
  expect(requests[0].method).toBe('POST');
  expect(requests[0].body.slug).toBe('stardust-only');
  expect(requests[0].body.templateId).toBe('01-ip-only');
  expect(requests[0].body.title).toBeTruthy();
  expect(requests[0].body.html).toContain('<!doctype html>');

  await page.locator('#publishPrimary').click();
  await expect.poll(()=>requests.length).toBe(2);
  expect(requests[1].method).toBe('PUT');
  expect(requests[1].auth).toBe('Bearer edit-test-token');
  expect(requests[1].edit).toBe('edit-test-token');
  expect(requests[1].body.editToken).toBe('edit-test-token');
  expect(requests[1].body.html).toContain('<!doctype html>');
});
