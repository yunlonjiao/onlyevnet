import { json } from '../core/http.js';
import { now, id } from '../core/ids.js';
import { bodyJson } from '../core/validation.js';
import { ownedProject } from '../projects/access.js';
import { rateLimit, clientIp } from '../auth/rate-limit.js';
import { collectText } from './collect.js';

/* ---- sign-up forms ---- */
const SIGNUP_MAX_FORMS=8,SIGNUP_MAX_ENTRIES=500,SIGNUP_MAX_FIELDS=8,SIGNUP_KINDS=new Set(['cos','photographer','volunteer','custom']);
function cleanSignupConfig(c){
  c=c&&typeof c==='object'?c:{};
  const fields=[];
  for(const f of (Array.isArray(c.fields)?c.fields:[]).slice(0,SIGNUP_MAX_FIELDS)){
    const label=collectText(f?.label,30);if(!label)continue;
    fields.push({key:'f'+(fields.length+1),label,required:!!f.required,long:!!f.long});
  }
  return {title:collectText(c.title,40)||'报名',intro:collectText(c.intro,200),fields};
}
const signupView=r=>{let config={};try{config=JSON.parse(r.config_json)}catch{}return {id:r.id,kind:r.kind,token:r.token,open:!!r.open,config}};
async function ownedSignup(env,pid,fid){return env.DB.prepare('SELECT * FROM signup_forms WHERE id=? AND project_id=?').bind(fid,pid).first()}
export async function signupList(req,env,pid){
  await ownedProject(req,env,pid);
  const {results=[]}=await env.DB.prepare('SELECT * FROM signup_forms WHERE project_id=? ORDER BY created_at').bind(pid).all();
  const out=[];
  for(const r of results){
    const c=await env.DB.prepare("SELECT SUM(status='pending') AS pending,COUNT(*) AS total FROM signup_entries WHERE form_id=?").bind(r.id).first();
    out.push({...signupView(r),pending:Number(c?.pending)||0,total:Number(c?.total)||0});
  }
  return json({ok:true,forms:out});
}
export async function signupCreate(req,env,pid){
  await ownedProject(req,env,pid);
  const b=await bodyJson(req),kind=SIGNUP_KINDS.has(b.kind)?b.kind:'custom';
  const n=await env.DB.prepare('SELECT COUNT(*) AS n FROM signup_forms WHERE project_id=?').bind(pid).first();
  if(Number(n?.n||0)>=SIGNUP_MAX_FORMS)return json({ok:false,error:'一个活动最多 '+SIGNUP_MAX_FORMS+' 个报名表'},400);
  const config=cleanSignupConfig(b.config),fid=id('sf');
  if(!config.fields.length)return json({ok:false,error:'至少要有一个填写项'},400);
  await env.DB.prepare('INSERT INTO signup_forms(id,project_id,kind,config_json,token,open,created_at) VALUES(?,?,?,?,?,1,?)').bind(fid,pid,kind,JSON.stringify(config),crypto.randomUUID().replace(/-/g,'').slice(0,20),now()).run();
  return json({ok:true,form:signupView(await ownedSignup(env,pid,fid))},201);
}
export async function signupUpdate(req,env,pid,fid){
  await ownedProject(req,env,pid);
  const form=await ownedSignup(env,pid,fid);if(!form)return json({ok:false,error:'没有找到这个报名表'},404);
  if(req.method==='DELETE'){await env.DB.prepare('DELETE FROM signup_forms WHERE id=?').bind(fid).run();return json({ok:true})}
  const b=await bodyJson(req);
  if(b.config!==undefined){const config=cleanSignupConfig(b.config);if(!config.fields.length)return json({ok:false,error:'至少要有一个填写项'},400);await env.DB.prepare('UPDATE signup_forms SET config_json=? WHERE id=?').bind(JSON.stringify(config),fid).run()}
  if(b.open!==undefined)await env.DB.prepare('UPDATE signup_forms SET open=? WHERE id=?').bind(b.open?1:0,fid).run();
  return json({ok:true,form:signupView(await ownedSignup(env,pid,fid))});
}
export async function signupEntries(req,env,pid,fid){
  await ownedProject(req,env,pid);
  if(!await ownedSignup(env,pid,fid))return json({ok:false,error:'没有找到这个报名表'},404);
  const {results=[]}=await env.DB.prepare('SELECT id,data_json,status,created_at FROM signup_entries WHERE form_id=? ORDER BY created_at DESC LIMIT 500').bind(fid).all();
  return json({ok:true,entries:results.map(r=>{let data={};try{data=JSON.parse(r.data_json)}catch{}return {id:r.id,status:r.status,createdAt:r.created_at,answers:data.answers||[]}})});
}
export async function signupEntryUpdate(req,env,pid,fid,eid){
  await ownedProject(req,env,pid);
  if(!await ownedSignup(env,pid,fid))return json({ok:false,error:'没有找到这个报名表'},404);
  const row=await env.DB.prepare('SELECT id FROM signup_entries WHERE id=? AND form_id=?').bind(eid,fid).first();
  if(!row)return json({ok:false,error:'没有找到这条报名'},404);
  if(req.method==='DELETE'){await env.DB.prepare('DELETE FROM signup_entries WHERE id=?').bind(eid).run();return json({ok:true})}
  const status=String((await bodyJson(req)).status||'');
  if(!['pending','approved','rejected'].includes(status))return json({ok:false,error:'状态不对'},400);
  await env.DB.prepare('UPDATE signup_entries SET status=? WHERE id=?').bind(status,eid).run();
  return json({ok:true});
}
async function signupPublicForm(env,token){
  return env.DB.prepare('SELECT f.*,p.name AS project_name FROM signup_forms f JOIN projects p ON p.id=f.project_id LEFT JOIN project_state s ON s.project_id=p.id WHERE f.token=? AND s.deleted_at IS NULL').bind(token).first();
}
export async function signupInfo(req,env,token){
  const f=await signupPublicForm(env,token);if(!f)return json({ok:false,error:'这个报名链接无效'},404);
  const v=signupView(f);
  return json({ok:true,open:v.open,eventName:f.project_name,title:v.config.title,intro:v.config.intro,fields:v.config.fields.map(x=>({key:x.key,label:x.label,required:x.required,long:x.long}))},200,{'cache-control':'no-store'});
}
export async function signupSubmit(req,env,token){
  await rateLimit(env,'signup:'+clientIp(req),20,3600);
  const f=await signupPublicForm(env,token);if(!f)return json({ok:false,error:'这个报名链接无效'},404);
  if(!f.open)return json({ok:false,error:'报名已经关闭'},403);
  const config=signupView(f).config,values=(await bodyJson(req)).values||{},answers=[];
  for(const field of config.fields){
    const value=collectText(values[field.key],field.long?500:100);
    if(field.required&&!value)return json({ok:false,error:'请填写：'+field.label},400);
    answers.push({label:field.label,value});
  }
  const n=await env.DB.prepare('SELECT COUNT(*) AS n FROM signup_entries WHERE form_id=?').bind(f.id).first();
  if(Number(n?.n||0)>=SIGNUP_MAX_ENTRIES)return json({ok:false,error:'报名人数已满，请联系主办方'},429);
  await env.DB.prepare('INSERT INTO signup_entries(id,form_id,data_json,status,created_at) VALUES(?,?,?,?,?)').bind(id('se'),f.id,JSON.stringify({answers}),'pending',now()).run();
  return json({ok:true},201);
}
