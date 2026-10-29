/* Behavioural test of the publisher Worker: real SQL (node:sqlite standing in for D1),
   an in-memory R2 bucket, and the exact request shapes /v8/publisher.js sends. */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';
import {createEnv} from './fake-env.mjs';

const API='https://convention-publisher.onlyevents.workers.dev';
const PAGES='https://onlyevent-preview.pages.dev';
async function call(env,path,{method='GET',body,token,project,origin=PAGES,host}={}){
  const headers={origin};
  if(body!==undefined)headers['content-type']='application/json';
  if(token)headers.authorization='Bearer '+token;
  if(project)headers['x-onlyevent-project']=project;
  const res=await worker.fetch(new Request((host?'https://'+host:API)+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)}),env);
  const text=await res.text();let data;try{data=JSON.parse(text)}catch{data=text}
  return {status:res.status,headers:res.headers,data};
}
async function signUp(env,username='星尘ONLY执行委员会',password='secret-123'){
  const r=await call(env,'/api/account/register',{method:'POST',body:{username,password}});
  assert.equal(r.status,201,JSON.stringify(r.data));
  return r.data;
}
async function newProject(env,token,name='STARDUST ONLY'){
  const r=await call(env,'/api/projects',{method:'POST',token,body:{name,template:'blank'}});
  assert.equal(r.status,201);
  return r.data.project.id;
}

test('CORS preflight allows the Pages CMS and rejects unknown origins',async()=>{
  const env=createEnv();
  for(const origin of [PAGES,'https://fix-branch.onlyevent-preview.pages.dev','https://onlyevent.cn','http://127.0.0.1:4173']){
    const r=await call(env,'/api/sites',{method:'OPTIONS',origin});
    assert.equal(r.status,204);
    assert.equal(r.headers.get('access-control-allow-origin'),origin);
    assert.match(r.headers.get('access-control-allow-headers'),/x-onlyevent-project/);
  }
  const evil=await call(env,'/api/sites',{method:'OPTIONS',origin:'https://evil.example'});
  assert.equal(evil.headers.get('access-control-allow-origin'),null);
});

test('unauthenticated publish returns JSON 401 with CORS instead of error 1101',async()=>{
  const r=await call(createEnv(),'/api/sites',{method:'POST',body:{}});
  assert.equal(r.status,401);
  assert.equal(r.data.error,'请先登录');
  assert.equal(r.headers.get('access-control-allow-origin'),PAGES);
});

test('organizer can register, publish, update and take down a visitor site',async()=>{
  const env=createEnv();
  const {token,recoveryCode,user}=await signUp(env);
  assert.ok(token&&recoveryCode);
  assert.equal(user.username,'星尘ONLY执行委员会');
  const projectId=await newProject(env,token);

  const created=await call(env,'/api/sites',{method:'POST',token,project:projectId,body:{html:'<!doctype html><h1>v1</h1>',title:'STARDUST ONLY',slug:'stardust-only',templateId:'03-creator-market'}});
  assert.equal(created.status,201,JSON.stringify(created.data));
  const site=created.data.site;
  assert.equal(site.slug,'stardust-only');
  assert.equal(site.url,'https://stardust-only.onlyevent.cn');

  let visit=await call(env,'/',{host:'stardust-only.onlyevent.cn'});
  assert.equal(visit.status,200);assert.match(visit.data,/v1/);

  const dup=await call(env,'/api/sites',{method:'POST',token,project:projectId,body:{html:'<p>x</p>',slug:'other-slug'}});
  assert.equal(dup.status,409);

  const updated=await call(env,'/api/sites/'+site.id,{method:'PUT',token,project:projectId,body:{html:'<!doctype html><h1>v2</h1>',title:'STARDUST ONLY',slug:'stardust-only'}});
  assert.equal(updated.status,200);
  visit=await call(env,'/s/stardust-only');
  assert.match(visit.data,/v2/);

  const removed=await call(env,'/api/sites/'+site.id,{method:'DELETE',token,project:projectId});
  assert.equal(removed.status,200);
  visit=await call(env,'/',{host:'stardust-only.onlyevent.cn'});
  assert.equal(visit.status,404);
  assert.equal([...env.SITES.objects.keys()].filter(k=>k.startsWith('sites/')).length,0);
});

test('a site can only be changed through its own project and account',async()=>{
  const env=createEnv();
  const a=await signUp(env,'organizer-a');
  const b=await signUp(env,'organizer-b');
  const projectA=await newProject(env,a.token),projectA2=await newProject(env,a.token,'Second');
  const {data}=await call(env,'/api/sites',{method:'POST',token:a.token,project:projectA,body:{html:'<p>a</p>',slug:'site-a'}});
  const id=data.site.id;
  assert.equal((await call(env,'/api/sites/'+id,{method:'PUT',token:a.token,project:projectA2,body:{html:'<p>x</p>'}})).status,403);
  assert.equal((await call(env,'/api/sites/'+id,{method:'DELETE',token:b.token,project:projectA})).status,404);
  assert.equal((await call(env,'/api/sites/'+id,{method:'PUT',body:{html:'<p>x</p>'},project:projectA})).status,401);
});

test('recovery code resets the password and old sessions stop working',async()=>{
  const env=createEnv();
  const {token,recoveryCode}=await signUp(env,'stardust');
  const wrong=await call(env,'/api/account/recover',{method:'POST',body:{username:'stardust',recoveryCode:'nope',newPassword:'another-1'}});
  assert.equal(wrong.status,400);
  const ok=await call(env,'/api/account/recover',{method:'POST',body:{username:'stardust',recoveryCode,newPassword:'another-1'}});
  assert.equal(ok.status,200);
  assert.equal((await call(env,'/api/me',{token})).status,401);
  assert.equal((await call(env,'/api/account/login',{method:'POST',body:{username:'STARDUST',password:'another-1'}})).status,200);
});

test('oversized HTML is rejected before it reaches R2',async()=>{
  const env=createEnv();
  const {token}=await signUp(env,'big-sites');
  const projectId=await newProject(env,token);
  const r=await call(env,'/api/sites',{method:'POST',token,project:projectId,body:{html:'x'.repeat(25*1024*1024+1),slug:'too-big'}});
  assert.equal(r.status,413);
  assert.equal(env.SITES.objects.size,0);
});

test('login, registration and recovery are rate limited',async()=>{
  const env=createEnv();
  await signUp(env,'brute-target','right-password');
  for(let i=0;i<10;i++)assert.equal((await call(env,'/api/account/login',{method:'POST',body:{username:'brute-target',password:'wrong-'+i}})).status,401);
  const locked=await call(env,'/api/account/login',{method:'POST',body:{username:'brute-target',password:'right-password'}});
  assert.equal(locked.status,429);
  assert.match(locked.data.error,/尝试次数过多/);
  assert.equal(locked.headers.get('access-control-allow-origin'),PAGES);
  for(let i=0;i<4;i++)assert.equal((await call(env,'/api/account/register',{method:'POST',body:{username:'spam-'+i,password:'secret-123'}})).status,201);
  assert.equal((await call(env,'/api/account/register',{method:'POST',body:{username:'spam-x',password:'secret-123'}})).status,429);
  for(let i=0;i<5;i++)await call(env,'/api/account/recover',{method:'POST',body:{username:'brute-target',recoveryCode:'guess-'+i,newPassword:'another-1'}});
  assert.equal((await call(env,'/api/account/recover',{method:'POST',body:{username:'brute-target',recoveryCode:'guess-x',newPassword:'another-1'}})).status,429);
});

test('project config is size-checked and the list reports each project template',async()=>{
  const env=createEnv();
  const {token}=await signUp(env,'sync-user');
  const projectId=await newProject(env,token);
  const saved=await call(env,'/api/config',{method:'PUT',token,project:projectId,body:{config:{eventName:'云端同步',templateId:'04-creator-catalogue'}}});
  assert.equal(saved.status,200);
  const list=await call(env,'/api/projects',{token});
  assert.equal(list.data.projects.find(p=>p.id===projectId).templateId,'04-creator-catalogue');
  const back=await call(env,'/api/config',{token,project:projectId});
  assert.equal(back.data.config.eventName,'云端同步');
  const huge=await call(env,'/api/config',{method:'PUT',token,project:projectId,body:{config:{heroImage:'x'.repeat(1900001)}}});
  assert.equal(huge.status,413);
});

test('visitor sites get robots.txt, no favicon noise and safe headers; the apex keeps its tools out of search',async()=>{
  const env=createEnv();
  const {token}=await signUp(env,'headers-user');
  const projectId=await newProject(env,token);
  await call(env,'/api/sites',{method:'POST',token,project:projectId,body:{html:'<!doctype html><p>hi</p>',slug:'header-site'}});
  const robots=await call(env,'/robots.txt',{host:'header-site.onlyevent.cn'});
  assert.equal(robots.status,200);assert.match(robots.data,/Allow: \//);
  assert.equal((await call(env,'/favicon.ico',{host:'header-site.onlyevent.cn'})).status,204);
  const page=await call(env,'/',{host:'header-site.onlyevent.cn'});
  assert.equal(page.headers.get('x-content-type-options'),'nosniff');
  assert.equal(page.headers.get('referrer-policy'),'strict-origin-when-cross-origin');
  const admin=await call(env,'/admin/',{host:'onlyevent.cn'});
  assert.equal(admin.headers.get('x-frame-options'),'SAMEORIGIN');
  assert.match(admin.headers.get('cache-control'),/no-store/);
  const editor=await call(env,'/v8/',{host:'onlyevent.cn'});
  assert.equal(editor.headers.get('x-frame-options'),'SAMEORIGIN');
});

test('recovery codes are short and forgiving, and old long codes still work',async()=>{
  const env=createEnv();
  const {recoveryCode}=await signUp(env,'short-code');
  assert.match(recoveryCode,/^[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/);
  const typed=recoveryCode.toLowerCase().replace(/-/g,' ');
  const ok=await call(env,'/api/account/recover',{method:'POST',body:{username:'short-code',recoveryCode:typed,newPassword:'another-1'}});
  assert.equal(ok.status,200);

  // A code issued by the previous version: 24 characters, hashed exactly as typed.
  const {token}=await signUp(env,'legacy-code');
  const legacy='Qk3x_9Lm-AbCdEfGhIjKlMnOp';
  const salt=Buffer.from('legacy-salt-0001').toString('base64');
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(legacy),'PBKDF2',false,['deriveBits']);
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:Buffer.from(salt,'base64'),iterations:100000},key,256);
  const hash=Buffer.from(new Uint8Array(bits)).toString('base64');
  const user=await call(env,'/api/me',{token});
  await env.DB.prepare('UPDATE account_recovery SET code_hash=?,code_salt=? WHERE user_id=?').bind(hash,salt,user.data.user.id).run();
  assert.equal((await call(env,'/api/account/recover',{method:'POST',body:{username:'legacy-code',recoveryCode:legacy,newPassword:'another-1'}})).status,200);
  assert.equal((await call(env,'/api/account/recover',{method:'POST',body:{username:'legacy-code',recoveryCode:legacy.toLowerCase(),newPassword:'another-2'}})).status,400);
});

test('changing the password checks the old one and signs out other devices',async()=>{
  const env=createEnv();
  const {token}=await signUp(env,'pw-change');
  const other=await call(env,'/api/account/login',{method:'POST',body:{username:'pw-change',password:'secret-123'}});
  const otherToken=other.data.token;
  const bad=await call(env,'/api/account/password',{method:'POST',token,body:{oldPassword:'wrong-pass',newPassword:'brand-new-1'}});
  assert.equal(bad.status,400);
  const short=await call(env,'/api/account/password',{method:'POST',token,body:{oldPassword:'secret-123',newPassword:'123'}});
  assert.equal(short.status,400);
  const ok=await call(env,'/api/account/password',{method:'POST',token,body:{oldPassword:'secret-123',newPassword:'brand-new-1'}});
  assert.equal(ok.status,200);
  assert.equal((await call(env,'/api/me',{token})).status,200);
  assert.equal((await call(env,'/api/me',{token:otherToken})).status,401);
  assert.equal((await call(env,'/api/account/login',{method:'POST',body:{username:'pw-change',password:'secret-123'}})).status,401);
  assert.equal((await call(env,'/api/account/login',{method:'POST',body:{username:'pw-change',password:'brand-new-1'}})).status,200);
});

test('circle collection: public form, image upload, review queue and isolation',async()=>{
  const env=createEnv();
  const {token}=await signUp(env,'collector'),pid=await newProject(env,token,'收集测试展');
  const other=await signUp(env,'someone-else');
  assert.equal((await call(env,'/api/projects/'+pid+'/collect',{token:other.token})).status,404);
  const on=await call(env,'/api/projects/'+pid+'/collect',{method:'POST',token,body:{action:'enable'}});
  assert.equal(on.status,200);const t=on.data.form.token;assert.match(t,/^[a-f0-9]{20}$/);
  assert.equal((await call(env,'/api/collect/'+t)).data.eventName,'收集测试展');
  assert.equal((await call(env,'/api/collect/'+'0'.repeat(20))).status,404);
  const fd=new FormData();fd.append('file',new File([new Uint8Array([71,73,70,56,57,97])],'a.gif',{type:'image/gif'}));
  const up=await worker.fetch(new Request(API+'/api/collect/'+t+'/image',{method:'POST',body:fd}),env);
  assert.equal(up.status,201);const logo=(await up.json()).url;assert.match(logo,/^\/media\/uploads\/collect\/.+\.gif$/);
  const bad=new FormData();bad.append('file',new File(['x'],'a.exe',{type:'application/octet-stream'}));
  assert.equal((await worker.fetch(new Request(API+'/api/collect/'+t+'/image',{method:'POST',body:bad}),env)).status,415);
  assert.equal((await call(env,'/api/collect/'+t,{method:'POST',body:{name:'无联系方式'}})).status,400);
  const sent=await call(env,'/api/collect/'+t,{method:'POST',body:{name:'浮光工房',type:'插画',intro:'介绍',contact:'QQ 123456',logo,products:[{name:'画集',price:'¥45',image:'https://evil.example/x.png'},{name:''}]}});
  assert.equal(sent.status,201);
  const list=await call(env,'/api/projects/'+pid+'/collect',{token});
  assert.equal(list.data.entries.length,1);
  const e=list.data.entries[0];
  assert.equal(e.data.logo,logo);assert.equal(e.data.products.length,1);assert.equal(e.data.products[0].image,'');
  assert.equal((await call(env,'/api/projects/'+pid+'/collect/entries/'+e.id,{method:'POST',token,body:{status:'approved'}})).status,200);
  assert.equal((await call(env,'/api/projects/'+pid+'/collect',{token})).data.entries[0].status,'approved');
  await call(env,'/api/projects/'+pid+'/collect',{method:'POST',token,body:{action:'close'}});
  assert.equal((await call(env,'/api/collect/'+t,{method:'POST',body:{name:'迟到',contact:'x'}})).status,403);
  const reset=await call(env,'/api/projects/'+pid+'/collect',{method:'POST',token,body:{action:'reset'}});
  assert.notEqual(reset.data.form.token,t);assert.equal((await call(env,'/api/collect/'+t)).status,404);
  assert.equal((await call(env,'/api/projects/'+pid+'/collect/entries/'+e.id,{method:'DELETE',token})).status,200);
});

test('visits are counted per day, bots are ignored, and only the owner sees the numbers',async()=>{
  const env=createEnv();
  const {token}=await signUp(env,'stats-owner'),pid=await newProject(env,token,'统计测试');
  const none=await call(env,'/api/projects/'+pid+'/stats',{token});
  assert.equal(none.data.published,false);
  const created=await call(env,'/api/sites',{method:'POST',token,project:pid,body:{html:'<!doctype html><h1>hi</h1>',title:'统计测试',slug:'stats-site',templateId:'01-ip-only'}});
  assert.equal(created.status,201);
  const visit=ua=>worker.fetch(new Request('https://stats-site.onlyevent.cn/',{headers:ua?{'user-agent':ua}:{}}),env);
  const human='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1';
  for(let i=0;i<3;i++)assert.equal((await visit(human)).status,200);
  assert.equal((await visit('Googlebot/2.1')).status,200);
  assert.equal((await visit('')).status,200);
  const head=await worker.fetch(new Request('https://stats-site.onlyevent.cn/',{method:'HEAD',headers:{'user-agent':human}}),env);
  assert.equal(head.status,200);
  const s=await call(env,'/api/projects/'+pid+'/stats',{token});
  assert.equal(s.data.published,true);assert.equal(s.data.days.length,30);
  assert.equal(s.data.today,3);assert.equal(s.data.last7,3);assert.equal(s.data.total,3);
  const other=await signUp(env,'stats-other');
  assert.equal((await call(env,'/api/projects/'+pid+'/stats',{token:other.token})).status,404);
});

test('visitor sites serve a service worker that keeps the page for offline visits',async()=>{
  const env=createEnv();
  const res=await worker.fetch(new Request('https://any-site.onlyevent.cn/sw.js'),env);
  assert.equal(res.status,200);
  assert.match(res.headers.get('content-type'),/javascript/);
  assert.equal(res.headers.get('service-worker-allowed'),'/');
  const source=await res.text();
  // Run the script against a tiny fake Service Worker environment.
  const store=new Map(),handlers={};let online=true;
  const cacheApi={
    async open(){return {async put(k,v){store.set(typeof k==='string'?k:k.url,v)},async match(k){return store.get(typeof k==='string'?k:k.url)},async keys(){return [...store.keys()].map(url=>({url}))},async delete(k){return store.delete(k.url||k)}}},
    async match(k){return store.get(k)},async keys(){return ['oe-visitor-v1']},async delete(){return true},
  };
  const fakeSelf={addEventListener:(type,fn)=>{handlers[type]=fn},skipWaiting(){},clients:{claim(){}}};
  const fetchStub=async req=>{if(!online)throw new Error('offline');const r=new Response('<h1>site</h1>',{status:200});Object.defineProperty(r,'url',{value:req.url});return r};
  new Function('self','caches','fetch','Response','URL',source)(fakeSelf,cacheApi,fetchStub,Response,URL);
  const run=async(request)=>{let out,pending=[];handlers.fetch({request,respondWith:p=>{out=p},waitUntil:p=>pending.push(p)});const r=out?await out:undefined;await Promise.all(pending);return r};
  const nav={method:'GET',mode:'navigate',url:'https://any-site.onlyevent.cn/?from=qr',destination:'document'};
  assert.equal(await (await run(nav)).text(),'<h1>site</h1>');
  assert.ok(store.has('/'));
  online=false;
  const offline=await run(nav);
  assert.equal(offline.status,200);assert.equal(await offline.text(),'<h1>site</h1>');
  store.clear();
  assert.equal((await run(nav)).status,503);
  assert.equal(await run({method:'POST',mode:'cors',url:'https://any-site.onlyevent.cn/x',destination:''}),undefined);
});
