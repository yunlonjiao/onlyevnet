import {test,expect} from '@playwright/test';

test.use({viewport:{width:1440,height:900}});

test('admin is the product entry and exposes projects plus template library',async({page})=>{
  await page.goto('/admin/');
  await expect(page.locator('.brand-copy b')).toContainText('OnlyEvent Studio');
  await expect(page.locator('[data-page-panel="projects"] h1')).toHaveText('我的活动');
  await page.locator('[data-admin-page="templates"]').click();
  await expect(page.locator('[data-page-panel="templates"] h1')).toHaveText('选择网站模板');
  await expect(page.locator('#templateGrid .template-card').first()).toContainText('IP ONLY');
  await expect(page.locator('#templateGrid [data-template="01-ip-only"]')).toBeVisible();
});

test('creating from Template 01 opens a project-scoped Studio and returns to admin',async({page})=>{
  await page.goto('/admin/');
  await page.locator('[data-admin-page="templates"]').click();
  await page.locator('[data-template="01-ip-only"]').click();
  await expect(page.locator('#createDialog')).toBeVisible();
  await page.locator('#createProjectName').fill('测试 ONLY 2027');
  await page.locator('#createForm button[type="submit"]').click();

  await expect(page).toHaveURL(/\/v8\/\?template=01-ip-only&project=/);
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeVisible();
  await expect(page.locator('#projectEventName')).toHaveText('测试 ONLY 2027');
  await expect(page.locator('#studioVersion')).toHaveText('v8.34.48');

  const url=new URL(page.url());
  const projectId=url.searchParams.get('project');
  expect(projectId).toBeTruthy();
  const storage=await page.evaluate(({projectId})=>({
    project:localStorage.getItem('onlyevent-studio-v8:01-ip-only:'+projectId+':iframe'),
    admin:localStorage.getItem('onlyevent-admin-projects-v1')
  }),{projectId});
  expect(storage.admin).toContain('测试 ONLY 2027');

  await page.locator('#adminHomeLink').click();
  await expect(page).toHaveURL(/\/admin\/$/);
  await expect(page.locator('#projectGrid .project-card')).toContainText('测试 ONLY 2027');
});

test('root sends organizers to the admin platform',async({page})=>{
  await page.goto('/');
  await expect(page).toHaveURL(/\/admin\/$/);
});
