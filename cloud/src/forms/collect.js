import { json } from '../core/http.js';
import { now, id } from '../core/ids.js';
import { bodyJson } from '../core/validation.js';
import { ownedProject } from '../projects/access.js';
import { rateLimit, clientIp } from '../auth/rate-limit.js';
import { extFromType } from '../media/upload.js';

/* ---- circle collection: public form for circle leaders, review queue for the organizer ---- */
const COLLECT_MAX_ENTRIES=300,COLLECT_MAX_PRODUCTS=8;
export function collectText(v,max){return String(v==null?'':v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').trim().slice(0,max)}
function collectView(row){return row?{token:row.token,open:!!row.open}:null}
export async function collectOverview(req,env,pid){
  await ownedProject(req,env,pid);
  const form=await env.DB.prepare('SELECT token,open FROM collect_forms WHERE project_id=?').bind(pid).first();
  const {results=[]}=await env.DB.prepare('SELECT id,data_json,status,created_at FROM collect_entries WHERE project_id=? ORDER BY created_at DESC LIMIT 500').bind(pid).all();
  const entries=results.map(r=>{let data={};try{data=JSON.parse(r.data_json)}catch{}return {id:r.id,status:r.status,createdAt:r.created_at,data}});
  return json({ok:true,form:collectView(form),entries});
}
export async function collectManage(req,env,pid){
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
export async function collectEntryUpdate(req,env,pid,eid){
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
export async function collectInfo(req,env,token){
  const f=await collectFormByToken(env,token);if(!f)return json({ok:false,error:'这个收集链接无效或已失效'},404);
  return json({ok:true,open:!!f.open,eventName:f.name});
}
export async function collectImage(req,env,token){
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
export async function collectSubmit(req,env,token){
  const f=await collectFormByToken(env,token);if(!f)return json({ok:false,error:'这个收集链接无效或已失效'},404);
  if(!f.open)return json({ok:false,error:'主办方已关闭填写'},403);
  await rateLimit(env,'collect-sub:'+clientIp(req),10,3600);
  const b=await bodyJson(req),mediaPrefix='/media/uploads/collect/'+f.project_id+'/';
  const img=v=>{v=String(v||'');return v.startsWith(mediaPrefix)&&/^[a-zA-Z0-9_\/.-]+$/.test(v)?v:''};
  const data={name:collectText(b.name,40),type:collectText(b.type,40),intro:collectText(b.intro,200),contact:collectText(b.contact,80),logo:img(b.logo),products:[]};
  if(!data.name)return json({ok:false,error:'请填写社团名称'},400);
  if(!data.contact)return json({ok:false,error:'请填写联系方式'},400);
  for(const p of (Array.isArray(b.products)?b.products:[]).slice(0,COLLECT_MAX_PRODUCTS)){
    const name=collectText(p?.name,40);if(!name)continue;
    data.products.push({name,price:collectText(p.price,20),note:collectText(p.note,60),image:img(p.image)});
  }
  const count=await env.DB.prepare('SELECT COUNT(*) AS n FROM collect_entries WHERE project_id=?').bind(f.project_id).first();
  if(Number(count?.n||0)>=COLLECT_MAX_ENTRIES)return json({ok:false,error:'提交数量已达上限，请联系主办方'},429);
  await env.DB.prepare('INSERT INTO collect_entries(id,project_id,data_json,status,created_at) VALUES(?,?,?,?,?)').bind(id('ce'),f.project_id,JSON.stringify(data),'pending',now()).run();
  return json({ok:true},201);
}
