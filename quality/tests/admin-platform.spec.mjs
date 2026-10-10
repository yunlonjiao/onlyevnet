import {test,expect} from '@playwright/test';

test.use({viewport:{width:1440,height:900}});

async function signInSim(page,name='QA 主办方'){
  await signInSim(page);
  await page.evaluate(({name})=>{
    const user={id:'qa-organizer',name,email:'',passwordHash:'qa',recoveryHash:'qa',authType:'quick',createdAt:new Date().toISOString()};
    localStorage.setItem('onlyevent-auth-sim-users-v1',JSON.stringify([user]));
    localStorage.setItem('onlyevent-auth-sim-session-v1',JSON.stringify({userId:user.id,createdAt:new Date().toISOString()}));
  },{name});
  await page.reload();
  await expect(page.locator('#adminShell')).toBeVisible();
}

test('admin is the product entry and exposes projects plus template library',async({page})=>{
  await signInSim(page);
  await expect(page.locator('.brand-copy b')).toContainText('OnlyEvent Studio');
  await expect(page.locator('[data-page-panel="projects"] h1')).toHaveText('我的活动');
  await page.locator('[data-admin-page="templates"]').click();
  await expect(page.locator('[data-page-panel="templates"] h1')).toHaveText('选择网站模板');
  await expect(page.locator('#templateGrid .template-card').first()).toContainText('IP ONLY');
  await expect(page.locator('#templateGrid [data-template="01-ip-only"]')).toBeVisible();
});

test('creating from Template 01 opens a project-scoped Studio and returns to admin',async({page})=>{
  await signInSim(page);
  await page.locator('[data-admin-page="templates"]').click();
  await page.locator('[data-template="01-ip-only"]').click();
  await expect(page.locator('#createDialog')).toBeVisible();
  await page.locator('#createProjectName').fill('测试 ONLY 2027');
  await page.locator('#createForm button[type="submit"]').click();

  await expect(page).toHaveURL(/\/v8\/\?template=01-ip-only&project=/);
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeVisible();
  await expect(page.locator('#projectEventName')).toHaveText('测试 ONLY 2027');
  await expect(page.locator('#studioVersion')).toHaveText(/v8\.34\.\d+/);
  await expect(page.locator('#backAdminBtn')).toHaveText('← 返回主页');
  await expect(page.locator('#adminHomeLink')).toHaveCount(0);
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

  await page.locator('#backAdminBtn').click();
  await expect(page).toHaveURL(/\/admin\/$/);
  await expect(page.locator('#projectGrid .project-card')).toContainText('测试 ONLY 2027');
});

test('admin exposes explicit project deletion and published-site unpublish controls',async({page})=>{
  await signInSim(page);
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


test('admin header has no duplicate template/create shortcuts and sidebar stays compact',async({page})=>{
  await signInSim(page);
  await expect(page.locator('#templateLibraryBtn')).toHaveCount(0);
  await expect(page.locator('#newProjectBtn')).toHaveCount(0);
  const sidebar=await page.locator('.admin-sidebar').boundingBox();
  expect(sidebar.width).toBeLessThan(190);
});

test('empty-project panel disappears when a project exists',async({page})=>{
  await signInSim(page);
  await page.evaluate(()=>{
    localStorage.setItem('onlyevent-admin-projects-v1',JSON.stringify([{
      id:'one-project',name:'第一个活动',templateId:'01-ip-only',status:'draft',updatedAt:new Date().toISOString(),siteUrl:''
    }]));
  });
  await page.reload();
  await expect(page.locator('#projectGrid .project-card')).toHaveCount(1);
  await expect(page.locator('#emptyProjects')).toBeHidden();
});
