import { json } from '../core/http.js';
import { bodyJson } from '../core/validation.js';
import { requireUser } from '../auth/session.js';
import { rateLimit } from '../auth/rate-limit.js';
import { projectFor } from '../projects/access.js';
import { currentProjectSite } from './access.js';
import { stageKeys } from './resources.js';
import { MAX_SITE_HTML_BYTES } from './publish.js';

export const MAX_STAGES=6;
export async function putSiteStages(req,env,siteId){
  const u=await requireUser(req,env);await rateLimit(env,'site-stages:'+u.id,60,3600);
  const p=await projectFor(req,env,u);if(p&&p.user_id!==u.id)return json({ok:false,error:'只有活动创建者可以管理网站'},403);const site=p?await currentProjectSite(req,env,u,p):null;
  if(!site||site.id!==siteId)return json({ok:false,error:'这个网站不属于当前活动项目'},403);
  const b=await bodyJson(req),list=Array.isArray(b.stages)?b.stages.slice(0,MAX_STAGES):[];
  const clean=[];
  for(const st of list){
    const at=new Date(String(st?.at||''));const htmlText=String(st?.html||'');
    if(Number.isNaN(at.getTime())||!htmlText.trim())return json({ok:false,error:'公开时间或页面内容不完整'},400);
    if(new TextEncoder().encode(htmlText).byteLength>MAX_SITE_HTML_BYTES)return json({ok:false,error:'网站文件超过 25MB，请压缩图片后再发布'},413);
    clean.push({at:at.toISOString(),html:htmlText});
  }
  clean.sort((a,c)=>a.at.localeCompare(c.at));
  const old=await stageKeys(env,siteId),stamp=Date.now();
  const keys=[];
  for(let i=0;i<clean.length;i++){const key='sites/'+siteId+'/stage-'+stamp+'-'+i+'.html';await env.SITES.put(key,clean[i].html,{httpMetadata:{contentType:'text/html; charset=utf-8'},customMetadata:{owner:u.id,project:p.id}});keys.push(key)}
  await env.DB.batch([env.DB.prepare('DELETE FROM site_stages WHERE site_id=?').bind(siteId),...clean.map((c,i)=>env.DB.prepare('INSERT INTO site_stages(site_id,idx,at,object_key) VALUES(?,?,?,?)').bind(siteId,i,c.at,keys[i]))]);
  for(const k of old){try{await env.SITES.delete(k)}catch(e){console.error(e)}}
  return json({ok:true,stages:clean.map(c=>c.at)});
}
