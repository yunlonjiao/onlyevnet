/*
 * Offline, user-controlled project transfer between OnlyEvent origins (Vercel / Cloudflare).
 * Never export the simulated account database, login session or password/recovery hashes.
 * Publish records (site + cloud project IDs) are excluded unless the organizer opts in;
 * managing a restored site still requires signing in to the owning organizer account.
 */
export const BACKUP_KIND='onlyevent-project-backup';
export const BACKUP_VERSION=1;
const PROJECTS_KEY='onlyevent-admin-projects-v1';
const prefix=templateId=>String(templateId||'');
export const projectStateKey=(templateId,id)=>'onlyevent-studio-v8:'+prefix(templateId)+':'+id+':iframe';
export const projectPublishKey=(templateId,id)=>'onlyevent-studio-publish:'+prefix(templateId)+':'+id+':iframe';

const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const safeText=(x,max=500)=>typeof x==='string'?x.slice(0,max):'';
const normalizeProject=p=>{
 if(!object(p)||!safeText(p.id,120)||!safeText(p.templateId,100))throw new Error('备份中存在无效项目 ID 或模板');
 return {
  id:safeText(p.id,120),templateId:safeText(p.templateId,100),
  name:safeText(p.name,200)||'未命名活动',
  status:p.status==='published'?'published':'draft',
  siteUrl:safeText(p.siteUrl,1200),
  updatedAt:safeText(p.updatedAt,60)||new Date().toISOString()
 };
};
const readJSON=(storage,key)=>{
 const raw=storage.getItem(key);
 if(!raw)return null;
 try{return JSON.parse(raw)}catch{throw new Error('项目 '+key+' 的本地数据已损坏，未生成不完整备份')}
};
export function makeProjectBackup(projects,storage,{includePublisherCredentials=false,createdAt=new Date().toISOString()}={}){
 if(!Array.isArray(projects))throw new Error('项目列表格式无效');
 const records=projects.map(p=>{
  const project=normalizeProject(p);
  const state=readJSON(storage,projectStateKey(project.templateId,project.id));
  if(state!==null&&!object(state))throw new Error('活动「'+project.name+'」的数据格式无效');
  const record={project,state};
  if(includePublisherCredentials){
   const raw=readJSON(storage,projectPublishKey(project.templateId,project.id));
   if(raw!==null){
    if(!object(raw))throw new Error('项目发布记录格式无效');
    record.publication={
     siteId:safeText(raw.siteId,240),cloudProjectId:safeText(raw.cloudProjectId,120),
     slug:safeText(raw.slug,120),url:safeText(raw.url,1200),
     publishedAt:safeText(raw.publishedAt,60)
    };
   }
  }
  return record;
 });
 return {kind:BACKUP_KIND,version:BACKUP_VERSION,createdAt,containsPublisherCredentials:!!includePublisherCredentials,records};
}
export function validateProjectBackup(data,{allowedTemplateIds}={}){
 if(!object(data)||data.kind!==BACKUP_KIND||data.version!==BACKUP_VERSION||!Array.isArray(data.records))
  throw new Error('不是受支持的 OnlyEvent 项目备份（需要 v1 JSON 文件）');
 if(data.records.length>500)throw new Error('单次最多导入 500 个项目');
 const allowed=allowedTemplateIds?new Set(allowedTemplateIds):null,seen=new Set();
 return data.records.map((row,index)=>{
  if(!object(row))throw new Error('第 '+(index+1)+' 个项目内容无效');
  const project=normalizeProject(row.project);
  if(allowed&&!allowed.has(project.templateId))throw new Error('模板不受支持：'+project.templateId);
  if(seen.has(project.id))throw new Error('备份中包含重复项目 ID：'+project.id);
  seen.add(project.id);
  if(row.state!=null&&!object(row.state))throw new Error('项目数据必须是对象');
  if(row.publication!=null&&!object(row.publication))throw new Error('发布管理记录格式无效');
  const publication=object(row.publication)?{
   siteId:safeText(row.publication.siteId,240),
   cloudProjectId:safeText(row.publication.cloudProjectId,120),
   slug:safeText(row.publication.slug,120),
   url:safeText(row.publication.url,1200),
   publishedAt:safeText(row.publication.publishedAt,60)
  }:null;
  return {project,state:row.state??null,publication};
 });
}
export function restoreProjectBackup(data,storage,{existingProjects=[],allowedTemplateIds,makeId}={}){
 if(!Array.isArray(existingProjects))throw new Error('现有项目列表格式无效');
 const incoming=validateProjectBackup(data,{allowedTemplateIds});
 const used=new Set(existingProjects.map(p=>String(p.id))),writes=[],added=[];
 const newId=makeId||(()=> 'oe-import-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10));
 for(const item of incoming){
  let id=item.project.id;
  if(used.has(id)){
   let attempts=0;
   do{id=String(newId());attempts++;if(attempts>200||!id||id.length>120)throw new Error('无法生成唯一的导入项目 ID')}while(used.has(id));
  }
  used.add(id);
  const project={...item.project,id};
  const state=item.state===null?null:{...item.state,projectId:id,templateId:project.templateId};
  if(state!==null)writes.push([projectStateKey(project.templateId,id),JSON.stringify(state)]);
  const pub=item.publication;
  // Sites without their cloud project record cannot be managed again, so they come back as drafts.
  if(pub?.siteId&&pub.cloudProjectId&&pub.url){
   project.status='published';project.siteUrl=pub.url;
   writes.push([projectPublishKey(project.templateId,id),JSON.stringify(pub)]);
  }else{project.status='draft';project.siteUrl=''}
  added.push(project);
 }
 const merged=[...existingProjects,...added];
 writes.push([PROJECTS_KEY,JSON.stringify(merged)]);
 // A failed quota write must not leave a half-imported workspace behind.
 const before=new Map(writes.map(([key])=>[key,storage.getItem(key)]));
 try{
  for(const [key,value] of writes)storage.setItem(key,value);
 }catch(error){
  for(const [key,oldValue] of before){
   try{if(oldValue===null)storage.removeItem(key);else storage.setItem(key,oldValue)}catch{}
  }
  throw new Error('导入失败：浏览器本地空间不足或存储不可用；已尝试恢复之前的项目。'+(error?.message?' '+error.message:''));
 }
 return {projects:merged,added,credentialsRestored:added.filter(p=>p.status==='published').length};
}
