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
