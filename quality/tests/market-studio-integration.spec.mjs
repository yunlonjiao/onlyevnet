import {test,expect} from '@playwright/test';

for(const id of ['03-creator-market','04-creator-catalogue']){
 test(id+' launches in existing OnlyEvent Studio and uses independent type fields',async({page})=>{
  await page.goto('/v8/?template='+id+'&project=market-integration-qa');
  await expect(page.locator('#workspaceTemplateName')).toContainText(id.startsWith('03')?'创作放送':'星绘场刊');
  await expect(page.locator('#inspector')).toContainText('活动名称');
  for(const label of ['首页','动画','摊位','场地图','观展指南'])await expect(page.locator('.page-nav [data-market-page]').filter({hasText:label})).toHaveCount(1);
  await expect(page.locator('#createCustomPageBtn')).toBeHidden();
  await expect(page.locator('#marketOrganizerEventName')).toBeVisible();
  await page.locator('#pageContentNav [data-section="images"]').click();
  await expect(page.locator('[data-market-upload="heroImage"]')).toBeVisible();
  await expect(page.locator('input[data-file="heroImage"]')).toBeHidden();
  await expect(page.frameLocator('#liveFrame').locator('[data-market-edit-path="eventName"]').first()).toHaveAttribute('contenteditable','true');
  await page.locator('#pageContentNav [data-section="creators"]').click();
  await expect(page.locator('#inspector')).toContainText('社团管理');
  await page.locator('[data-add="creators"]').click();
  await expect(page.locator('[data-market-tags]')).toHaveCount(1);
  await page.locator('#pageContentNav [data-section="products"]').click();
  await page.locator('[data-add="products"]').click();
  await expect(page.locator('select[data-key$=".creatorId"]')).toHaveCount(1);
  await page.locator('#pageContentNav [data-section="basic"]').click();
  await page.locator('#inspector [data-key="eventName"]').fill('社团创作展集成测试');
  await expect(page.locator('#marketOrganizerEventName')).toHaveText('社团创作展集成测试');
  await expect(page.frameLocator('#liveFrame').locator('[data-event-name]').first()).toHaveText('社团创作展集成测试',{timeout:12000});
  await page.locator('#publishBtn').click();
  await expect(page.locator('#publishDialog')).toBeVisible();
  await expect(page.locator('#publishDownload')).toBeEnabled();
 });
}

test('Market 03 canvas product card opens matching inspector without navigating away',async({page})=>{
 await page.addInitScript(()=>{const key='onlyevent-studio-v8:03-creator-market:market-card-selection-qa:iframe';localStorage.setItem(key,JSON.stringify({eventName:'社团卡片测试',creators:[{id:'c-qa',name:'测试社团',booth:'A01',tags:[]}],products:[{id:'p-qa',name:'测试制品',creatorId:'c-qa',price:'10'}]}));});
 await page.goto('/v8/?template=03-creator-market&project=market-card-selection-qa');
 const frame=page.frameLocator('#liveFrame');
 const card=frame.locator('#randomSix [data-market-record="products"]').first();
 await expect(card).toBeVisible();
 const id=await card.getAttribute('data-market-record-id');
 await card.click();
 await expect(page.locator('#inspector')).toContainText('制品管理');
 await expect(page.locator('#inspector [data-key$=".name"]')).toHaveCount(1);
 await expect(frame.locator('#randomSix [data-market-record-id="'+id+'"]')).toHaveClass(/oe-selected-edit-target/);
});
