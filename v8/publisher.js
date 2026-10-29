/* Client for the convention-publisher Worker (cloud/src/worker.js).
   Organizer accounts live in D1; the session token is sent as a Bearer header so the
   CMS can run on Pages, the Worker domain or onlyevent.cn without third-party cookies.
   Every site belongs to one cloud project, selected with the X-OnlyEvent-Project header. */
const WORKER_ORIGIN='https://convention-publisher.onlyevents.workers.dev';
// On onlyevent.cn (and the Worker's own address) the editor and the API share one origin; anywhere else
// (Pages previews, local servers) it calls the Worker cross-origin.
// onlyevent.localhost only exists on a developer machine (the Worker run locally with BASE_DOMAIN=onlyevent.localhost).
const SAME_ORIGIN_HOSTS=/^(?:www\.)?onlyevent\.(?:cn|localhost)$|^convention-publisher\.onlyevents\.workers\.dev$/;
export const PUBLISHER_ORIGIN=typeof location!=='undefined'&&SAME_ORIGIN_HOSTS.test(location.hostname)?location.origin:WORKER_ORIGIN;
export const CLOUD_SESSION_KEY='onlyevent-cloud-session-v1';

export function readCloudSession(){
  try{const s=JSON.parse(localStorage.getItem(CLOUD_SESSION_KEY)||'null');return s?.token?s:null}catch{return null}
}
function writeCloudSession(data){
  const session={token:data.token,username:data.user?.username||data.username||'',userId:data.user?.id||'',expiresAt:data.expiresAt||''};
  localStorage.setItem(CLOUD_SESSION_KEY,JSON.stringify(session));
  return session;
}
export function clearCloudSession(){localStorage.removeItem(CLOUD_SESSION_KEY)}

async function readJson(response){
  const text=await response.text();
  let data={};
  try{data=text?JSON.parse(text):{}}catch{data={message:text}}
  if(!response.ok||data?.ok===false){
    const error=new Error(data?.error||data?.message||('发布服务返回 '+response.status));
    error.status=response.status;
    error.data=data;
    if(response.status===401)clearCloudSession();
    throw error;
  }
  return data;
}

async function api(path,{method='GET',body,projectId,auth=true}={}){
  const headers={};
  if(body!==undefined)headers['Content-Type']='application/json';
  const session=auth?readCloudSession():null;
  if(auth&&!session)throw Object.assign(new Error('请先登录主办方账号'),{status:401});
  if(session)headers.Authorization='Bearer '+session.token;
  if(projectId)headers['X-OnlyEvent-Project']=projectId;
  const response=await fetch(PUBLISHER_ORIGIN+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
  return readJson(response);
}

export async function registerAccount({username,password}){
  const data=await api('/api/account/register',{method:'POST',body:{username,password},auth:false});
  return {session:writeCloudSession(data),recoveryCode:data.recoveryCode||''};
}
export async function loginAccount({username,password}){
  return writeCloudSession(await api('/api/account/login',{method:'POST',body:{username,password},auth:false}));
}
export async function recoverAccount({username,recoveryCode,newPassword}){
  return api('/api/account/recover',{method:'POST',body:{username,recoveryCode,newPassword},auth:false});
}
export async function rotateRecoveryCode(){
  return (await api('/api/account/recovery-code',{method:'POST',body:{}})).recoveryCode;
}
export async function fetchAccount(){
  return (await api('/api/me')).user;
}
export async function logoutAccount(){
  try{if(readCloudSession())await api('/api/logout',{method:'POST',body:{}})}
  finally{clearCloudSession()}
}

/* Reuse the cloud project recorded for this local project, or create one. */
export async function ensureCloudProject({cloudProjectId,name}){
  if(cloudProjectId){
    const {projects=[]}=await api('/api/projects');
    if(projects.some(p=>p.id===cloudProjectId))return cloudProjectId;
  }
  const data=await api('/api/projects',{method:'POST',body:{name:String(name||'OnlyEvent').slice(0,160),template:'blank'}});
  return data.project.id;
}

/* Local project -> cloud project mapping, shared by sync, uploads and publishing. */
const cloudProjectKey=(templateId,projectId)=>'onlyevent-cloud-project:'+templateId+':'+projectId;
export function getCloudProjectId(templateId,projectId){
  try{return localStorage.getItem(cloudProjectKey(templateId,projectId))||''}catch{return ''}
}
export function setCloudProjectId(templateId,projectId,cloudProjectId){
  try{localStorage.setItem(cloudProjectKey(templateId,projectId),cloudProjectId)}catch{}
}
export async function ensureCloudProjectFor({templateId,projectId,name,known=''}){
  const id=await ensureCloudProject({cloudProjectId:known||getCloudProjectId(templateId,projectId),name});
  setCloudProjectId(templateId,projectId,id);
  return id;
}
/* The site (if any) published from a cloud project, so any signed-in device can update or take it down. */
export async function getCloudSite(projectId){
  const {sites=[]}=await api('/api/sites',{projectId});
  return sites[0]||null;
}
export async function listCloudProjects(){
  return (await api('/api/projects')).projects||[];
}
export async function loadCloudConfig(projectId){
  return (await api('/api/config',{projectId})).config||null;
}
export async function saveCloudConfig({projectId,config}){
  return api('/api/config',{method:'PUT',projectId,body:{config}});
}
export async function restoreCloudProject(projectId){
  return api('/api/projects/'+encodeURIComponent(projectId)+'/restore',{method:'POST',body:{}});
}
export async function purgeCloudProject(projectId){
  return api('/api/projects/'+encodeURIComponent(projectId)+'/purge',{method:'DELETE'});
}
export async function changeAccountPassword({oldPassword,newPassword}){
  return api('/api/account/password',{method:'POST',body:{oldPassword,newPassword}});
}
export async function getCollect(cloudProjectId){
  return api('/api/projects/'+encodeURIComponent(cloudProjectId)+'/collect');
}
export async function manageCollect(cloudProjectId,action){
  return api('/api/projects/'+encodeURIComponent(cloudProjectId)+'/collect',{method:'POST',body:{action}});
}
export async function setCollectEntryStatus(cloudProjectId,entryId,status){
  return api('/api/projects/'+encodeURIComponent(cloudProjectId)+'/collect/entries/'+encodeURIComponent(entryId),{method:'POST',body:{status}});
}
export async function deleteCollectEntry(cloudProjectId,entryId){
  return api('/api/projects/'+encodeURIComponent(cloudProjectId)+'/collect/entries/'+encodeURIComponent(entryId),{method:'DELETE'});
}
export const collectLink=token=>PUBLISHER_ORIGIN+'/collect/?t='+token;
export const cloudMediaUrl=url=>/^\/media\//.test(url||'')?PUBLISHER_ORIGIN+url:(url||'');
export async function deleteCloudProject(projectId){
  return api('/api/projects/'+encodeURIComponent(projectId),{method:'DELETE'});
}
/* Uploads an image to R2 and returns its absolute, publicly cacheable URL. */
export async function uploadCloudImage({blob,projectId,filename='image.webp'}){
  const session=readCloudSession();
  if(!session)throw Object.assign(new Error('请先登录主办方账号'),{status:401});
  const form=new FormData();form.append('file',blob,filename);
  const response=await fetch(PUBLISHER_ORIGIN+'/api/upload',{method:'POST',headers:{Authorization:'Bearer '+session.token,'X-OnlyEvent-Project':projectId},body:form});
  const data=await readJson(response);
  return PUBLISHER_ORIGIN+data.url;
}

function normalizeSite(data,{slug}={}){
  const site=data?.site||data||{};
  const nextSlug=site.slug||slug||'';
  return {siteId:site.id||site.siteId||'',slug:nextSlug,url:site.url||(nextSlug?'https://'+nextSlug+'.onlyevent.cn':''),raw:data};
}

export function cleanSlug(value){
  return String(value||'')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//,'')
    .replace(/\.onlyevent\.cn.*$/,'')
    .replace(/[^a-z0-9-]+/g,'-')
    .replace(/-+/g,'-')
    .replace(/^-|-$/g,'')
    .slice(0,50);
}

export function suggestSlug(eventName,date=''){
  const fromName=cleanSlug(eventName);
  if(fromName.length>=3)return fromName;
  const datePart=String(date||'').replace(/\D/g,'').slice(0,8);
  return 'event'+(datePart?'-'+datePart:'');
}

export function isValidSlug(value){
  const slug=cleanSlug(value);
  return slug.length>=3&&slug.length<=50&&/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(slug);
}

export async function createSite({html,title,slug,templateId,projectId}){
  if(!projectId)throw new Error('缺少云端活动项目');
  return normalizeSite(await api('/api/sites',{method:'POST',projectId,body:{html,title,slug,templateId}}),{slug});
}

export async function updateSite({siteId,projectId,html,title,slug,templateId}){
  if(!siteId)throw new Error('缺少已发布站点 ID');
  if(!projectId)throw new Error('缺少云端活动项目');
  return normalizeSite(await api('/api/sites/'+encodeURIComponent(siteId),{method:'PUT',projectId,body:{html,title,slug,templateId}}),{slug});
}

export async function deleteSite({siteId,projectId}){
  if(!siteId)throw new Error('缺少已发布站点 ID');
  if(!projectId)throw new Error('缺少云端活动项目');
  return api('/api/sites/'+encodeURIComponent(siteId),{method:'DELETE',projectId});
}
