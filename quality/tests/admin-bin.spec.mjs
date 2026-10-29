import {test,expect} from '@playwright/test';
import {useCloudPublisher,signInCloud} from './cloud-publisher.mjs';

test.use({viewport:{width:1440,height:900}});

async function seed(page,names){
  const cloud=await useCloudPublisher(page);
  await signInCloud(page,cloud,'bin-organizer');
  await page.goto('/admin/');
  await expect(page.locator('#adminShell')).toBeVisible();
  await page.evaluate(names=>{
    const list=names.map((name,i)=>({id:'p'+i,name,templateId:'01-ip-only',status:'draft',siteUrl:'',updatedAt:new Date().toISOString()}));
    localStorage.setItem('onlyevent-admin-projects-v1',JSON.stringify(list));
    list.forEach(p=>localStorage.setItem('onlyevent-studio-v8:01-ip-only:'+p.id+':iframe',JSON.stringify({eventName:p.name})));
  },names);
  await page.reload();
  await expect(page.locator('#projectGrid .project-card')).toHaveCount(names.length);
  return cloud;
}

test('duplicating a project copies its content under a new name',async({page})=>{
  await seed(page,['春季展']);
  await page.locator('.duplicate-project').click();
  await expect(page.locator('#projectGrid .project-card')).toHaveCount(2);
  await expect(page.locator('#projectGrid')).toContainText('春季展 副本');
  const copied=await page.evaluate(()=>{
    const list=JSON.parse(localStorage.getItem('onlyevent-admin-projects-v1'));
    const copy=list.find(p=>p.name==='春季展 副本');
    return JSON.parse(localStorage.getItem('onlyevent-studio-v8:01-ip-only:'+copy.id+':iframe'));
  });
  expect(copied.eventName).toBe('春季展 副本');
});

test('deleted projects wait in the recycle bin and can be restored or purged',async({page})=>{
  await seed(page,['甲','乙']);
  page.on('dialog',d=>d.accept());
  await page.locator('.delete-project').first().click();
  await expect(page.locator('#projectGrid .project-card')).toHaveCount(1);
  await expect(page.locator('#binCount')).toHaveText('1');
  await page.locator('[data-admin-page="bin"]').click();
  await expect(page.locator('#binGrid .bin-card')).toHaveCount(1);
  await page.locator('.restore-project').click();
  await expect(page.locator('#binGrid .bin-card')).toHaveCount(0);
  await page.locator('[data-admin-page="projects"]').click();
  await expect(page.locator('#projectGrid .project-card')).toHaveCount(2);
  await page.locator('.delete-project').first().click();
  await page.locator('[data-admin-page="bin"]').click();
  await page.locator('.purge-project').click();
  await expect(page.locator('#emptyBin')).toBeVisible();
  await expect(page.locator('#binCount')).toBeHidden();
});

test('batch select moves several projects to the bin and back',async({page})=>{
  await seed(page,['一','二','三']);
  page.on('dialog',d=>d.accept());
  await page.locator('#selectModeBtn').click();
  await page.locator('#selectAllProjects').check();
  await expect(page.locator('#selectedCount')).toHaveText('3');
  await page.locator('#bulkTrashBtn').click();
  await expect(page.locator('#projectGrid .project-card')).toHaveCount(0);
  await page.locator('[data-admin-page="bin"]').click();
  await expect(page.locator('#binGrid .bin-card')).toHaveCount(3);
  await page.locator('#selectAllBin').check();
  await page.locator('#binRestoreBtn').click();
  await page.locator('[data-admin-page="projects"]').click();
  await expect(page.locator('#projectGrid .project-card')).toHaveCount(3);
});

test('account settings change the password',async({page})=>{
  await seed(page,[]);
  await page.locator('[data-admin-page="settings"]').click();
  await expect(page.locator('#settingsUsername')).toHaveText('bin-organizer');
  await page.locator('#oldPassword').fill('wrong-password');
  await page.locator('#newPassword').fill('another-pass-1');
  await page.locator('#newPassword2').fill('another-pass-1');
  await page.locator('#changePasswordForm button[type=submit]').click();
  await expect(page.locator('#changePasswordMessage')).not.toBeEmpty();
  await expect(page.locator('#changePasswordMessage')).not.toContainText('已修改');
});
