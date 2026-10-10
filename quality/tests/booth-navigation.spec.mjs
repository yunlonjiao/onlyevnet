import {test,expect} from '@playwright/test';

test.use({viewport:{width:2000,height:1000}});

test.beforeEach(async({page})=>{
  await page.goto('/v8/');
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeVisible();
});

test('booth click opens full inspector, and product list has a short drill-down path',async({page})=>{
  const frame=page.frameLocator('#liveFrame');
  await page.locator('.page-nav [data-page="booths"]').click();
  const booth=frame.locator('#booths [data-oe-item="booths"]').first();
  await expect(booth).toBeVisible();
  await booth.locator('.booth-logo').click();
  await expect(page.locator('#inspector [data-key="no"]')).toBeVisible();
  await expect(page.locator('#inspector [data-key="name"]')).toBeVisible();
  await expect(page.locator('#inspector [data-booth-products-manage]')).toHaveText('制品列表');
  await expect(page.locator('#inspector [data-booth-products-manage] small')).toHaveCount(0);
  await expect(page.locator('#inspector [data-booth-products-manage] i')).toHaveCount(0);
  await expect(page.locator('#inspector [data-booth-product-add]')).toHaveCount(0);

  await page.locator('#inspector [data-booth-products-manage]').click();
  await expect(page.locator('#inspector [data-booth-product-open]')).toHaveCount(2);
  await expect(page.locator('#inspector [data-booth-product-open] small')).toHaveCount(0);
  await expect(page.locator('#inspector [data-booth-product-open] i')).toHaveCount(0);
  await expect(page.locator('#inspector [data-booth-product-open]').first()).toHaveText('新刊');
  await page.locator('#inspector [data-booth-product-open]').first().click();
  await expect(page.locator('#inspector [data-direct-product-key="name"]')).toBeVisible();
  await page.locator('#inspector [data-direct-product-back]').click();
  await expect(page.locator('#inspector [data-booth-product-back]')).toBeVisible();
  await page.locator('#inspector [data-booth-product-back]').click();
  await expect(page.locator('#inspector [data-key="no"]')).toBeVisible();

  await page.locator('#inspector [data-booth-products-manage]').click();
  await page.locator('#inspector [data-booth-product-add]').click();
  await expect(page.locator('#inspector [data-direct-product-key="name"]')).toHaveValue('新制品');
  await expect(frame.locator('#booths [data-oe-item="booths"]').first().locator('[data-view-booth-products]')).toContainText('3 件制品');
});

test('canvas navigation keeps the studio sidebar in sync across page links',async({page})=>{
  const frame=page.frameLocator('#liveFrame');
  for(const key of ['booths','activities','guests','guide']){
    await frame.locator('.nav [data-page-link="'+key+'"]').click();
    await expect(frame.locator('#'+key)).toBeVisible();
    await expect(page.locator('.page-nav [data-page="'+key+'"]')).toHaveClass(/active/);
    await expect(page.locator('.canvas-title b')).toContainText(key==='booths'?'摊位':key==='activities'?'活动':key==='guests'?'嘉宾':'指南');
  }
  await frame.locator('#guide .section-back').click();
  await expect(page.locator('.page-nav [data-page="home"]')).toHaveClass(/active/);
  await expect(frame.locator('.hero')).toBeVisible();
});

test('directory controls and search reset do not trigger false empty results',async({page})=>{
  const frame=page.frameLocator('#liveFrame');
  await page.locator('.page-nav [data-page="booths"]').click();
  const booths=frame.locator('#booths [data-directory-grid="booths"] [data-directory-card]:visible');
  await expect(booths).toHaveCount(3);
  const input=frame.locator('#booths [data-directory-search]');
  await expect(input).toHaveAttribute('placeholder','搜索社团，或制品名称 / Tag');
  const clear=frame.locator('#booths [data-directory-search-clear]');
  await input.fill('不存在的摊位');
  await expect(frame.locator('#booths .booth-no-result')).toBeVisible();
  await expect(clear).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
  await clear.click();
  await expect(input).toHaveValue('');
  await expect(booths).toHaveCount(3);
  await expect(frame.locator('#booths .booth-no-result')).toBeHidden();
  await frame.locator('#booths [data-directory-view-btn="products"]').click();
  await expect(frame.locator('#booths [data-directory-grid="products"]')).toBeVisible();
  await expect(input).toHaveAttribute('placeholder','搜索社团，或制品名称 / Tag');
  await frame.locator('#booths [data-directory-view-btn="booths"]').click();
  await expect(input).toHaveAttribute('placeholder','搜索社团，或制品名称 / Tag');
  await expect(booths).toHaveCount(3);
});

test('booth supports inline yellow-box text editing and full inspector by clicking non-text area',async({page})=>{
  const frame=page.frameLocator('#liveFrame');
  await page.locator('.page-nav [data-page="booths"]').click();
  const card=frame.locator('#booths [data-oe-item="booths"]').first();
  for(const key of ['no','name','type','intro']){
    const field=card.locator('[data-oe-field="booths.0.'+key+'"]');
    await expect(field).toHaveAttribute('contenteditable','true');
    await field.click();
    await expect(field).toBeFocused();
    await expect(page.locator('#inspector [data-key="no"]')).toHaveCount(0);
  }
  await card.locator('.booth-logo').click();
  await expect(page.locator('#inspector [data-key="no"]')).toBeVisible();
  await expect(page.locator('#inspector [data-key="name"]')).toBeVisible();
  await card.locator('[data-view-booth-products]').click();
  await expect(frame.locator('#booths [data-directory-grid="products"]')).toBeVisible();
});

test('guest supports inline editing as well as full inspector on image and blank area',async({page})=>{
  const frame=page.frameLocator('#liveFrame');
  await page.locator('.page-nav [data-page="guests"]').click();
  const card=frame.locator('#guests [data-oe-item="guests"]').first();
  await expect(card).toBeVisible();
  for(const key of ['name','role','intro']){
    const field=card.locator('[data-oe-field="guests.0.'+key+'"]');
    await expect(field).toHaveAttribute('contenteditable','true');
    await field.click();
    await expect(field).toBeFocused();
    await expect(page.locator('#inspector [data-guest-type]')).toHaveCount(0);
  }
  await card.locator('.guest-image').click();
  await expect(page.locator('#inspector [data-key="name"]')).toBeVisible();
  await expect(page.locator('#inspector [data-guest-type]')).toHaveCount(5);
  await expect(page.locator('#inspector [data-media-path="guests.0.image"]')).toBeVisible();
});

test('product card supports inline yellow-box editing and separate full editor',async({page})=>{
  const frame=page.frameLocator('#liveFrame');
  await page.locator('.page-nav [data-page="booths"]').click();
  await frame.locator('#booths [data-directory-view-btn="products"]').click();
  const card=frame.locator('#booths [data-product-edit-booth="0"][data-product-edit-index="0"]');
  await expect(card).toBeVisible();
  for(const key of ['name','tag','price']){
    const field=card.locator('[data-oe-field="booths.0.products.0.'+key+'"]');
    await expect(field).toHaveAttribute('contenteditable','true');
    await field.click();
    await expect(field).toBeFocused();
    await expect(page.locator('#inspector [data-direct-product-key="name"]')).toHaveCount(0);
  }
  const name=card.locator('[data-oe-field="booths.0.products.0.name"]');
  await name.fill('新测试制品名称');
  await expect(name).toContainText('新测试制品名称');
  await card.locator('.directory-product-image').click();
  await expect(page.locator('#inspector [data-direct-product-key="name"]')).toHaveValue('新测试制品名称');
  await expect(page.locator('#inspector [data-direct-product-key="tag"]')).toBeVisible();
  await expect(page.locator('#inspector [data-direct-product-key="price"]')).toBeVisible();
});

test('studio shows the current build version in the toolbar',async({page})=>{
  const badge=page.locator('#studioVersion');
  await expect(badge).toBeVisible();
  await expect(badge).toHaveText('v8.34.48');
});

test('favorite booth and product wishlist work in preview mode',async({page})=>{
  const frame=page.frameLocator('#liveFrame');
  await page.locator('.page-nav [data-page="booths"]').click();
  await page.locator('#previewBtn').click();
  await expect(page.locator('body')).toHaveClass(/previewing/);
  await expect(frame.locator('html')).toHaveClass(/oe-preview/);

  const boothFav=frame.locator('#booths [data-favorite-booth]').first();
  await expect(boothFav).toHaveText('♡ 收藏社团');
  await boothFav.click();
  await expect(boothFav).toHaveText('♥ 已收藏');
  await expect(frame.locator('#booths [data-wishlist-count]')).toHaveText('1');

  await frame.locator('#booths [data-directory-view-btn="products"]').click();
  await expect(frame.locator('#booths [data-directory-search]')).toHaveAttribute('placeholder','搜索社团，或制品名称 / Tag');
  const productFav=frame.locator('#booths [data-wishlist-product]').first();
  await expect(productFav).toHaveText('☆ 心愿');
  await productFav.click();
  await expect(productFav).toHaveText('★ 已加入');
  await expect(frame.locator('#booths [data-wishlist-count]')).toHaveText('1');

  await frame.locator('#booths button[data-directory-saved]').click();
  await expect(frame.locator('#booths [data-directory-grid="products"] [data-directory-card]:visible')).toHaveCount(1);
});