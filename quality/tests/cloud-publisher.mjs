/* Routes every browser request for the publisher Worker into the real cloud/src/worker.js,
   running in this test process against in-memory D1/R2. No test ever reaches production. */
import worker from '../../cloud/src/worker.js';
import {createEnv} from '../../cloud/scripts/fake-env.mjs';

export const PUBLISHER='https://convention-publisher.onlyevents.workers.dev';

export async function useCloudPublisher(page,shared){
  // Pass another cloud to simulate a second device talking to the same Worker.
  const env=shared?.env||createEnv(),requests=[];
  await page.route(PUBLISHER+'/**',async route=>{
    const req=route.request(),headers={...req.headers(),origin:'http://127.0.0.1:4173'};
    const body=['GET','HEAD'].includes(req.method())?undefined:req.postDataBuffer()||undefined;
    const res=await worker.fetch(new Request(req.url(),{method:req.method(),headers,body}),env);
    const text=await res.text();
    requests.push({method:req.method(),path:new URL(req.url()).pathname,status:res.status,headers,body:req.postData()});
    await route.fulfill({status:res.status,headers:Object.fromEntries(res.headers),body:text});
  });
  return {env,requests};
}

/* Registers an organizer through the Worker and stores the session the way the admin page does. */
export async function signInCloud(page,cloud,username='QA 主办方',password='qa-password-01'){
  const res=await worker.fetch(new Request(PUBLISHER+'/api/account/register',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({username,password})}),cloud.env);
  const data=await res.json();
  if(!res.ok)throw new Error(data.error);
  await page.addInitScript(session=>{if(!localStorage.getItem('onlyevent-cloud-session-v1'))localStorage.setItem('onlyevent-cloud-session-v1',JSON.stringify(session))},{token:data.token,username,userId:data.user.id,expiresAt:data.expiresAt});
  return data;
}

/* Signs an existing organizer in on another device. */
export async function loginCloud(page,cloud,username,password='qa-password-01'){
  const res=await worker.fetch(new Request(PUBLISHER+'/api/account/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({username,password})}),cloud.env);
  const data=await res.json();
  if(!res.ok)throw new Error(data.error);
  await page.addInitScript(session=>{if(!localStorage.getItem('onlyevent-cloud-session-v1'))localStorage.setItem('onlyevent-cloud-session-v1',JSON.stringify(session))},{token:data.token,username,userId:data.user.id,expiresAt:data.expiresAt});
  return data;
}

/* Visitor view of a published slug, served by the same Worker. */
export async function visitSite(cloud,slug){
  const res=await worker.fetch(new Request('https://'+slug+'.onlyevent.cn/'),cloud.env);
  return {status:res.status,html:await res.text()};
}
