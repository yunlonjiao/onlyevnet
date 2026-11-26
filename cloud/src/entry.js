import { ApiError, errorPayload } from './core/errors.js';
import { CORS_ALLOW_HEADERS, CORS_ALLOW_METHODS, CONTENT_SECURITY_POLICY, baseDomain, allowedOrigin, corsOrigin, withCors, json, redirect } from './core/http.js';
import { now } from './core/ids.js';
import { APP_VERSION } from './core/version.js';
import { serveMedia } from './media/upload.js';
import { serveSlug } from './sites/serve.js';
import { VISITOR_SW, VISITOR_SW_HEADERS } from './visitor-sw.js';
import { getSlugFromHost } from './sites/host.js';
import { handleApi } from './routes/api.js';
import { cleanupInactiveSites } from './cleanup.js';

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
