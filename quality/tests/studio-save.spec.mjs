import {test,expect} from '@playwright/test';

test.use({viewport:{width:1440,height:900}});

for(const id of ['01-ip-only','02-scrapbook'])test(id+' reports a failed save when browser storage is full',async({page})=>{
  await page.goto('/v8/?template='+id+'&project=qa-storage-full');
  const field=page.frameLocator('#liveFrame').locator('[data-oe-field="eventName"]').first();
  await expect(field).toHaveAttribute('contenteditable','true');
  await page.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('quota','QuotaExceededError')}});
  await field.click();
  await page.keyboard.type('X');
  await expect(page.locator('#saveState')).toHaveText('保存失败：图片过大或浏览器存储不足');
});
