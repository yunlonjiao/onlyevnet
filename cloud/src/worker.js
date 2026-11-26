import { ApiError, errorPayload, codeForStatus } from './core/errors.js';
import { JSON_HEADERS, HTML_HEADERS, CORS_ALLOW_HEADERS, CORS_ALLOW_METHODS, CONTENT_SECURITY_POLICY, baseDomain, publicUrl, allowedOrigin, corsOrigin, withCors, json, html, redirect, cookie, cookieHeaders } from './core/http.js';
import { validUsername, cleanSlug, cleanText, bodyJson } from './core/validation.js';
import { now, id } from './core/ids.js';
import { mediaKeysFromValue } from './media/keys.js';
import { extFromType, uploadImage, serveMedia } from './media/upload.js';
import { deleteProjectMedia } from './media/cleanup.js';
import { currentProjectSite } from './sites/access.js';
import { markCurrentProjectPublished, archiveCurrentSiteVersion } from './sites/history.js';
import { createSite, updateSite, MAX_SITE_HTML_BYTES } from './sites/publish.js';
import { listSiteVersions, rollbackSite, deleteSite } from './sites/manage.js';
import { putSiteStages } from './sites/stages.js';
import { deleteSiteResources, stageKeys } from './sites/resources.js';
import { randomToken, sha256 } from './core/crypto.js';
import { hashPassword, newSalt } from './auth/password.js';
import { newRecoveryCode, formatRecoveryCode, recoveryCandidates } from './auth/recovery.js';
import { clientIp, rateLimit } from './auth/rate-limit.js';
import { parseCookies, authUser, requireUser, issueSession, logout } from './auth/session.js';
import { PROJECT_COOKIE, currentProjectId, projectWithAccess, projectFor, projectCookie, emptyProjectCookie, ownedProject } from './projects/access.js';
import { seedProject } from './projects/seed.js';
import { ensureProjectState, createProject, duplicateProject, openProject, deleteProject, restoreProject } from './projects/lifecycle.js';
import { purgeProject } from './projects/purge.js';
import { listProjectMembers, addProjectMember, removeProjectMember } from './projects/members.js';
import { collectText, collectOverview, collectManage, collectEntryUpdate, collectInfo, collectImage, collectSubmit } from './forms/collect.js';
import { signupList, signupCreate, signupUpdate, signupEntries, signupEntryUpdate, signupInfo, signupSubmit } from './forms/signup.js';
import { askPublic, askSubmit, askOverview, askManage, askQuestionUpdate, askWidget } from './forms/questions.js';
import { countView, projectStats } from './stats.js';
import { listFeedback, sendFeedback, accountOverview } from './overview.js';
import { cleanupInactiveSites } from './cleanup.js';
import { serveSlug } from './sites/serve.js';
import { getConfig, putConfig, resetConfig } from './projects/config.js';

const APP_VERSION='7.27.0';
// D1 rows are capped at 2,000,000 bytes; leave room for the other columns.
/* Offline support for visitor sites: the page and its images are kept after a first visit,
   so the site still opens at a venue with no signal. Online visits always fetch the newest version. */
const VISITOR_SW=`const CACHE='oe-visitor-v1',HOME='/',MAX_IMAGES=200;
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
async function trim(cache){const keys=await cache.keys();for(const k of keys.slice(0,Math.max(0,keys.length-MAX_IMAGES)))await cache.delete(k)}
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).then(res=>{
      if(res.ok&&new URL(res.url||req.url).pathname==='/'){const copy=res.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(HOME,copy)))}
      return res;
    }).catch(async()=>(await caches.match(HOME))||new Response('当前没有网络，这个网站还没缓存。联网打开一次后就能离线看。',{status:503,headers:{'content-type':'text/plain; charset=utf-8'}})));
    return;
  }
  if(req.destination==='image'){
    e.respondWith(caches.open(CACHE).then(async cache=>{
      const hit=await cache.match(req);
      const net=fetch(req).then(res=>{if(res.ok||res.type==='opaque'){cache.put(req,res.clone()).then(()=>trim(cache))}return res}).catch(()=>hit);
      return hit||net;
    }));
  }
});
`;
const VISITOR_SW_HEADERS={'content-type':'application/javascript; charset=utf-8','cache-control':'no-cache','service-worker-allowed':'/','x-content-type-options':'nosniff'};
const RESERVED_SUBDOMAINS=new Set(['www','publisher','api','admin','app']);

// Recovery codes: 12 characters from an alphabet without 0/O/1/I, shown as XXXX-XXXX-XXXX (60 bits).
// Codes issued before this change (24 characters, case-sensitive) still verify as typed.
function getSlugFromHost(req,env){const host=new URL(req.url).hostname.toLowerCase(),base=baseDomain(env);if(!base||base.includes('example.com')||!host.endsWith('.'+base))return '';const sub=host.slice(0,-(base.length+1));if(!sub||sub.includes('.')||RESERVED_SUBDOMAINS.has(sub))return '';return cleanSlug(sub)}

async function register(req,env){await rateLimit(env,'register:'+clientIp(req),5,3600);const b=await bodyJson(req),username=cleanText(b.username,32),password=String(b.password||'');if(!validUsername(username))return json({ok:false,error:'主办方名称需为 2–32 个字符，可使用中英文、数字、空格、_ 或 -'},400);if(password.length<6)return json({ok:false,error:'密码至少 6 位'},400);const exists=await env.DB.prepare('SELECT id FROM users WHERE username=? COLLATE NOCASE').bind(username).first();if(exists)return json({ok:false,error:'这个账号已经注册'},409);const salt=newSalt(),passwordHash=await hashPassword(password,salt),userId=id('usr'),recoveryCode=newRecoveryCode(),recoverySalt=newSalt(),recoveryHash=await hashPassword(recoveryCode,recoverySalt),created=now();await env.DB.batch([env.DB.prepare('INSERT INTO users(id,username,password_hash,password_salt,created_at) VALUES(?,?,?,?,?)').bind(userId,username,passwordHash,salt,created),env.DB.prepare('INSERT INTO account_recovery(user_id,code_hash,code_salt,updated_at) VALUES(?,?,?,?)').bind(userId,recoveryHash,recoverySalt,created)]);return issueSession(env,userId,username,201,{recoveryCode:formatRecoveryCode(recoveryCode)})}
async function login(req,env){const b=await bodyJson(req),username=cleanText(b.username,32),password=String(b.password||'');await rateLimit(env,'login-ip:'+clientIp(req),30,900);await rateLimit(env,'login:'+username.toLowerCase(),10,900);const row=await env.DB.prepare('SELECT id,username,password_hash,password_salt FROM users WHERE username=? COLLATE NOCASE').bind(username).first();if(!row)return json({ok:false,error:'账号或密码不正确'},401);const got=await hashPassword(password,row.password_salt);if(got!==row.password_hash)return json({ok:false,error:'账号或密码不正确'},401);return issueSession(env,row.id,row.username)}
async function recoverAccount(req,env){const b=await bodyJson(req);await rateLimit(env,'recover-ip:'+clientIp(req),20,3600);await rateLimit(env,'recover:'+cleanText(b.username,32).toLowerCase(),5,3600);const username=cleanText(b.username,32),recoveryCode=String(b.recoveryCode||'').trim(),newPassword=String(b.newPassword||'');if(!validUsername(username)||!recoveryCode)return json({ok:false,error:'请输入账号和恢复码'},400);if(newPassword.length<6)return json({ok:false,error:'新密码至少 6 位'},400);const row=await env.DB.prepare(`SELECT users.id,account_recovery.code_hash,account_recovery.code_salt FROM users LEFT JOIN account_recovery ON account_recovery.user_id=users.id WHERE users.username=? COLLATE NOCASE LIMIT 1`).bind(username).first();if(!row?.code_hash)return json({ok:false,error:'账号或恢复码不正确'},400);let matched=false;for(const candidate of recoveryCandidates(recoveryCode)){if(await hashPassword(candidate,row.code_salt)===row.code_hash){matched=true;break}}if(!matched)return json({ok:false,error:'账号或恢复码不正确'},400);const salt=newSalt(),passwordHash=await hashPassword(newPassword,salt);await env.DB.batch([env.DB.prepare('UPDATE users SET password_hash=?,password_salt=? WHERE id=?').bind(passwordHash,salt,row.id),env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(row.id)]);return json({ok:true})}
async function rotateRecoveryCode(req,env){const u=await requireUser(req,env),recoveryCode=newRecoveryCode(),recoverySalt=newSalt(),recoveryHash=await hashPassword(recoveryCode,recoverySalt),updated=now();await env.DB.prepare(`INSERT INTO account_recovery(user_id,code_hash,code_salt,updated_at) VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET code_hash=excluded.code_hash,code_salt=excluded.code_salt,updated_at=excluded.updated_at`).bind(u.id,recoveryHash,recoverySalt,updated).run();return json({ok:true,recoveryCode:formatRecoveryCode(recoveryCode),updatedAt:updated})}
async function changePassword(req,env){
  const u=await requireUser(req,env);await rateLimit(env,'password:'+u.id,10,3600);
  const b=await bodyJson(req),oldPassword=String(b.oldPassword||''),newPassword=String(b.newPassword||'');
  if(newPassword.length<6)return json({ok:false,error:'新密码至少 6 位'},400);
  const row=await env.DB.prepare('SELECT password_hash,password_salt FROM users WHERE id=?').bind(u.id).first();
  if(!row||await hashPassword(oldPassword,row.password_salt)!==row.password_hash)return json({ok:false,error:'当前密码不正确'},400);
  const salt=newSalt(),hash=await hashPassword(newPassword,salt);
  // Other devices must sign in again with the new password; this session stays.
  await env.DB.batch([env.DB.prepare('UPDATE users SET password_hash=?,password_salt=? WHERE id=?').bind(hash,salt,u.id),env.DB.prepare('DELETE FROM sessions WHERE user_id=? AND token_hash<>?').bind(u.id,u.tokenHash)]);
  return json({ok:true});
}
async function deleteAccount(req,env){
  const u=await requireUser(req,env);await rateLimit(env,'account-delete:'+u.id,5,3600);
  const b=await bodyJson(req),password=String(b.password||'');
  const row=await env.DB.prepare('SELECT password_hash,password_salt FROM users WHERE id=?').bind(u.id).first();
  if(!row||await hashPassword(password,row.password_salt)!==row.password_hash)return json({ok:false,error:'密码不正确'},400);
  // Collect every stored file first: once the user row is gone the links to them are gone too.
  const keys=new Set();
  const add=rows=>{for(const r of rows.results||[])if(r.object_key)keys.add(r.object_key)};
  add(await env.DB.prepare('SELECT object_key FROM sites WHERE user_id=?').bind(u.id).all());
  add(await env.DB.prepare('SELECT v.object_key FROM site_versions v JOIN sites s ON s.id=v.site_id WHERE s.user_id=?').bind(u.id).all());
  add(await env.DB.prepare('SELECT v.object_key FROM site_stages v JOIN sites s ON s.id=v.site_id WHERE s.user_id=?').bind(u.id).all());
  add(await env.DB.prepare('SELECT m.object_key FROM project_media m JOIN projects p ON p.id=m.project_id WHERE p.user_id=?').bind(u.id).all());
  const {results=[]}=await env.DB.prepare('SELECT config_json FROM projects WHERE user_id=?').bind(u.id).all();
  for(const r of results){try{for(const k of mediaKeysFromValue(JSON.parse(r.config_json||'{}')))keys.add(k)}catch{}}
  await env.DB.prepare('DELETE FROM users WHERE id=?').bind(u.id).run();
  for(const key of keys){try{await env.SITES.delete(key)}catch(e){console.error(e)}}
  return json({ok:true});
}


async function listProjects(req,env){const u=await requireUser(req,env),active=currentProjectId(req),trash=new URL(req.url).searchParams.get('trash')==='1';const {results=[]}=await env.DB.prepare(`SELECT p.id,p.name,p.user_id,p.local_project_id,p.config_json,p.created_at,p.updated_at,s.id AS site_id,ps.published_at,ps.deleted_at,s.status AS site_status,s.slug AS site_slug FROM projects p LEFT JOIN project_state ps ON ps.project_id=p.id LEFT JOIN project_sites m ON m.project_id=p.id LEFT JOIN sites s ON s.id=m.site_id WHERE (p.user_id=? OR EXISTS(SELECT 1 FROM project_members pm WHERE pm.project_id=p.id AND pm.user_id=?)) AND ${trash?'ps.deleted_at IS NOT NULL':'ps.deleted_at IS NULL'} ORDER BY ${trash?'ps.deleted_at':'p.updated_at'} DESC`).bind(u.id,u.id).all();return json({ok:true,projects:results.map(r=>{let c={};try{c=JSON.parse(r.config_json||'{}')}catch{}const publishedAt=r.published_at||null,hasChanges=!!publishedAt&&new Date(r.updated_at).getTime()>new Date(publishedAt).getTime();return {id:r.id,name:r.name,shared:r.user_id!==u.id,localProjectId:r.local_project_id||null,eventDate:c.eventDate||'',eventLocation:c.eventLocation||'',heroImage:c.heroImage||'',siteId:r.site_id||null,visitorSiteUrl:r.site_slug?publicUrl(env,r.site_slug,req):(c.visitorSiteUrl||''),eventTemplate:c.eventTemplate||'blank',templateId:typeof c.templateId==='string'?c.templateId:'',config:c,createdAt:r.created_at,updatedAt:r.updated_at,publishedAt,deletedAt:r.deleted_at||null,siteStatus:r.site_status||null,publishState:r.site_status==='inactive'?'inactive':!publishedAt?'draft':hasChanges?'changes':'published',active:r.id===active}})})}

async function listSites(req,env){const u=await requireUser(req,env),p=await projectFor(req,env,u);if(!p)return json({ok:true,sites:[]});const site=await currentProjectSite(req,env,u,p);if(!site)return json({ok:true,sites:[]});return json({ok:true,sites:[{id:site.id,project_id:p.id,slug:site.slug,title:site.title,size_bytes:site.size_bytes,status:site.status,last_viewed_at:site.last_viewed_at,removed_at:site.removed_at,created_at:site.created_at,updated_at:site.updated_at,url:publicUrl(env,site.slug,req)}]})}

async function accountStatus(req,env){const u=await authUser(req,env);const row=await env.DB.prepare('SELECT COUNT(*) AS n FROM users').first();return json({ok:true,initialized:Number(row?.n||0)>0,authenticated:!!u,username:u?.username||null})}
async function sessionInfo(req,env){const u=await authUser(req,env);return json(u?{authenticated:true,role:'organizer',username:u.username,boothId:null}:{authenticated:false})}
async function systemLinks(req,env){const u=await requireUser(req,env),p=await projectFor(req,env,u),site=p?await currentProjectSite(req,env,u,p):null;let cfg={};try{cfg=JSON.parse(p?.config_json||'{}')}catch{}const visitor=site?publicUrl(env,site.slug,req):(cfg.visitorSiteUrl||new URL(req.url).origin+'/');return json({ok:true,visitor,autoVisitor:visitor,scope:'public',publicUrl:visitor,customVisitor:!!site})}

async function handleApi(req,env,path){
  if(path==='/api/health'&&req.method==='GET')return json({ok:true,version:APP_VERSION,app:'onlyevent',baseDomain:baseDomain(env)});
  if(path==='/api/account/status'&&req.method==='GET')return accountStatus(req,env);
  if((path==='/api/account/register'||path==='/api/auth/register')&&req.method==='POST')return register(req,env);
  if((path==='/api/account/login'||path==='/api/auth/login')&&req.method==='POST')return login(req,env);
  if(path==='/api/account/recover'&&req.method==='POST')return recoverAccount(req,env);
  if(path==='/api/account/recovery-code'&&req.method==='POST')return rotateRecoveryCode(req,env);
  if(path==='/api/account/password'&&req.method==='POST')return changePassword(req,env);
  if(path==='/api/account/delete'&&req.method==='POST')return deleteAccount(req,env);
  if((path==='/api/logout'||path==='/api/auth/logout')&&req.method==='POST')return logout(req,env);
  if(path==='/api/me'&&req.method==='GET'){const u=await requireUser(req,env);return json({ok:true,user:{id:u.id,username:u.username}})}
  if(path==='/api/session'&&req.method==='GET')return sessionInfo(req,env);
  if(path==='/api/projects'&&req.method==='GET')return listProjects(req,env);
  if(path==='/api/projects'&&req.method==='POST')return createProject(req,env);
  if(path==='/api/projects/trash'&&req.method==='GET')return listProjects(req,env);
  if(path==='/api/overview'&&req.method==='GET')return accountOverview(req,env);
  if(path==='/api/feedback'&&req.method==='POST')return sendFeedback(req,env);
  if(path==='/api/feedback'&&req.method==='GET')return listFeedback(req,env);
  let m=path.match(/^\/api\/projects\/([^/]+)\/stats$/);
  if(m&&req.method==='GET')return projectStats(req,env,decodeURIComponent(m[1]));
  m=path.match(/^\/api\/signup\/([a-f0-9]+)$/);
  if(m&&req.method==='GET')return signupInfo(req,env,m[1]);
  if(m&&req.method==='POST')return signupSubmit(req,env,m[1]);
  m=path.match(/^\/api\/projects\/([^/]+)\/signups$/);
  if(m&&req.method==='GET')return signupList(req,env,decodeURIComponent(m[1]));
  if(m&&req.method==='POST')return signupCreate(req,env,decodeURIComponent(m[1]));
  m=path.match(/^\/api\/projects\/([^/]+)\/signups\/([^/]+)$/);
  if(m&&(req.method==='POST'||req.method==='DELETE'))return signupUpdate(req,env,decodeURIComponent(m[1]),decodeURIComponent(m[2]));
  m=path.match(/^\/api\/projects\/([^/]+)\/signups\/([^/]+)\/entries$/);
  if(m&&req.method==='GET')return signupEntries(req,env,decodeURIComponent(m[1]),decodeURIComponent(m[2]));
  m=path.match(/^\/api\/projects\/([^/]+)\/signups\/([^/]+)\/entries\/([^/]+)$/);
  if(m&&(req.method==='POST'||req.method==='DELETE'))return signupEntryUpdate(req,env,decodeURIComponent(m[1]),decodeURIComponent(m[2]),decodeURIComponent(m[3]));
  m=path.match(/^\/api\/ask\/([a-zA-Z0-9_-]+)$/);
  if(m&&req.method==='GET')return askPublic(req,env,m[1]);
  if(m&&req.method==='POST')return askSubmit(req,env,m[1]);
  m=path.match(/^\/api\/projects\/([^/]+)\/questions$/);
  if(m&&req.method==='GET')return askOverview(req,env,decodeURIComponent(m[1]));
  if(m&&req.method==='POST')return askManage(req,env,decodeURIComponent(m[1]));
  m=path.match(/^\/api\/projects\/([^/]+)\/questions\/([^/]+)$/);
  if(m&&(req.method==='POST'||req.method==='DELETE'))return askQuestionUpdate(req,env,decodeURIComponent(m[1]),decodeURIComponent(m[2]));
  m=path.match(/^\/api\/collect\/([a-f0-9]+)(\/image)?$/);
  if(m&&m[2]&&req.method==='POST')return collectImage(req,env,m[1]);
  if(m&&!m[2]&&req.method==='GET')return collectInfo(req,env,m[1]);
  if(m&&!m[2]&&req.method==='POST')return collectSubmit(req,env,m[1]);
  m=path.match(/^\/api\/projects\/([^/]+)\/collect$/);
  if(m&&req.method==='GET')return collectOverview(req,env,decodeURIComponent(m[1]));
  if(m&&req.method==='POST')return collectManage(req,env,decodeURIComponent(m[1]));
  m=path.match(/^\/api\/projects\/([^/]+)\/collect\/entries\/([^/]+)$/);
  if(m&&(req.method==='POST'||req.method==='DELETE'))return collectEntryUpdate(req,env,decodeURIComponent(m[1]),decodeURIComponent(m[2]));
  m=path.match(/^\/api\/projects\/([^/]+)\/open$/);if(m&&req.method==='POST')return openProject(req,env,decodeURIComponent(m[1]));
  m=path.match(/^\/api\/projects\/([^/]+)\/duplicate$/);if(m&&req.method==='POST')return duplicateProject(req,env,decodeURIComponent(m[1]));
  m=path.match(/^\/api\/projects\/([^/]+)\/restore$/);if(m&&req.method==='POST')return restoreProject(req,env,decodeURIComponent(m[1]));
  m=path.match(/^\/api\/projects\/([^/]+)\/purge$/);if(m&&req.method==='DELETE')return purgeProject(req,env,decodeURIComponent(m[1]));
  m=path.match(/^\/api\/projects\/([^/]+)\/members$/);if(m&&req.method==='GET')return listProjectMembers(req,env,decodeURIComponent(m[1]));if(m&&req.method==='POST')return addProjectMember(req,env,decodeURIComponent(m[1]));
 m=path.match(/^\/api\/projects\/([^/]+)\/members\/([^/]+)$/);if(m&&req.method==='DELETE')return removeProjectMember(req,env,decodeURIComponent(m[1]),decodeURIComponent(m[2]));
 m=path.match(/^\/api\/projects\/([^/]+)$/);if(m&&req.method==='DELETE')return deleteProject(req,env,decodeURIComponent(m[1]));
  if(path==='/api/config'&&req.method==='GET')return getConfig(req,env);
  if(path==='/api/config'&&req.method==='PUT')return putConfig(req,env);
  if(path==='/api/public/config'&&req.method==='GET')return getConfig(req,env,true);
  if(path==='/api/reset'&&req.method==='POST')return resetConfig(req,env);
  if(path==='/api/upload'&&req.method==='POST')return uploadImage(req,env);
  if(path==='/api/system/links'&&req.method==='GET')return systemLinks(req,env);
  if(path==='/api/sites'&&req.method==='GET')return listSites(req,env);
  if(path==='/api/sites'&&req.method==='POST')return createSite(req,env);
  m=path.match(/^\/api\/sites\/([^/]+)\/stages$/);if(m&&req.method==='PUT')return putSiteStages(req,env,decodeURIComponent(m[1]));
  m=path.match(/^\/api\/sites\/([^/]+)\/versions$/);if(m&&req.method==='GET')return listSiteVersions(req,env,decodeURIComponent(m[1]));
  m=path.match(/^\/api\/sites\/([^/]+)\/rollback\/([^/]+)$/);if(m&&req.method==='POST')return rollbackSite(req,env,decodeURIComponent(m[1]),decodeURIComponent(m[2]));
  m=path.match(/^\/api\/sites\/([^/]+)$/);if(m&&req.method==='PUT')return updateSite(req,env,decodeURIComponent(m[1]));if(m&&req.method==='DELETE')return deleteSite(req,env,decodeURIComponent(m[1]));
  return json({ok:false,code:'NOT_FOUND',message:'API 不存在',error:'API 不存在'},404);
}

export default {
  async scheduled(event,env,ctx){ctx.waitUntil(cleanupInactiveSites(env));},
  async fetch(req,env){
    try{
      const url=new URL(req.url),path=url.pathname;
      if(req.method==='OPTIONS'){const origin=corsOrigin(req,env);return new Response(null,{status:204,headers:origin?{'access-control-allow-origin':origin,'access-control-allow-methods':CORS_ALLOW_METHODS,'access-control-allow-headers':CORS_ALLOW_HEADERS,'access-control-max-age':'86400','vary':'Origin'}:{}})}
      if(path==='/health')return json({ok:true,time:now(),mode:'online-saas',version:APP_VERSION,baseDomain:baseDomain(env),host:url.hostname});
      if(path.startsWith('/media/'))return await serveMedia(req,env,decodeURIComponent(path.slice('/media/'.length)));
      if(path.startsWith('/api/')){
        if(!['GET','HEAD','OPTIONS'].includes(req.method)){
          let source=req.headers.get('origin')||'';
          if(!source&&req.headers.get('referer')){try{source=new URL(req.headers.get('referer')).origin}catch{}}
          if(source && !allowedOrigin(source,env)) throw new ApiError(403, 'FORBIDDEN', '跨站请求被拒绝');
        }
        return withCors(req,env,await handleApi(req,env,path));
      }
      const hostSlug=getSlugFromHost(req,env);
      if(hostSlug&&path==='/sw.js'&&req.method==='GET')return new Response(VISITOR_SW,{headers:VISITOR_SW_HEADERS});
      if(hostSlug&&path==='/robots.txt')return new Response('User-agent: *\nAllow: /\n',{headers:{'content-type':'text/plain; charset=utf-8','cache-control':'public,max-age=3600'}});
      if(hostSlug&&path==='/favicon.ico')return new Response(null,{status:204,headers:{'cache-control':'public,max-age=86400'}});
      if(hostSlug)return await serveSlug(req,env,hostSlug);
      const sp=path.match(/^\/s\/([a-zA-Z0-9_-]+)\/?$/);if(sp&&req.method==='GET')return await serveSlug(req,env,sp[1]);
      if(path==='/')return redirect('/admin/');
      if(path==='/admin')return redirect('/admin/');
      const assetResponse=await env.ASSETS.fetch(req);
      if(path.startsWith('/v8/')||path.startsWith('/admin/')||path==='/robots.txt'){
        // The editor loads same-origin module graphs: keep them revalidated and un-framable from other sites.
        const headers=new Headers(assetResponse.headers);
        headers.set('x-content-type-options','nosniff');headers.set('referrer-policy','strict-origin-when-cross-origin');headers.set('x-frame-options','SAMEORIGIN');headers.set('content-security-policy',CONTENT_SECURITY_POLICY);headers.set('cache-control','no-store, max-age=0');
        return new Response(assetResponse.body,{status:assetResponse.status,statusText:assetResponse.statusText,headers});
      }
      if(path.startsWith('/collect/')||path.startsWith('/signup/')){
        // Public form for circle leaders: not for search engines, and always the current version.
        const headers=new Headers(assetResponse.headers);
        headers.set('cache-control','no-store');headers.set('x-robots-tag','noindex, nofollow');
        headers.set('x-content-type-options','nosniff');headers.set('referrer-policy','no-referrer');headers.set('x-frame-options','DENY');
        return new Response(assetResponse.body,{status:assetResponse.status,statusText:assetResponse.statusText,headers});
      }
      if(path.startsWith('/admin/')){
        const headers=new Headers(assetResponse.headers);
        headers.set('cache-control','no-store, no-cache, must-revalidate');
        headers.set('pragma','no-cache');
        headers.set('expires','0');
        headers.set('x-content-type-options','nosniff');headers.set('referrer-policy','strict-origin-when-cross-origin');headers.set('x-frame-options','SAMEORIGIN');
        headers.set('x-onlyevent-version',APP_VERSION);
        return new Response(assetResponse.body,{status:assetResponse.status,statusText:assetResponse.statusText,headers});
      }
      return assetResponse;
    }catch(e){const out=errorPayload(e);if(!(e instanceof ApiError))console.error('[unhandled]',{path:req.url,method:req.method,message:e?.message,stack:e?.stack});return withCors(req,env,json(out.payload,out.status))}
  }
};
