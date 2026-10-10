import {test,expect} from '@playwright/test';

async function clearAuth(page){
  await page.goto('/admin/');
  await page.evaluate(()=>{
    localStorage.removeItem('onlyevent-auth-sim-users-v1');
    localStorage.removeItem('onlyevent-auth-sim-session-v1');
    localStorage.removeItem('onlyevent-admin-projects-v1');
  });
  await page.reload();
}

test('organizer quick registration, 6-digit recovery, logout and login form a complete flow',async({page})=>{
  await clearAuth(page);
  await expect(page.locator('#authShell')).toBeVisible();
  await expect(page.locator('#adminShell')).toBeHidden();

  await page.locator('[data-auth-page="register"]').click();
  await page.locator('#authQuickName').fill('QA 快速注册主办方');
  await page.locator('#authQuickPassword').fill('qa-password-01');
  await page.locator('#authQuickPassword2').fill('qa-password-01');
  await page.locator('#authQuickRegisterForm button[type="submit"]').click();

  await expect(page.locator('#authRecoveryCodeResult')).toBeVisible();
  const code=(await page.locator('#authRecoveryCodeValue').textContent())?.trim()||'';
  expect(code).toMatch(/^\d{6}$/);

  await page.locator('#authEnterAdmin').click();
  await expect(page.locator('#adminShell')).toBeVisible();
  await expect(page.locator('#authCurrentUser')).toHaveText('QA 快速注册主办方');

  await page.reload();
  await expect(page.locator('#adminShell')).toBeVisible();

  await page.locator('#authLogoutBtn').click();
  await expect(page.locator('#authShell')).toBeVisible();
  await page.locator('#authLoginAccount').fill('QA 快速注册主办方');
  await page.locator('#authLoginPassword').fill('qa-password-01');
  await page.locator('#authLoginForm button[type="submit"]').click();
  await expect(page.locator('#adminShell')).toBeVisible();

  await page.locator('#authLogoutBtn').click();
  await page.locator('#authForgotBtn').click();
  await page.locator('#authRecoveryName').fill('QA 快速注册主办方');
  await page.locator('#authRecoveryCode').fill(code);
  await page.locator('#authRecoveryPassword').fill('qa-password-02');
  await page.locator('#authRecoveryPassword2').fill('qa-password-02');
  await page.locator('#authCodeRecoveryForm button[type="submit"]').click();
  await expect(page.locator('#authRecoveryMessage')).toContainText('密码已重设');
  await page.waitForTimeout(1000);

  await page.locator('#authLoginAccount').fill('QA 快速注册主办方');
  await page.locator('#authLoginPassword').fill('qa-password-02');
  await page.locator('#authLoginForm button[type="submit"]').click();
  await expect(page.locator('#adminShell')).toBeVisible();
});

test('email registration and simulated email recovery complete without dead ends',async({page})=>{
  await clearAuth(page);
  await page.locator('[data-auth-page="register"]').click();
  await page.locator('[data-register-mode="email"]').click();
  await page.locator('#authEmailName').fill('QA 邮箱主办方');
  await page.locator('#authEmailAddress').fill('qa-organizer@example.com');
  await page.locator('#authEmailPassword').fill('mail-password-01');
  await page.locator('#authEmailPassword2').fill('mail-password-01');
  await page.locator('#authEmailRegisterForm button[type="submit"]').click();
  await expect(page.locator('#adminShell')).toBeVisible({timeout:3000});

  await page.locator('#authLogoutBtn').click();
  await page.locator('#authForgotBtn').click();
  await page.locator('[data-recovery-mode="email"]').click();
  await page.locator('#authRecoveryEmail').fill('qa-organizer@example.com');
  await page.locator('#authEmailRecoveryForm button[type="submit"]').click();
  await expect(page.locator('#authDemoMail')).toBeVisible();
  await page.locator('#authOpenDemoReset').click();
  await expect(page.locator('#authEmailResetForm')).toBeVisible();
  await page.locator('#authEmailResetPassword').fill('mail-password-02');
  await page.locator('#authEmailResetPassword2').fill('mail-password-02');
  await page.locator('#authEmailResetForm button[type="submit"]').click();
  await expect(page.locator('#authEmailResetMessage')).toContainText('密码已更新');
  await page.waitForTimeout(1000);

  await page.locator('#authLoginAccount').fill('qa-organizer@example.com');
  await page.locator('#authLoginPassword').fill('mail-password-02');
  await page.locator('#authLoginForm button[type="submit"]').click();
  await expect(page.locator('#adminShell')).toBeVisible();
});

test('visitor pages contain no internal design explanation copy and renderer has no console-breaking errors',async({page})=>{
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.goto('/v8/');
  const frame=page.frameLocator('#liveFrame');
  await expect(frame.locator('.hero')).toBeVisible();

  const forbidden=['这个模板','这里强调','不再使用','复用统一数据','设计说明','开发说明','模板说明'];
  for(const pageName of ['home','booths','activities','guests','guide']){
    if(pageName!=='home')await page.locator('.page-nav [data-page="'+pageName+'"]').click();
    const bodyText=await frame.locator('body').innerText();
    for(const phrase of forbidden)expect(bodyText).not.toContain(phrase);
  }
  expect(errors,'visitor/editor renderer must not emit console-breaking errors').toEqual([]);
});

for(const width of [1440,1024,768,430,390]){
  test('visitor layout has no horizontal overflow at '+width+'px',async({page})=>{
    await page.setViewportSize({width:1800,height:1100});
    await page.goto('/v8/');
    await page.locator('#canvas').evaluate((el,width)=>{
      el.style.width=width+'px';
      el.style.maxWidth='none';
      el.style.flex='0 0 auto';
    },width);
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.hero')).toBeVisible();
    await page.waitForTimeout(120);
    const overflow=await frame.locator('html').evaluate(el=>({
      scroll:el.scrollWidth,
      client:el.clientWidth,
      body:document.body.scrollWidth
    }));
    expect(Math.max(overflow.scroll,overflow.body)).toBeLessThanOrEqual(overflow.client+2);
  });
}

test('reduced-motion mode is present and core navigation remains usable',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/v8/');
  const frame=page.frameLocator('#liveFrame');
  await expect(frame.locator('.hero')).toBeVisible();
  const reduce=await frame.locator('html').evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  expect(reduce).toBe(true);
  await frame.locator('.quick a[data-page-link="booths"]').click();
  await expect(frame.locator('#booths')).toBeVisible();
  await frame.locator('#booths .section-back').click();
  await expect(frame.locator('.hero')).toBeVisible();
});

test('admin auth forms keep labels and keyboard-reachable controls',async({page})=>{
  await clearAuth(page);
  for(const id of ['authLoginAccount','authLoginPassword']){
    await expect(page.locator('label:has(#'+id+')')).toBeVisible();
  }
  await page.keyboard.press('Tab');
  const tag=await page.evaluate(()=>document.activeElement?.tagName||'');
  expect(['A','BUTTON','INPUT']).toContain(tag);
});
