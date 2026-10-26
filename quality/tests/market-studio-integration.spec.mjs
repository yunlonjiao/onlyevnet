import {test,expect} from '@playwright/test';

// Template 03 moved to the shared core (template-03-unified.spec.mjs); 04 still uses the creator Studio.
for(const id of ['04-creator-catalogue']){
 test(id+' launches in existing OnlyEvent Studio and uses independent type fields',async({page})=>{
  await page.goto('/v8/?template='+id+'&project=market-integration-qa');
  await expect(page.locator('#workspaceTemplateName')).toContainText(id.startsWith('03')?'CREATOR MARKET':'CREATOR CATALOGUE');
  await expect(page.locator('#inspector')).toContainText('活动名称');
  for(const label of ['首页','动画','摊位','场地图','观展指南'])await expect(page.locator('.page-nav [data-market-page]').filter({hasText:label})).toHaveCount(1);
  await expect(page.locator('#createCustomPageBtn')).toBeHidden();
  await expect(page.locator('#marketOrganizerEventName')).toHaveCount(0);
  await expect(page.locator('#projectTemplateName')).toHaveText(id.startsWith('03')?'CREATOR MARKET':'CREATOR CATALOGUE');
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
  await expect(page.locator('#projectEventName')).toHaveText('社团创作展集成测试');
  await expect(page.frameLocator('#liveFrame').locator('[data-event-name]').first()).toHaveText('社团创作展集成测试',{timeout:12000});
  await page.locator('#publishBtn').click();
  await expect(page.locator('#publishDialog')).toBeVisible();
  await expect(page.locator('#publishDownload')).toBeEnabled();
 });
}
