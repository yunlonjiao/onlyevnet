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
  await expect(page.locator('#studioVersion')).toHaveText('v8.34.51');
  await expect(page.locator('.studio-topbar > .brand-zone')).toHaveCount(1);
  await expect(page.locator('.studio-topbar > .top-actions')).toHaveCount(1);
  const shellBox=await page.locator('.studio-shell').boundingBox();
  const canvasBox=await page.locator('#canvas').boundingBox();
  expect(shellBox.width).toBeGreaterThan(1000);
  expect(canvasBox.width).toBeGreaterThan(500);

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

test('admin exposes explicit project deletion and published-site unpublish controls',async({page})=>{
  await page.goto('/admin/');
  await page.evaluate(()=>{
    const project={id:'published-test',name:'已发布测试',templateId:'01-ip-only',siteUrl:'https://published-test.onlyevent.cn',status:'published',updatedAt:new Date().toISOString()};
    localStorage.setItem('onlyevent-admin-projects-v1',JSON.stringify([project]));
    localStorage.setItem('onlyevent-studio-publish:01-ip-only:published-test:iframe',JSON.stringify({siteId:'site-1',editToken:'token-1',url:project.siteUrl,slug:'published-test'}));
  });
  await page.reload();
  await expect(page.locator('.delete-project')).toHaveText('删除项目');
  await expect(page.locator('.unpublish-site')).toHaveText('下线网站');
  await expect(page.locator('.project-menu')).toHaveCount(0);
});

test('root sends organizers to the admin platform',async({page})=>{
  await page.goto('/');
  await expect(page).toHaveURL(/\/admin\/$/);
});
