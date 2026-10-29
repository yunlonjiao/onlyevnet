import { DEFAULT_CONFIG } from './seed.js';

const JSON_HEADERS={"content-type":"application/json; charset=utf-8","cache-control":"no-store"};
const HTML_HEADERS={"content-type":"text/html; charset=utf-8"};
const PBKDF2_ITERATIONS=100000;
const SESSION_COOKIE='onlyevent_session';
const PROJECT_COOKIE='onlyevent_project';
const APP_VERSION='7.27.0';
const MAX_SITE_HTML_BYTES=25*1024*1024;
// D1 rows are capped at 2,000,000 bytes; leave room for the other columns.
const MAX_PROJECT_CONFIG_BYTES=1900000;
const CORS_ALLOW_HEADERS='content-type,authorization,x-onlyevent-project';
const CORS_ALLOW_METHODS='GET,POST,PUT,DELETE,OPTIONS';
const RESERVED_SUBDOMAINS=new Set(['www','publisher','api','admin','app']);

function corsOrigin(req,env){
  const origin=req.headers.get('origin')||'';if(!origin)return '';
  let u;try{u=new URL(origin)}catch{return ''}
  if((u.hostname==='localhost'||u.hostname==='127.0.0.1')&&(u.protocol==='http:'||u.protocol==='https:'))return origin;
  if(u.protocol!=='https:')return '';
  const base=baseDomain(env);if(u.hostname===base||u.hostname==='www.'+base)return origin;
  for(const raw of String(env.ALLOWED_ORIGINS||'').split(',')){
    const rule=raw.trim().toLowerCase();if(!rule)continue;
    if(rule.startsWith('https://*.')){if(u.hostname.endsWith(rule.slice('https://*'.length)))return origin}
    else if(rule===origin.toLowerCase())return origin;
  }
  return '';
}
function withCors(req,env,res){
  const origin=corsOrigin(req,env);if(!origin)return res;
  const h=new Headers(res.headers);h.set('access-control-allow-origin',origin);h.append('vary','Origin');
  return new Response(res.body,{status:res.status,statusText:res.statusText,headers:h});
}
function json(data,status=200,extra={}){return new Response(JSON.stringify(data),{status,headers:{...JSON_HEADERS,...extra}})}
function html(body,status=200,extra={}){return new Response(body,{status,headers:{...HTML_HEADERS,...extra}})}
function redirect(location,status=302,extra={}){return new Response(null,{status,headers:{location,...extra}})}
function now(){return new Date().toISOString()}
function id(prefix='id'){return `${prefix}_${crypto.randomUUID().replace(/-/g,'')}`}
function clone(v){return structuredClone(v)}
function bytesToB64(bytes){let s='';for(const b of bytes)s+=String.fromCharCode(b);return btoa(s)}
function b64ToBytes(s){const raw=atob(s);return Uint8Array.from(raw,c=>c.charCodeAt(0))}
function randomToken(n=32){const b=new Uint8Array(n);crypto.getRandomValues(b);return bytesToB64(b).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
async function sha256(text){const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return [...new Uint8Array(d)].map(b=>b.toString(16).padStart(2,'0')).join('')}
async function hashPassword(password,saltB64){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:b64ToBytes(saltB64),iterations:PBKDF2_ITERATIONS},key,256);return bytesToB64(new Uint8Array(bits))}
function newSalt(){const b=new Uint8Array(16);crypto.getRandomValues(b);return bytesToB64(b)}
// Recovery codes: 12 characters from an alphabet without 0/O/1/I, shown as XXXX-XXXX-XXXX (60 bits).
// Codes issued before this change (24 characters, case-sensitive) still verify as typed.
const RECOVERY_ALPHABET='23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
function newRecoveryCode(){const b=new Uint8Array(12);crypto.getRandomValues(b);return [...b].map(x=>RECOVERY_ALPHABET[x&31]).join('')}
function formatRecoveryCode(c){return c.replace(/(.{4})(?=.)/g,'$1-')}
function recoveryCandidates(input){const raw=String(input||'').trim(),canonical=raw.replace(/[\s-]+/g,'').toUpperCase();return canonical&&canonical!==raw?[raw,canonical]:[raw]}
function validUsername(v){return /^[\p{L}\p{N}_-](?:[\p{L}\p{N}_ -]{0,30}[\p{L}\p{N}_-])$/u.test(String(v||''))}
function cleanSlug(v){return String(v||'').trim().toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'').replace(/-+/g,'-').slice(0,50)}
function cleanText(v,n=200){return String(v??'').trim().slice(0,n)}
function sessionDays(env){const n=Number(env.SESSION_DAYS||30);return Number.isFinite(n)&&n>0?n:30}
function inactiveDays(env){const n=Number(env.INACTIVE_DAYS||60);return Number.isFinite(n)&&n>0?n:60}
function parseCookies(req){const out={};for(const part of String(req.headers.get('cookie')||'').split(';')){const i=part.indexOf('=');if(i<0)continue;const k=part.slice(0,i).trim(),v=part.slice(i+1).trim();if(k)out[k]=decodeURIComponent(v)}return out}
function cookie(name,value,{maxAge=null,httpOnly=true}={}){let s=`${name}=${encodeURIComponent(value)}; Path=/; Secure; SameSite=Lax`;if(httpOnly)s+='; HttpOnly';if(maxAge!==null)s+=`; Max-Age=${maxAge}`;return s}
function cookieHeaders(...items){const h=new Headers();for(const x of items.filter(Boolean))h.append('set-cookie',x);return h}
async function bodyJson(req){try{return await req.json()}catch{throw Object.assign(new Error('请求内容不是有效 JSON'),{status:400})}}
function baseDomain(env){return String(env.BASE_DOMAIN||'onlyevent.cn').trim().toLowerCase()}
function publicUrl(env,slug,req){const u=new URL(req.url),base=baseDomain(env);if(base&&!base.includes('example.com'))return `https://${slug}.${base}`;return `${u.origin}/s/${slug}`}
function getSlugFromHost(req,env){const host=new URL(req.url).hostname.toLowerCase(),base=baseDomain(env);if(!base||base.includes('example.com')||!host.endsWith('.'+base))return '';const sub=host.slice(0,-(base.length+1));if(!sub||sub.includes('.')||RESERVED_SUBDOMAINS.has(sub))return '';return cleanSlug(sub)}

function clientIp(req){return req.headers.get('cf-connecting-ip')||String(req.headers.get('x-forwarded-for')||'').split(',')[0].trim()||'unknown'}
// Fixed-window counters in D1: brute force and bulk abuse get a 429 before any expensive work.
async function rateLimit(env,key,max,windowSec){
  const t=Date.now(),row=await env.DB.prepare('SELECT window_start,count FROM rate_limits WHERE key=?').bind(key).first();
  if(!row||t-Date.parse(row.window_start)>=windowSec*1000){await env.DB.prepare('INSERT INTO rate_limits(key,window_start,count) VALUES(?,?,1) ON CONFLICT(key) DO UPDATE SET window_start=excluded.window_start,count=1').bind(key,new Date(t).toISOString()).run();return}
  if(row.count>=max){const minutes=Math.max(1,Math.ceil((Date.parse(row.window_start)+windowSec*1000-t)/60000));throw Object.assign(new Error('尝试次数过多，请 '+minutes+' 分钟后再试'),{status:429})}
  await env.DB.prepare('UPDATE rate_limits SET count=count+1 WHERE key=?').bind(key).run();
}
async function tokenFromReq(req){const h=req.headers.get('authorization')||'',m=h.match(/^Bearer\s+(.+)$/i);if(m)return m[1];return parseCookies(req)[SESSION_COOKIE]||''}
async function authUser(req,env){const token=await tokenFromReq(req);if(!token)return null;const th=await sha256(token);const row=await env.DB.prepare(`SELECT users.id,users.username,sessions.expires_at FROM sessions JOIN users ON users.id=sessions.user_id WHERE sessions.token_hash=? LIMIT 1`).bind(th).first();if(!row)return null;if(new Date(row.expires_at).getTime()<=Date.now()){await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(th).run();return null}return {id:row.id,username:row.username,tokenHash:th}}
async function requireUser(req,env){const u=await authUser(req,env);if(!u)throw Object.assign(new Error('请先登录'),{status:401});return u}
async function issueSession(env,userId,username,status=200,extra={}){const token=randomToken(36),tokenHash=await sha256(token),days=sessionDays(env),exp=new Date(Date.now()+days*86400000).toISOString();await env.DB.prepare('INSERT INTO sessions(token_hash,user_id,expires_at,created_at) VALUES(?,?,?,?)').bind(tokenHash,userId,exp,now()).run();return json({ok:true,token,user:{id:userId,username},username,expiresAt:exp,...extra},status,{'set-cookie':cookie(SESSION_COOKIE,token,{maxAge:days*86400})})}
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
async function logout(req,env){const token=await tokenFromReq(req);if(token)await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await sha256(token)).run();return json({ok:true},200,{'set-cookie':cookie(SESSION_COOKIE,'',{maxAge:0})})}

function currentProjectId(req){return cleanText(req.headers.get('x-onlyevent-project')||parseCookies(req)[PROJECT_COOKIE]||'',100)}
async function projectFor(req,env,u){const pid=currentProjectId(req);if(pid){const p=await env.DB.prepare('SELECT * FROM projects WHERE id=? AND user_id=?').bind(pid,u.id).first();if(p)return p}return await env.DB.prepare('SELECT * FROM projects WHERE user_id=? ORDER BY updated_at DESC LIMIT 1').bind(u.id).first()}
function projectCookie(pid){return cookie(PROJECT_COOKIE,pid,{maxAge:365*86400,httpOnly:true})}
function emptyProjectCookie(){return cookie(PROJECT_COOKIE,'',{maxAge:0,httpOnly:true})}
function seedProject(name,date,location,template='blank'){
  const c=clone(DEFAULT_CONFIG);
  const key=["ip-only","event-portal","doujin-creative","game-immersive","live-stage","theme-visual","portal-global","immersive","doujin-directory","editorial","live-lineup","live-timetable","poster","split-story","cn-portal","exhibitor-search","game-release","acg-visual","blank","comprehensive","doujin","live","small"].includes(template)?template:'blank';
  c.eventName=name||''; if(date)c.eventDate=date; if(location)c.eventLocation=location; c.visitorSiteUrl=''; c.eventTemplate=key;
  const presets={"ip-only":{"guests":true,"booths":true,"schedule":true,"guide":true,"faq":true,"sponsors":true},"event-portal":{"guests":true,"booths":true,"schedule":true,"guide":true,"faq":true,"sponsors":true},"doujin-creative":{"guests":false,"booths":true,"schedule":false,"guide":true,"faq":true,"sponsors":true},"game-immersive":{"guests":true,"booths":false,"schedule":true,"guide":true,"faq":true,"sponsors":true},"live-stage":{"guests":true,"booths":false,"schedule":true,"guide":true,"faq":true,"sponsors":true},"theme-visual":{"guests":false,"booths":false,"schedule":true,"guide":true,"faq":true,"sponsors":false},"portal-global":{"guests":true,"booths":true,"schedule":true,"guide":true,"faq":true,"sponsors":true},"immersive":{"guests":true,"booths":false,"schedule":true,"guide":true,"faq":true,"sponsors":false},"doujin-directory":{"guests":false,"booths":true,"schedule":false,"guide":true,"faq":true,"sponsors":false},"editorial":{"guests":true,"booths":true,"schedule":false,"guide":true,"faq":true,"sponsors":true},"live-lineup":{"guests":true,"booths":false,"schedule":true,"guide":true,"faq":true,"sponsors":true},"live-timetable":{"guests":true,"booths":false,"schedule":true,"guide":true,"faq":true,"sponsors":true},"poster":{"guests":false,"booths":false,"schedule":true,"guide":true,"faq":true,"sponsors":false},"split-story":{"guests":true,"booths":false,"schedule":true,"guide":true,"faq":true,"sponsors":false},"cn-portal":{"guests":true,"booths":true,"schedule":true,"guide":true,"faq":true,"sponsors":true},"exhibitor-search":{"guests":false,"booths":true,"schedule":false,"guide":true,"faq":true,"sponsors":true},"game-release":{"guests":true,"booths":false,"schedule":true,"guide":true,"faq":true,"sponsors":true},"acg-visual":{"guests":true,"booths":true,"schedule":true,"guide":true,"faq":true,"sponsors":true},"blank":{"guests":false,"booths":false,"schedule":false,"guide":false,"faq":false,"sponsors":false},"comprehensive":{"guests":true,"booths":true,"schedule":true,"guide":true,"faq":true,"sponsors":true},"doujin":{"guests":false,"booths":true,"schedule":false,"guide":true,"faq":true,"sponsors":false},"live":{"guests":true,"booths":false,"schedule":true,"guide":true,"faq":true,"sponsors":false},"small":{"guests":false,"booths":false,"schedule":true,"guide":true,"faq":true,"sponsors":false}};
  c.features=presets[key];
  return c;
}
function mediaKeysFromValue(value,out=new Set()){
  if(Array.isArray(value)){for(const v of value)mediaKeysFromValue(v,out);return out}
  if(value&&typeof value==='object'){for(const v of Object.values(value))mediaKeysFromValue(v,out);return out}
  if(typeof value==='string'){
    const re=/\/?media\/(uploads\/[a-zA-Z0-9_\/-]+\.[a-zA-Z0-9]+)/g;let m;
    while((m=re.exec(value)))out.add(m[1]);
  }
  return out;
}
async function ensureLegacyProjectSiteBinding(req,env,u,p){
  if(!p)return null;
  let row=await env.DB.prepare(`SELECT s.* FROM project_sites ps JOIN sites s ON s.id=ps.site_id WHERE ps.project_id=? AND ps.user_id=? LIMIT 1`).bind(p.id,u.id).first();
  if(row)return row;
  let cfg={};try{cfg=JSON.parse(p.config_json||'{}')}catch{}
  const url=String(cfg.visitorSiteUrl||'');let slug='';
  try{const parsed=new URL(url),host=parsed.hostname.toLowerCase(),base=baseDomain(env);if(host.endsWith('.'+base))slug=cleanSlug(host.slice(0,-(base.length+1)));else{const m=parsed.pathname.match(/^\/s\/([^/]+)/);if(m)slug=cleanSlug(m[1])}}catch{}
  if(!slug)return null;
  row=await env.DB.prepare(`SELECT s.* FROM sites s LEFT JOIN project_sites ps ON ps.site_id=s.id WHERE s.user_id=? AND s.slug=? COLLATE NOCASE AND ps.site_id IS NULL LIMIT 1`).bind(u.id,slug).first();
  if(!row)return null;
  const t=now();await env.DB.prepare(`INSERT INTO project_sites(project_id,site_id,user_id,created_at,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(project_id) DO NOTHING`).bind(p.id,row.id,u.id,t,t).run();
  return row;
}
async function currentProjectSite(req,env,u,p=null){p=p||await projectFor(req,env,u);if(!p)return null;return await ensureLegacyProjectSiteBinding(req,env,u,p)}
async function deleteSiteResources(env,site){
  if(!site)return;if(site.object_key)await env.SITES.delete(site.object_key);
  const {results=[]}=await env.DB.prepare('SELECT object_key FROM site_versions WHERE site_id=?').bind(site.id).all();for(const v of results)if(v.object_key)await env.SITES.delete(v.object_key);
}
async function deleteProjectMedia(env,userId,projectId,cfg){
  const keys=mediaKeysFromValue(cfg||{}),tracked=await env.DB.prepare('SELECT object_key FROM project_media WHERE project_id=?').bind(projectId).all();for(const r of tracked.results||[])keys.add(r.object_key);
  for(const key of keys){const ref=await env.DB.prepare('SELECT 1 AS x FROM project_media WHERE object_key=? AND project_id<>? LIMIT 1').bind(key,projectId).first();if(ref)continue;const other=await env.DB.prepare('SELECT 1 AS x FROM projects WHERE user_id=? AND id<>? AND config_json LIKE ? LIMIT 1').bind(userId,projectId,`%${key}%`).first();if(!other)await env.SITES.delete(key)}
}
async function ensureProjectState(env,projectId,userId){const t=now();await env.DB.prepare(`INSERT INTO project_state(project_id,user_id,created_at,updated_at) VALUES(?,?,?,?) ON CONFLICT(project_id) DO NOTHING`).bind(projectId,userId,t,t).run()}
async function listProjects(req,env){const u=await requireUser(req,env),active=currentProjectId(req),trash=new URL(req.url).searchParams.get('trash')==='1';const {results=[]}=await env.DB.prepare(`SELECT p.id,p.name,p.config_json,p.created_at,p.updated_at,ps.published_at,ps.deleted_at,s.status AS site_status,s.slug AS site_slug FROM projects p LEFT JOIN project_state ps ON ps.project_id=p.id LEFT JOIN project_sites m ON m.project_id=p.id LEFT JOIN sites s ON s.id=m.site_id WHERE p.user_id=? AND ${trash?'ps.deleted_at IS NOT NULL':'ps.deleted_at IS NULL'} ORDER BY ${trash?'ps.deleted_at':'p.updated_at'} DESC`).bind(u.id).all();return json({ok:true,projects:results.map(r=>{let c={};try{c=JSON.parse(r.config_json||'{}')}catch{}const publishedAt=r.published_at||null,hasChanges=!!publishedAt&&new Date(r.updated_at).getTime()>new Date(publishedAt).getTime();return {id:r.id,name:r.name,eventDate:c.eventDate||'',eventLocation:c.eventLocation||'',heroImage:c.heroImage||'',visitorSiteUrl:r.site_slug?publicUrl(env,r.site_slug,req):(c.visitorSiteUrl||''),eventTemplate:c.eventTemplate||'blank',templateId:typeof c.templateId==='string'?c.templateId:'',createdAt:r.created_at,updatedAt:r.updated_at,publishedAt,deletedAt:r.deleted_at||null,siteStatus:r.site_status||null,publishState:r.site_status==='inactive'?'inactive':!publishedAt?'draft':hasChanges?'changes':'published',active:r.id===active}})})}
async function createProject(req,env){const u=await requireUser(req,env);await rateLimit(env,'project:'+u.id,60,3600);const b=await bodyJson(req),name=cleanText(b.name,160);if(!name)return json({ok:false,error:'请填写活动名称'},400);const pid=id('prj'),created=now(),cfg=seedProject(name,cleanText(b.eventDate,120),cleanText(b.eventLocation,200),cleanText(b.template,40));await env.DB.batch([env.DB.prepare('INSERT INTO projects(id,user_id,name,config_json,created_at,updated_at) VALUES(?,?,?,?,?,?)').bind(pid,u.id,name,JSON.stringify(cfg),created,created),env.DB.prepare('INSERT INTO project_state(project_id,user_id,created_at,updated_at) VALUES(?,?,?,?)').bind(pid,u.id,created,created)]);return json({ok:true,project:{id:pid,name},config:cfg},201,{'set-cookie':projectCookie(pid)})}
async function duplicateProject(req,env,pid){const u=await requireUser(req,env),p=await env.DB.prepare('SELECT * FROM projects WHERE id=? AND user_id=?').bind(pid,u.id).first();if(!p)return json({ok:false,error:'活动项目不存在'},404);let cfg={};try{cfg=JSON.parse(p.config_json||'{}')}catch{cfg=seedProject(p.name)};cfg.visitorSiteUrl='';const newId=id('prj'),created=now(),name=cleanText((p.name||'活动')+' - 副本',160);cfg.eventName=name;await env.DB.batch([env.DB.prepare('INSERT INTO projects(id,user_id,name,config_json,created_at,updated_at) VALUES(?,?,?,?,?,?)').bind(newId,u.id,name,JSON.stringify(cfg),created,created),env.DB.prepare('INSERT INTO project_state(project_id,user_id,created_at,updated_at) VALUES(?,?,?,?)').bind(newId,u.id,created,created)]);for(const key of mediaKeysFromValue(cfg))await env.DB.prepare('INSERT OR IGNORE INTO project_media(project_id,object_key,created_at) VALUES(?,?,?)').bind(newId,key,created).run();return json({ok:true,project:{id:newId,name}},201)}
async function openProject(req,env,pid){const u=await requireUser(req,env),p=await env.DB.prepare(`SELECT p.id,p.name FROM projects p LEFT JOIN project_state ps ON ps.project_id=p.id WHERE p.id=? AND p.user_id=? AND ps.deleted_at IS NULL`).bind(pid,u.id).first();if(!p)return json({ok:false,error:'活动项目不存在'},404);return json({ok:true,project:p},200,{'set-cookie':projectCookie(pid)})}
async function deleteProject(req,env,pid){const u=await requireUser(req,env),p=await env.DB.prepare('SELECT id FROM projects WHERE id=? AND user_id=?').bind(pid,u.id).first();if(!p)return json({ok:false,error:'活动项目不存在'},404);await ensureProjectState(env,pid,u.id);await env.DB.prepare('UPDATE project_state SET deleted_at=?,updated_at=? WHERE project_id=? AND user_id=?').bind(now(),now(),pid,u.id).run();const extra=currentProjectId(req)===pid?{'set-cookie':emptyProjectCookie()}:{};return json({ok:true},200,extra)}
async function restoreProject(req,env,pid){const u=await requireUser(req,env);await env.DB.prepare('UPDATE project_state SET deleted_at=NULL,updated_at=? WHERE project_id=? AND user_id=?').bind(now(),pid,u.id).run();return json({ok:true})}
async function purgeProject(req,env,pid){const u=await requireUser(req,env);const p=await env.DB.prepare(`SELECT p.* FROM projects p JOIN project_state ps ON ps.project_id=p.id WHERE p.id=? AND p.user_id=? AND ps.deleted_at IS NOT NULL`).bind(pid,u.id).first();if(!p)return json({ok:false,error:'回收站中没有这个项目'},404);let cfg={};try{cfg=JSON.parse(p.config_json||'{}')}catch{}const site=await currentProjectSite(req,env,u,p);if(site){await deleteSiteResources(env,site);await env.DB.prepare('DELETE FROM sites WHERE id=? AND user_id=?').bind(site.id,u.id).run()}await deleteProjectMedia(env,u.id,pid,cfg);await env.DB.prepare('DELETE FROM projects WHERE id=? AND user_id=?').bind(pid,u.id).run();const extra=currentProjectId(req)===pid?{'set-cookie':emptyProjectCookie()}:{};return json({ok:true},200,extra)}
async function getConfig(req,env,publicMode=false){const u=await requireUser(req,env),p=await projectFor(req,env,u);if(!p)return json({ok:false,error:'请先创建一个活动'},404);await ensureProjectState(env,p.id,u.id);let cfg={};try{cfg=JSON.parse(p.config_json)}catch{cfg=seedProject(p.name)};const st=await env.DB.prepare('SELECT published_at,published_config_json,deleted_at FROM project_state WHERE project_id=? AND user_id=?').bind(p.id,u.id).first();return json({ok:true,config:cfg,session:{role:'organizer',username:u.username,boothId:null},project:{id:p.id,name:p.name,updatedAt:p.updated_at,publishedAt:st?.published_at||null,hasUnpublishedChanges:!!st?.published_at&&new Date(p.updated_at).getTime()>new Date(st.published_at).getTime()}})}
async function putConfig(req,env){const u=await requireUser(req,env),p=await projectFor(req,env,u);if(!p)return json({ok:false,error:'请先创建一个漫展'},404);const b=await bodyJson(req),cfg=b.config&&typeof b.config==='object'?b.config:null;if(!cfg)return json({ok:false,error:'配置内容无效'},400);const configJson=JSON.stringify(cfg);if(new TextEncoder().encode(configJson).byteLength>MAX_PROJECT_CONFIG_BYTES)return json({ok:false,error:'项目数据超过 1.9MB，请把图片上传到云端后再保存'},413);const name=cleanText(cfg.eventName||p.name,160)||p.name,updated=now();await env.DB.prepare('UPDATE projects SET name=?,config_json=?,updated_at=? WHERE id=? AND user_id=?').bind(name,JSON.stringify(cfg),updated,p.id,u.id).run();return json({ok:true,config:cfg})}
async function resetConfig(req,env){const u=await requireUser(req,env),p=await projectFor(req,env,u);if(!p)return json({ok:false,error:'请先创建一个漫展'},404);const cfg=seedProject(p.name,'','');await env.DB.prepare('UPDATE projects SET config_json=?,updated_at=? WHERE id=? AND user_id=?').bind(JSON.stringify(cfg),now(),p.id,u.id).run();return json({ok:true,config:cfg})}

function extFromType(type,name=''){const map={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'};if(map[type])return map[type];const m=String(name).toLowerCase().match(/\.([a-z0-9]{2,5})$/);return m?m[1]:''}
async function uploadImage(req,env){const u=await requireUser(req,env);await rateLimit(env,'upload:'+u.id,300,3600);const p=await projectFor(req,env,u);if(!p)return json({ok:false,error:'请先创建活动项目'},400);const form=await req.formData(),file=[...form.values()].find(v=>v instanceof File);if(!file)return json({ok:false,error:'没有收到图片文件'},400);if(file.size>12*1024*1024)return json({ok:false,error:'图片不能超过 12MB'},413);const ext=extFromType(file.type,file.name);if(!['jpg','jpeg','png','webp','gif'].includes(ext))return json({ok:false,error:'仅支持 JPG、PNG、WebP、GIF 图片'},415);const key=`uploads/${u.id}/${crypto.randomUUID()}.${ext}`;await env.SITES.put(key,await file.arrayBuffer(),{httpMetadata:{contentType:file.type||'application/octet-stream'},customMetadata:{owner:u.id,project:p.id}});await env.DB.prepare('INSERT OR IGNORE INTO project_media(project_id,object_key,created_at) VALUES(?,?,?)').bind(p.id,key,now()).run();return json({ok:true,url:`/media/${key}`},201)}
async function serveMedia(req,env,key){if(!/^uploads\/[a-zA-Z0-9_\/-]+\.[a-zA-Z0-9]+$/.test(key))return new Response('Not found',{status:404});const obj=await env.SITES.get(key);if(!obj)return new Response('Not found',{status:404});const h=new Headers();obj.writeHttpMetadata(h);h.set('cache-control','public,max-age=31536000,immutable');return new Response(obj.body,{headers:h})}

async function listSites(req,env){const u=await requireUser(req,env),p=await projectFor(req,env,u);if(!p)return json({ok:true,sites:[]});const site=await currentProjectSite(req,env,u,p);if(!site)return json({ok:true,sites:[]});return json({ok:true,sites:[{id:site.id,project_id:p.id,slug:site.slug,title:site.title,size_bytes:site.size_bytes,status:site.status,last_viewed_at:site.last_viewed_at,removed_at:site.removed_at,created_at:site.created_at,updated_at:site.updated_at,url:publicUrl(env,site.slug,req)}]})}
async function markCurrentProjectPublished(req,env,u,cfg){const p=await projectFor(req,env,u);if(!p)return;await ensureProjectState(env,p.id,u.id);const t=now();await env.DB.prepare('UPDATE project_state SET published_at=?,published_config_json=?,updated_at=? WHERE project_id=? AND user_id=?').bind(t,JSON.stringify(cfg||{}),t,p.id,u.id).run()}
async function createSite(req,env){const u=await requireUser(req,env);await rateLimit(env,'site:'+u.id,20,3600);const p=await projectFor(req,env,u);if(!p)return json({ok:false,error:'请先创建活动项目'},400);const existing=await currentProjectSite(req,env,u,p);if(existing)return json({ok:false,error:'当前活动已经有发布网站，请直接更新'},409);const b=await bodyJson(req),slug=cleanSlug(b.slug),title=cleanText(b.title,200),siteHtml=String(b.html||'');if(!slug||slug.length<3)return json({ok:false,error:'网址名称至少 3 个字符'},400);if(!siteHtml.trim())return json({ok:false,error:'网站 HTML 不能为空'},400);if(new TextEncoder().encode(siteHtml).byteLength>MAX_SITE_HTML_BYTES)return json({ok:false,error:'网站文件超过 25MB，请压缩图片后再发布'},413);if(await env.DB.prepare('SELECT id FROM sites WHERE slug=? COLLATE NOCASE').bind(slug).first())return json({ok:false,error:'这个网址已经被使用'},409);if(await env.DB.prepare('SELECT old_slug FROM site_aliases WHERE old_slug=? COLLATE NOCASE').bind(slug).first())return json({ok:false,error:'这个网址曾被使用，请换一个网址名称'},409);const siteId=id('site'),key=`sites/${siteId}/site.html`,created=now();await env.SITES.put(key,siteHtml,{httpMetadata:{contentType:'text/html; charset=utf-8'},customMetadata:{owner:u.id,slug,project:p.id}});await env.DB.batch([env.DB.prepare(`INSERT INTO sites(id,user_id,slug,title,object_key,size_bytes,status,last_viewed_at,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)`).bind(siteId,u.id,slug,title,key,new TextEncoder().encode(siteHtml).byteLength,'active',created,created,created),env.DB.prepare('INSERT INTO project_sites(project_id,site_id,user_id,created_at,updated_at) VALUES(?,?,?,?,?)').bind(p.id,siteId,u.id,created,created)]);const url=publicUrl(env,slug,req);let cfg={};try{cfg=JSON.parse(p.config_json||'{}')}catch{}cfg.visitorSiteUrl=url;await env.DB.prepare('UPDATE projects SET config_json=?,updated_at=? WHERE id=? AND user_id=?').bind(JSON.stringify(cfg),created,p.id,u.id).run();await markCurrentProjectPublished(req,env,u,cfg);return json({ok:true,site:{id:siteId,project_id:p.id,slug,title,status:'active',last_viewed_at:created,url,created_at:created,updated_at:created}},201)}
async function archiveCurrentSiteVersion(env,site){const obj=await env.SITES.get(site.object_key);if(!obj)return;const verId=id('ver'),key=`versions/${site.id}/${Date.now()}.html`,body=await obj.arrayBuffer();await env.SITES.put(key,body,{httpMetadata:{contentType:'text/html; charset=utf-8'}});await env.DB.prepare('INSERT INTO site_versions(id,site_id,object_key,size_bytes,created_at) VALUES(?,?,?,?,?)').bind(verId,site.id,key,body.byteLength,now()).run();const {results=[]}=await env.DB.prepare('SELECT id,object_key FROM site_versions WHERE site_id=? ORDER BY created_at DESC').bind(site.id).all();for(const old of results.slice(5)){await env.SITES.delete(old.object_key);await env.DB.prepare('DELETE FROM site_versions WHERE id=?').bind(old.id).run()}}
async function updateSite(req,env,siteId){const u=await requireUser(req,env);await rateLimit(env,'site-update:'+u.id,120,3600);const p=await projectFor(req,env,u);if(!p)return json({ok:false,error:'请先创建活动项目'},400);const site=await currentProjectSite(req,env,u,p);if(!site||site.id!==siteId)return json({ok:false,error:'这个网站不属于当前活动项目'},403);const b=await bodyJson(req),slug=b.slug===undefined?site.slug:cleanSlug(b.slug);if(!slug||slug.length<3)return json({ok:false,error:'网址名称至少 3 个字符'},400);if(slug!==site.slug){if(await env.DB.prepare('SELECT id FROM sites WHERE slug=? COLLATE NOCASE AND id<>?').bind(slug,siteId).first())return json({ok:false,error:'这个网址已经被使用'},409);if(await env.DB.prepare('SELECT site_id FROM site_aliases WHERE old_slug=? COLLATE NOCASE AND site_id<>?').bind(slug,siteId).first())return json({ok:false,error:'这个网址曾被其他网站使用'},409)}const title=b.title===undefined?site.title:cleanText(b.title,200);let size=site.size_bytes;if(b.html!==undefined){const siteHtml=String(b.html||'');if(!siteHtml.trim())return json({ok:false,error:'网站 HTML 不能为空'},400);if(new TextEncoder().encode(siteHtml).byteLength>MAX_SITE_HTML_BYTES)return json({ok:false,error:'网站文件超过 25MB，请压缩图片后再发布'},413);await archiveCurrentSiteVersion(env,site);await env.SITES.put(site.object_key,siteHtml,{httpMetadata:{contentType:'text/html; charset=utf-8'},customMetadata:{owner:u.id,slug,project:p.id}});size=new TextEncoder().encode(siteHtml).byteLength}if(slug!==site.slug)await env.DB.prepare(`INSERT INTO site_aliases(old_slug,site_id,created_at) VALUES(?,?,?) ON CONFLICT(old_slug) DO UPDATE SET site_id=excluded.site_id,created_at=excluded.created_at`).bind(site.slug,siteId,now()).run();const updated=now();await env.DB.batch([env.DB.prepare(`UPDATE sites SET slug=?,title=?,size_bytes=?,status='active',removed_at=NULL,last_viewed_at=?,updated_at=? WHERE id=? AND user_id=?`).bind(slug,title,size,updated,updated,siteId,u.id),env.DB.prepare('UPDATE project_sites SET updated_at=? WHERE project_id=? AND site_id=?').bind(updated,p.id,siteId)]);const url=publicUrl(env,slug,req);let cfg={};try{cfg=JSON.parse(p.config_json||'{}')}catch{}cfg.visitorSiteUrl=url;await env.DB.prepare('UPDATE projects SET config_json=?,updated_at=? WHERE id=? AND user_id=?').bind(JSON.stringify(cfg),updated,p.id,u.id).run();await markCurrentProjectPublished(req,env,u,cfg);return json({ok:true,site:{id:siteId,project_id:p.id,slug,title,size_bytes:size,status:'active',last_viewed_at:updated,url,updated_at:updated}})}
async function listSiteVersions(req,env,siteId){const u=await requireUser(req,env),p=await projectFor(req,env,u),site=p?await currentProjectSite(req,env,u,p):null;if(!site||site.id!==siteId)return json({ok:false,error:'这个网站不属于当前活动项目'},404);const {results=[]}=await env.DB.prepare('SELECT id,size_bytes,created_at FROM site_versions WHERE site_id=? ORDER BY created_at DESC LIMIT 5').bind(siteId).all();return json({ok:true,versions:results})}
async function rollbackSite(req,env,siteId,versionId){const u=await requireUser(req,env),p=await projectFor(req,env,u),site=p?await currentProjectSite(req,env,u,p):null;if(!site||site.id!==siteId)return json({ok:false,error:'这个网站不属于当前活动项目'},404);const ver=await env.DB.prepare('SELECT * FROM site_versions WHERE id=? AND site_id=?').bind(versionId,siteId).first();if(!ver)return json({ok:false,error:'历史版本不存在'},404);const obj=await env.SITES.get(ver.object_key);if(!obj)return json({ok:false,error:'历史版本文件不存在'},404);await archiveCurrentSiteVersion(env,site);const body=await obj.arrayBuffer();await env.SITES.put(site.object_key,body,{httpMetadata:{contentType:'text/html; charset=utf-8'},customMetadata:{owner:u.id,slug:site.slug,project:p.id}});const t=now(),draftTime=new Date(Date.now()+1000).toISOString();await env.DB.batch([env.DB.prepare(`UPDATE sites SET size_bytes=?,status='active',removed_at=NULL,last_viewed_at=?,updated_at=? WHERE id=?`).bind(body.byteLength,t,t,siteId),env.DB.prepare('UPDATE project_state SET published_at=?,published_config_json=NULL,updated_at=? WHERE project_id=? AND user_id=?').bind(t,t,p.id,u.id),env.DB.prepare('UPDATE projects SET updated_at=? WHERE id=? AND user_id=?').bind(draftTime,p.id,u.id)]);return json({ok:true,site:{...site,status:'active',updated_at:t,url:publicUrl(env,site.slug,req)},onlineRollback:true})}
async function deleteSite(req,env,siteId){const u=await requireUser(req,env),p=await projectFor(req,env,u),site=p?await currentProjectSite(req,env,u,p):null;if(!site||site.id!==siteId)return json({ok:false,error:'这个网站不属于当前活动项目'},404);await deleteSiteResources(env,site);await env.DB.prepare('DELETE FROM sites WHERE id=? AND user_id=?').bind(siteId,u.id).run();let cfg={};try{cfg=JSON.parse(p.config_json||'{}')}catch{}cfg.visitorSiteUrl='';const t=now();await env.DB.batch([env.DB.prepare('UPDATE projects SET config_json=?,updated_at=? WHERE id=? AND user_id=?').bind(JSON.stringify(cfg),t,p.id,u.id),env.DB.prepare('UPDATE project_state SET published_at=NULL,published_config_json=NULL,updated_at=? WHERE project_id=? AND user_id=?').bind(t,p.id,u.id)]);return json({ok:true})}
async function serveSlug(req,env,slug){slug=cleanSlug(slug);if(!slug)return html('网站不存在',404);let site=await env.DB.prepare('SELECT id,slug,object_key,title,status FROM sites WHERE slug=? COLLATE NOCASE').bind(slug).first();if(!site){const alias=await env.DB.prepare('SELECT s.id,s.slug,s.object_key,s.title,s.status FROM site_aliases a JOIN sites s ON s.id=a.site_id WHERE a.old_slug=? COLLATE NOCASE').bind(slug).first();if(alias)return redirect(publicUrl(env,alias.slug,req),301,{'cache-control':'public,max-age=3600'});return html('<!doctype html><meta charset=utf-8><title>网站不存在</title><style>body{font-family:system-ui;padding:40px}</style><h1>网站不存在</h1><p>这个活动网站还没有发布。</p>',404)}if(site.status==='inactive')return html('<!doctype html><meta charset=utf-8><title>网站暂时下线</title><style>body{font-family:system-ui;padding:40px;max-width:720px;margin:auto}</style><h1>网站暂时下线</h1><p>该网站长时间没有访问，公开版本已自动休眠。主办方重新发布即可恢复，编辑数据不会删除。</p>',410,{'cache-control':'no-store'});const obj=await env.SITES.get(site.object_key);if(!obj)return html('网站文件不存在',404);await env.DB.prepare('UPDATE sites SET last_viewed_at=? WHERE id=?').bind(now(),site.id).run();try{await countView(env,req,site.id)}catch(e){console.error(e)}const h=new Headers(HTML_HEADERS);h.set('cache-control','public,max-age=60');h.set('x-onlyevent-site',slug);h.set('x-content-type-options','nosniff');h.set('referrer-policy','strict-origin-when-cross-origin');return new Response(obj.body,{headers:h})}
async function cleanupInactiveSites(env){const cutoff=new Date(Date.now()-inactiveDays(env)*86400000).toISOString(),{results=[]}=await env.DB.prepare(`SELECT id,object_key FROM sites WHERE status='active' AND COALESCE(last_viewed_at,updated_at,created_at) < ?`).bind(cutoff).all();for(const s of results){await env.SITES.delete(s.object_key);await env.DB.prepare(`UPDATE sites SET status='inactive',removed_at=?,updated_at=? WHERE id=?`).bind(now(),now(),s.id).run()}await env.DB.prepare('DELETE FROM sessions WHERE expires_at < ?').bind(now()).run();await env.DB.prepare('DELETE FROM rate_limits WHERE window_start < ?').bind(new Date(Date.now()-86400000).toISOString()).run();return results.length}

async function accountStatus(req,env){const u=await authUser(req,env);const row=await env.DB.prepare('SELECT COUNT(*) AS n FROM users').first();return json({ok:true,initialized:Number(row?.n||0)>0,authenticated:!!u,username:u?.username||null})}
async function sessionInfo(req,env){const u=await authUser(req,env);return json(u?{authenticated:true,role:'organizer',username:u.username,boothId:null}:{authenticated:false})}
async function systemLinks(req,env){const u=await requireUser(req,env),p=await projectFor(req,env,u),site=p?await currentProjectSite(req,env,u,p):null;let cfg={};try{cfg=JSON.parse(p?.config_json||'{}')}catch{}const visitor=site?publicUrl(env,site.slug,req):(cfg.visitorSiteUrl||new URL(req.url).origin+'/');return json({ok:true,visitor,autoVisitor:visitor,scope:'public',publicUrl:visitor,customVisitor:!!site})}

/* ---- circle collection: public form for circle leaders, review queue for the organizer ---- */
const COLLECT_MAX_ENTRIES=300,COLLECT_MAX_PRODUCTS=8;
function collectText(v,max){return String(v==null?'':v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').trim().slice(0,max)}
async function ownedProject(req,env,pid){const u=await requireUser(req,env),p=await env.DB.prepare('SELECT p.id,p.name FROM projects p LEFT JOIN project_state s ON s.project_id=p.id WHERE p.id=? AND p.user_id=? AND s.deleted_at IS NULL').bind(pid,u.id).first();if(!p)throw Object.assign(new Error('活动不存在'),{status:404});return p}
function collectView(row){return row?{token:row.token,open:!!row.open}:null}
async function collectOverview(req,env,pid){
  await ownedProject(req,env,pid);
  const form=await env.DB.prepare('SELECT token,open FROM collect_forms WHERE project_id=?').bind(pid).first();
  const {results=[]}=await env.DB.prepare('SELECT id,data_json,status,created_at FROM collect_entries WHERE project_id=? ORDER BY created_at DESC LIMIT 500').bind(pid).all();
  const entries=results.map(r=>{let data={};try{data=JSON.parse(r.data_json)}catch{}return {id:r.id,status:r.status,createdAt:r.created_at,data}});
  return json({ok:true,form:collectView(form),entries});
}
async function collectManage(req,env,pid){
  await ownedProject(req,env,pid);
  const action=String((await bodyJson(req)).action||''),cur=await env.DB.prepare('SELECT token,open FROM collect_forms WHERE project_id=?').bind(pid).first();
  const newToken=()=>crypto.randomUUID().replace(/-/g,'').slice(0,20);
  if(action==='enable'||action==='reset'){
    if(!cur)await env.DB.prepare('INSERT INTO collect_forms(project_id,token,open,created_at) VALUES(?,?,1,?)').bind(pid,newToken(),now()).run();
    else if(action==='reset')await env.DB.prepare('UPDATE collect_forms SET token=?,open=1 WHERE project_id=?').bind(newToken(),pid).run();
  }else if(action==='close'||action==='open'){
    if(!cur)return json({ok:false,error:'还没有开启收集'},400);
    await env.DB.prepare('UPDATE collect_forms SET open=? WHERE project_id=?').bind(action==='open'?1:0,pid).run();
  }else return json({ok:false,error:'不支持的操作'},400);
  return json({ok:true,form:collectView(await env.DB.prepare('SELECT token,open FROM collect_forms WHERE project_id=?').bind(pid).first())});
}
async function collectEntryUpdate(req,env,pid,eid){
  await ownedProject(req,env,pid);
  if(req.method==='DELETE'){await env.DB.prepare('DELETE FROM collect_entries WHERE id=? AND project_id=?').bind(eid,pid).run();return json({ok:true})}
  const status=String((await bodyJson(req)).status||'');
  if(!['pending','approved','rejected'].includes(status))return json({ok:false,error:'状态不正确'},400);
  if(!await env.DB.prepare('SELECT 1 AS x FROM collect_entries WHERE id=? AND project_id=?').bind(eid,pid).first())return json({ok:false,error:'没有找到这条提交'},404);
  await env.DB.prepare('UPDATE collect_entries SET status=? WHERE id=? AND project_id=?').bind(status,eid,pid).run();
  return json({ok:true});
}
async function collectFormByToken(env,token){
  if(!/^[a-f0-9]{20}$/.test(token))return null;
  return env.DB.prepare('SELECT f.project_id,f.open,p.name FROM collect_forms f JOIN projects p ON p.id=f.project_id LEFT JOIN project_state s ON s.project_id=p.id WHERE f.token=? AND s.deleted_at IS NULL').bind(token).first();
}
async function collectInfo(req,env,token){
  const f=await collectFormByToken(env,token);if(!f)return json({ok:false,error:'这个收集链接无效或已失效'},404);
  return json({ok:true,open:!!f.open,eventName:f.name});
}
async function collectImage(req,env,token){
  const f=await collectFormByToken(env,token);if(!f||!f.open)return json({ok:false,error:'这个收集链接已关闭'},404);
  await rateLimit(env,'collect-img:'+clientIp(req),100,3600);await rateLimit(env,'collect-img-form:'+f.project_id,600,86400);
  const form=await req.formData(),file=[...form.values()].find(v=>v instanceof File);
  if(!file)return json({ok:false,error:'没有收到图片文件'},400);
  if(file.size>5*1024*1024)return json({ok:false,error:'图片不能超过 5MB'},413);
  const ext=extFromType(file.type,file.name);if(!['jpg','jpeg','png','webp','gif'].includes(ext))return json({ok:false,error:'仅支持 JPG、PNG、WebP、GIF 图片'},415);
  const key='uploads/collect/'+f.project_id+'/'+crypto.randomUUID()+'.'+ext;
  await env.SITES.put(key,await file.arrayBuffer(),{httpMetadata:{contentType:file.type||'application/octet-stream'},customMetadata:{project:f.project_id,source:'collect'}});
  await env.DB.prepare('INSERT OR IGNORE INTO project_media(project_id,object_key,created_at) VALUES(?,?,?)').bind(f.project_id,key,now()).run();
  return json({ok:true,url:'/media/'+key},201);
}
async function collectSubmit(req,env,token){
  const f=await collectFormByToken(env,token);if(!f)return json({ok:false,error:'这个收集链接无效或已失效'},404);
  if(!f.open)return json({ok:false,error:'主办方已经关闭了这次收集'},403);
  await rateLimit(env,'collect-sub:'+clientIp(req),10,3600);
  const b=await bodyJson(req),mediaPrefix='/media/uploads/collect/'+f.project_id+'/';
  const img=v=>{v=String(v||'');return v.startsWith(mediaPrefix)&&/^[a-zA-Z0-9_\/.-]+$/.test(v)?v:''};
  const data={name:collectText(b.name,40),type:collectText(b.type,40),intro:collectText(b.intro,200),contact:collectText(b.contact,80),logo:img(b.logo),products:[]};
  if(!data.name)return json({ok:false,error:'请填写社团名称'},400);
  if(!data.contact)return json({ok:false,error:'请留一个联系方式，方便主办方联系你'},400);
  for(const p of (Array.isArray(b.products)?b.products:[]).slice(0,COLLECT_MAX_PRODUCTS)){
    const name=collectText(p?.name,40);if(!name)continue;
    data.products.push({name,price:collectText(p.price,20),note:collectText(p.note,60),image:img(p.image)});
  }
  const count=await env.DB.prepare('SELECT COUNT(*) AS n FROM collect_entries WHERE project_id=?').bind(f.project_id).first();
  if(Number(count?.n||0)>=COLLECT_MAX_ENTRIES)return json({ok:false,error:'提交数量已达上限，请联系主办方'},429);
  await env.DB.prepare('INSERT INTO collect_entries(id,project_id,data_json,status,created_at) VALUES(?,?,?,?,?)').bind(id('ce'),f.project_id,JSON.stringify(data),'pending',now()).run();
  return json({ok:true},201);
}

/* ---- visit statistics: a daily counter per site, nothing about the visitor is kept ---- */
const BOT_UA=/bot|spider|crawl|slurp|preview|monitor|uptime|curl|wget|python|httpclient|headless|facebookexternalhit|lighthouse/i;
const chinaDay=(t=Date.now())=>new Date(t+8*3600*1000).toISOString().slice(0,10);
async function countView(env,req,siteId){
  if(req.method!=='GET')return;
  const ua=req.headers.get('user-agent')||'';if(!ua||BOT_UA.test(ua))return;
  await env.DB.prepare('INSERT INTO site_stats(site_id,day,views) VALUES(?,?,1) ON CONFLICT(site_id,day) DO UPDATE SET views=views+1').bind(siteId,chinaDay()).run();
}
async function projectStats(req,env,pid){
  const p=await ownedProject(req,env,pid);
  const link=await env.DB.prepare('SELECT s.id,s.slug FROM project_sites ps JOIN sites s ON s.id=ps.site_id WHERE ps.project_id=?').bind(pid).first();
  const days=[];for(let i=29;i>=0;i--)days.push({day:chinaDay(Date.now()-i*86400000),views:0});
  if(!link)return json({ok:true,published:false,name:p.name,days,today:0,last7:0,last30:0,total:0});
  const {results=[]}=await env.DB.prepare('SELECT day,views FROM site_stats WHERE site_id=? AND day>=?').bind(link.id,days[0].day).all();
  const byDay=new Map(results.map(r=>[r.day,Number(r.views)||0]));for(const d of days)d.views=byDay.get(d.day)||0;
  const total=await env.DB.prepare('SELECT COALESCE(SUM(views),0) AS n FROM site_stats WHERE site_id=?').bind(link.id).first();
  const sum=list=>list.reduce((n,d)=>n+d.views,0);
  return json({ok:true,published:true,name:p.name,slug:link.slug,days,today:days[days.length-1].views,last7:sum(days.slice(-7)),last30:sum(days),total:Number(total?.n)||0});
}

async function handleApi(req,env,path){
  if(path==='/api/health'&&req.method==='GET')return json({ok:true,version:APP_VERSION,app:'onlyevent',baseDomain:baseDomain(env)});
  if(path==='/api/account/status'&&req.method==='GET')return accountStatus(req,env);
  if((path==='/api/account/register'||path==='/api/auth/register')&&req.method==='POST')return register(req,env);
  if((path==='/api/account/login'||path==='/api/auth/login')&&req.method==='POST')return login(req,env);
  if(path==='/api/account/recover'&&req.method==='POST')return recoverAccount(req,env);
  if(path==='/api/account/recovery-code'&&req.method==='POST')return rotateRecoveryCode(req,env);
  if(path==='/api/account/password'&&req.method==='POST')return changePassword(req,env);
  if((path==='/api/logout'||path==='/api/auth/logout')&&req.method==='POST')return logout(req,env);
  if(path==='/api/me'&&req.method==='GET'){const u=await requireUser(req,env);return json({ok:true,user:{id:u.id,username:u.username}})}
  if(path==='/api/session'&&req.method==='GET')return sessionInfo(req,env);
  if(path==='/api/projects'&&req.method==='GET')return listProjects(req,env);
  if(path==='/api/projects'&&req.method==='POST')return createProject(req,env);
  if(path==='/api/projects/trash'&&req.method==='GET')return listProjects(req,env);
  let m=path.match(/^\/api\/projects\/([^/]+)\/stats$/);
  if(m&&req.method==='GET')return projectStats(req,env,decodeURIComponent(m[1]));
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
  m=path.match(/^\/api\/projects\/([^/]+)$/);if(m&&req.method==='DELETE')return deleteProject(req,env,decodeURIComponent(m[1]));
  if(path==='/api/config'&&req.method==='GET')return getConfig(req,env);
  if(path==='/api/config'&&req.method==='PUT')return putConfig(req,env);
  if(path==='/api/public/config'&&req.method==='GET')return getConfig(req,env,true);
  if(path==='/api/reset'&&req.method==='POST')return resetConfig(req,env);
  if(path==='/api/upload'&&req.method==='POST')return uploadImage(req,env);
  if(path==='/api/system/links'&&req.method==='GET')return systemLinks(req,env);
  if(path==='/api/sites'&&req.method==='GET')return listSites(req,env);
  if(path==='/api/sites'&&req.method==='POST')return createSite(req,env);
  m=path.match(/^\/api\/sites\/([^/]+)\/versions$/);if(m&&req.method==='GET')return listSiteVersions(req,env,decodeURIComponent(m[1]));
  m=path.match(/^\/api\/sites\/([^/]+)\/rollback\/([^/]+)$/);if(m&&req.method==='POST')return rollbackSite(req,env,decodeURIComponent(m[1]),decodeURIComponent(m[2]));
  m=path.match(/^\/api\/sites\/([^/]+)$/);if(m&&req.method==='PUT')return updateSite(req,env,decodeURIComponent(m[1]));if(m&&req.method==='DELETE')return deleteSite(req,env,decodeURIComponent(m[1]));
  return json({ok:false,error:'API 不存在'},404);
}

export default {
  async scheduled(event,env,ctx){ctx.waitUntil(cleanupInactiveSites(env));},
  async fetch(req,env){
    try{
      const url=new URL(req.url),path=url.pathname;
      if(req.method==='OPTIONS'){const origin=corsOrigin(req,env);return new Response(null,{status:204,headers:origin?{'access-control-allow-origin':origin,'access-control-allow-methods':CORS_ALLOW_METHODS,'access-control-allow-headers':CORS_ALLOW_HEADERS,'access-control-max-age':'86400','vary':'Origin'}:{}})}
      if(path==='/health')return json({ok:true,time:now(),mode:'online-saas',version:APP_VERSION,baseDomain:baseDomain(env),host:url.hostname});
      if(path.startsWith('/media/'))return await serveMedia(req,env,decodeURIComponent(path.slice('/media/'.length)));
      if(path.startsWith('/api/'))return withCors(req,env,await handleApi(req,env,path));
      const hostSlug=getSlugFromHost(req,env);
      if(hostSlug&&path==='/robots.txt')return new Response('User-agent: *\nAllow: /\n',{headers:{'content-type':'text/plain; charset=utf-8','cache-control':'public,max-age=3600'}});
      if(hostSlug&&path==='/favicon.ico')return new Response(null,{status:204,headers:{'cache-control':'public,max-age=86400'}});
      if(hostSlug)return await serveSlug(req,env,hostSlug);
      const sp=path.match(/^\/s\/([a-zA-Z0-9_-]+)\/?$/);if(sp&&req.method==='GET')return await serveSlug(req,env,sp[1]);
      if(path==='/')return redirect('/admin/');
      if(path==='/admin')return redirect('/admin/');
      const assetResponse=await env.ASSETS.fetch(req);
      if(path.startsWith('/v8/')||path==='/robots.txt'){
        // The editor loads same-origin module graphs: keep them revalidated and un-framable from other sites.
        const headers=new Headers(assetResponse.headers);
        headers.set('x-content-type-options','nosniff');headers.set('referrer-policy','strict-origin-when-cross-origin');headers.set('x-frame-options','SAMEORIGIN');
        return new Response(assetResponse.body,{status:assetResponse.status,statusText:assetResponse.statusText,headers});
      }
      if(path.startsWith('/collect/')){
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
    }catch(e){if(!e?.status)console.error(e);return withCors(req,env,json({ok:false,error:e?.status?e.message:'服务器错误'},e?.status||500))}
  }
};
