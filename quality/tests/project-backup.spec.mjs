import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {useCloudPublisher,signInCloud} from './cloud-publisher.mjs';

async function authorize(page){
 await signInCloud(page,await useCloudPublisher(page),'备份验收主办方');
 await page.goto('/admin/');
 await expect(page.locator('#adminShell')).toBeVisible();
}
const fake=(projects,states={},publish={})=>{
 const map=new Map(Object.entries({'onlyevent-admin-projects-v1':JSON.stringify(projects),...states,...publish}));
 return {getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k),has:k=>map.has(k)};
};
test('project backup excludes passwords, sessions and publisher tokens by default',async({page})=>{
 await page.goto('/admin/');
 const result=await page.evaluate(async()=>{
  const {makeProjectBackup}=await import('/admin/project-backup.js');
  const store=new Map([
   ['onlyevent-studio-v8:03-creator-market:test-1:iframe',JSON.stringify({eventName:'安全备份测试',products:[{id:'p',name:'徽章'}]})],
   ['onlyevent-studio-publish:03-creator-market:test-1:iframe',JSON.stringify({siteId:'secret-site',cloudProjectId:'prj_secret',url:'https://demo.onlyevent.cn'})],
   ['onlyevent-cloud-session-v1','SUPER-SECRET-SESSION']
  ]);
  const storage={getItem:key=>store.get(key)||null};
  const projects=[{id:'test-1',name:'安全备份测试',templateId:'03-creator-market',siteUrl:'https://demo.onlyevent.cn',status:'published'}];
  return {plain:makeProjectBackup(projects,storage),withSecret:makeProjectBackup(projects,storage,{includePublisherCredentials:true})};
 });
 expect(result.plain).toMatchObject({kind:'onlyevent-project-backup',version:1,containsPublisherCredentials:false});
 expect(result.plain.records[0].state.products[0].name).toBe('徽章');
 expect(JSON.stringify(result.plain)).not.toContain('prj_secret');
 expect(JSON.stringify(result.plain)).not.toContain('SUPER-SECRET-SESSION');
 expect(result.plain.records[0]).not.toHaveProperty('publication');
 expect(result.withSecret.records[0].publication.cloudProjectId).toBe('prj_secret');
 expect(JSON.stringify(result.withSecret)).not.toContain('SUPER-SECRET-SESSION');
});
test('restore adds project without overwriting a colliding existing project',async({page})=>{
 await page.goto('/admin/');
 const result=await page.evaluate(async()=>{
  const {makeProjectBackup,restoreProjectBackup}=await import('/admin/project-backup.js');
  const values=new Map(),storage={
   getItem:key=>values.get(key)??null,
   setItem:(key,value)=>values.set(key,String(value)),
   removeItem:key=>values.delete(key)
  };
  const original={id:'same-id',name:'旧活动',templateId:'01-ip-only'};
  values.set('onlyevent-admin-projects-v1',JSON.stringify([original]));
  values.set('onlyevent-studio-v8:01-ip-only:same-id:iframe',JSON.stringify({eventName:'旧活动'}));
  const backup=makeProjectBackup([{id:'same-id',name:'导入活动',templateId:'03-creator-market'}],{
   getItem:key=>key.endsWith('same-id:iframe')?JSON.stringify({eventName:'导入活动',products:[{name:'星星徽章'}]}):null
  });
  const imported=restoreProjectBackup(backup,storage,{existingProjects:[original],allowedTemplateIds:['01-ip-only','03-creator-market'],makeId:()=> 'imported-unique'});
  return {
   count:imported.projects.length,id:imported.added[0].id,
   oldState:JSON.parse(values.get('onlyevent-studio-v8:01-ip-only:same-id:iframe')),
   newState:JSON.parse(values.get('onlyevent-studio-v8:03-creator-market:imported-unique:iframe'))
  };
 });
 expect(result).toMatchObject({count:2,id:'imported-unique',oldState:{eventName:'旧活动'},newState:{eventName:'导入活动',projectId:'imported-unique',products:[{name:'星星徽章'}]}});
});
test('published sites require explicit publisher credentials to remain manageable after restore',async({page})=>{
 await page.goto('/admin/');
 const result=await page.evaluate(async()=>{
  const {restoreProjectBackup}=await import('/admin/project-backup.js');
  const template={id:'pub',name:'已发布活动',templateId:'01-ip-only',status:'published',siteUrl:'https://example.onlyevent.cn'};
  const map=new Map(),storage={
   getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)
  };
  const backup={kind:'onlyevent-project-backup',version:1,records:[{project:template,state:{eventName:'已发布活动'}}]};
  const noCredential=restoreProjectBackup(backup,storage,{allowedTemplateIds:['01-ip-only']});
  const secondStore=new Map(),store2={
   getItem:k=>secondStore.get(k)??null,setItem:(k,v)=>secondStore.set(k,v),removeItem:k=>secondStore.delete(k)
  };
  backup.records[0].publication={siteId:'site-1',cloudProjectId:'prj_1',url:'https://example.onlyevent.cn',slug:'example'};
  const withCredential=restoreProjectBackup(backup,store2,{allowedTemplateIds:['01-ip-only']});
  return {noCredential:noCredential.added[0],withCredential:withCredential.added[0],publishedRecord:JSON.parse(secondStore.get('onlyevent-studio-publish:01-ip-only:pub:iframe'))};
 });
 expect(result.noCredential).toMatchObject({status:'draft',siteUrl:''});
 expect(result.withCredential).toMatchObject({status:'published',siteUrl:'https://example.onlyevent.cn'});
 expect(result.publishedRecord.cloudProjectId).toBe('prj_1');
});
test('failed import rolls back all changes including the project list',async({page})=>{
 await page.goto('/admin/');
 const result=await page.evaluate(async()=>{
  const {restoreProjectBackup}=await import('/admin/project-backup.js');
  const data={kind:'onlyevent-project-backup',version:1,records:[{project:{id:'new',name:'新项目',templateId:'01-ip-only'},state:{eventName:'新项目'}}]};
  const map=new Map([['onlyevent-admin-projects-v1','[]']]);
  let fail=true;
  const storage={
   getItem:k=>map.has(k)?map.get(k):null,
   setItem:(k,v)=>{if(k==='onlyevent-admin-projects-v1'&&fail){fail=false;throw new Error('quota')}map.set(k,String(v))},
   removeItem:k=>map.delete(k)
  };
  let error='';
  try{restoreProjectBackup(data,storage,{allowedTemplateIds:['01-ip-only']})}catch(e){error=e.message}
  return {error,keys:[...map.keys()],projects:map.get('onlyevent-admin-projects-v1')};
 });
 expect(result.error).toContain('导入失败');
 expect(result.keys).toEqual(['onlyevent-admin-projects-v1']);
 expect(result.projects).toBe('[]');
});
test('organizer can export JSON, import it, and reopen a restored project',async({page})=>{
 await authorize(page);
 await page.evaluate(()=>{
  localStorage.setItem('onlyevent-admin-projects-v1',JSON.stringify([{id:'my-event',name:'转移的漫展',templateId:'03-creator-market',status:'draft',siteUrl:''}]));
  localStorage.setItem('onlyevent-studio-v8:03-creator-market:my-event:iframe',JSON.stringify({eventName:'转移的漫展',description:'Cloudflare 项目迁移测试'}));
 });
 await page.reload();
 await expect(page.locator('#exportProjectBackupBtn')).toBeVisible();
 const [download]=await Promise.all([
  page.waitForEvent('download'),
  page.locator('#exportProjectBackupBtn').click()
 ]);
 expect(download.suggestedFilename()).toMatch(/^onlyevent-projects-\d{4}-\d{2}-\d{2}\.json$/);
 const bytes=await readFile(await download.path());
 const backup=JSON.parse(bytes.toString('utf8'));
 expect(backup.records).toHaveLength(1);
 expect(backup.records[0].state.description).toBe('Cloudflare 项目迁移测试');
 await page.evaluate(()=>{
  localStorage.removeItem('onlyevent-admin-projects-v1');
  localStorage.removeItem('onlyevent-studio-v8:03-creator-market:my-event:iframe');
 });
 await page.reload();
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#importProjectBackupFile').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:bytes});
 await expect(page.locator('#projectGrid .project-card')).toContainText('转移的漫展');
 await page.locator('.edit-project').click();
 await expect(page).toHaveURL(/\/v8\/\?template=03-creator-market&project=my-event/);
 await expect(page.locator('#projectEventName')).toHaveText('转移的漫展');
 await expect(page.locator('#inspector [data-key="description"]')).toHaveValue('Cloudflare 项目迁移测试');
});
