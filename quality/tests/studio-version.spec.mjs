import {test,expect} from '@playwright/test';

test('the editor shows the version from v8/version.js outside the production domain',async({page})=>{
  await page.goto('/v8/?template=01-ip-only&project=version-check');
  const expected=await page.evaluate(async()=>'v'+(await import('/v8/version.js?v=8.47.0')).STUDIO_VERSION);
  await expect(page.locator('#studioVersion')).toBeVisible();
  await expect(page.locator('#studioVersion')).toHaveText(expected);
});

test('the version badge is hidden on onlyevent.cn and shown on previews',async({page})=>{
  await page.goto('/v8/?template=01-ip-only&project=version-hide');
  const result=await page.evaluate(async()=>{
    const {applyStudioVersion}=await import('/v8/version.js?v=8.47.0');
    const probe=host=>{applyStudioVersion(document,host);return document.querySelector('#studioVersion').hidden};
    return {production:probe('onlyevent.cn'),www:probe('www.onlyevent.cn'),preview:probe('onlyevent-preview.pages.dev'),local:probe('127.0.0.1'),lookalike:probe('onlyevent.cn.evil.example')};
  });
  expect(result).toEqual({production:true,www:true,preview:false,local:false,lookalike:false});
});
