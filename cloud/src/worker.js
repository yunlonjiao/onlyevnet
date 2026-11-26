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
import { accountStatus, sessionInfo } from './auth/status.js';
import { listProjects } from './projects/list.js';
import { listSites, systemLinks } from './sites/list.js';
import { handleApi } from './routes/api.js';
import { APP_VERSION } from './core/version.js';
import { register, login, recoverAccount, rotateRecoveryCode, changePassword, deleteAccount } from './auth/account.js';
import { serveSlug } from './sites/serve.js';
import { getConfig, putConfig, resetConfig } from './projects/config.js';

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
