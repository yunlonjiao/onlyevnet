import {test,expect} from '@playwright/test';

test('Market editor updates data and refreshes its live preview',async({page})=>{
 await page.goto('/v8/market-editor.html');
 await expect(page.locator('#panelTitle')).toHaveText('基本信息');
 await page.locator('[data-path="eventName"]').fill('新测试同人创作展');
 await expect(page.frameLocator('#previewFrame').locator('#top [data-event-name]')).toHaveText('新测试同人创作展',{timeout:12000});
 await page.getByRole('button',{name:'社团管理'}).click();
 await page.locator('[data-add="creators"]').click();
 await expect(page.locator('[data-path^="creators."][data-path$=".name"]')).toHaveCount(1);
 await page.getByRole('button',{name:'制品管理'}).click();
 await page.locator('[data-add="products"]').click();
 await expect(page.locator('[data-path^="products."][data-path$=".name"]')).toHaveCount(1);
 await page.getByRole('button',{name:'手机'}).click();
 await expect(page.locator('#frameBox')).toHaveClass(/mobile/);
});
test('Market 01 homepage removes the redundant information ribbon and intro card',async({page})=>{
 await page.goto('/v8/market-01-preview.html');
 await expect(page.locator('.ribbon')).toHaveCount(0);
 await expect(page.locator('.home-intro')).toHaveCount(0);
 await expect(page.locator('#randomSix .tile')).toHaveCount(6);
 await expect(page.locator('#tickets')).toBeVisible();
});
