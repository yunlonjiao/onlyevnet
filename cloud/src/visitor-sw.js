export const VISITOR_SW=`const CACHE='oe-visitor-v2',HOME='/',MAX_IMAGES=200;
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
      try{
        const res=await fetch(req);
        if(res.ok&&res.type!=='opaque')cache.put(req,res.clone()).then(()=>trim(cache));
        return res;
      }catch{
        return (await cache.match(req))||Response.error();
      }
    }));
  }
});
`;
export const VISITOR_SW_HEADERS={'content-type':'application/javascript; charset=utf-8','cache-control':'no-cache','service-worker-allowed':'/','x-content-type-options':'nosniff'};
