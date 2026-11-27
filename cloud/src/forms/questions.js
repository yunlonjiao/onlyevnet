import { json } from '../core/http.js';
import { now, id } from '../core/ids.js';
import { bodyJson, cleanSlug } from '../core/validation.js';
import { ownedProject } from '../projects/access.js';
import { rateLimit, clientIp } from '../auth/rate-limit.js';
import { collectText } from './collect.js';

/* ---- visitor question centre ---- */
const ASK_MAX_PER_PROJECT=500;
export async function askTarget(env,slug){
  slug=cleanSlug(slug);if(!slug)return null;
  return env.DB.prepare('SELECT ps.project_id AS pid,COALESCE(a.enabled,0) AS enabled FROM sites s JOIN project_sites ps ON ps.site_id=s.id LEFT JOIN ask_settings a ON a.project_id=ps.project_id WHERE s.slug=? COLLATE NOCASE').bind(slug).first();
}
export async function askPublic(req,env,slug){
  const t=await askTarget(env,slug);
  if(!t||!t.enabled)return json({ok:true,enabled:false,faq:[]},200,{'cache-control':'no-store'});
  const {results=[]}=await env.DB.prepare("SELECT text,answer FROM questions WHERE project_id=? AND published=1 AND answer<>'' ORDER BY answered_at DESC LIMIT 100").bind(t.pid).all();
  return json({ok:true,enabled:true,faq:results.map(r=>({q:r.text,a:r.answer}))},200,{'cache-control':'no-store'});
}
export async function askSubmit(req,env,slug){
  await rateLimit(env,'ask:'+clientIp(req),6,3600);
  const t=await askTarget(env,slug);
  if(!t||!t.enabled)return json({ok:false,error:'这个网站没有开放提问'},404);
  const text=collectText((await bodyJson(req)).text,300);
  if(text.length<2)return json({ok:false,error:'请写一下你想问的问题'},400);
  const n=await env.DB.prepare('SELECT COUNT(*) AS n FROM questions WHERE project_id=?').bind(t.pid).first();
  if(Number(n?.n||0)>=ASK_MAX_PER_PROJECT)return json({ok:false,error:'提问太多了，请稍后再试'},429);
  await env.DB.prepare('INSERT INTO questions(id,project_id,text,created_at) VALUES(?,?,?,?)').bind(id('q'),t.pid,text,now()).run();
  return json({ok:true},201);
}
export async function askOverview(req,env,pid){
  await ownedProject(req,env,pid);
  const st=await env.DB.prepare('SELECT enabled FROM ask_settings WHERE project_id=?').bind(pid).first();
  const {results=[]}=await env.DB.prepare('SELECT id,text,answer,published,created_at FROM questions WHERE project_id=? ORDER BY (answer=\'\') DESC,created_at DESC LIMIT 500').bind(pid).all();
  return json({ok:true,enabled:!!st?.enabled,items:results.map(r=>({id:r.id,text:r.text,answer:r.answer,published:!!r.published,createdAt:r.created_at}))});
}
export async function askManage(req,env,pid){
  await ownedProject(req,env,pid);
  const b=await bodyJson(req),enabled=b.enabled?1:0;
  await env.DB.prepare('INSERT INTO ask_settings(project_id,enabled) VALUES(?,?) ON CONFLICT(project_id) DO UPDATE SET enabled=excluded.enabled').bind(pid,enabled).run();
  return json({ok:true,enabled:!!enabled});
}
export async function askQuestionUpdate(req,env,pid,qid){
  await ownedProject(req,env,pid);
  const row=await env.DB.prepare('SELECT id FROM questions WHERE id=? AND project_id=?').bind(qid,pid).first();
  if(!row)return json({ok:false,error:'没有找到这个问题'},404);
  if(req.method==='DELETE'){await env.DB.prepare('DELETE FROM questions WHERE id=?').bind(qid).run();return json({ok:true})}
  const b=await bodyJson(req),answer=collectText(b.answer,1000),published=b.published&&answer?1:0;
  await env.DB.prepare('UPDATE questions SET answer=?,published=?,answered_at=? WHERE id=?').bind(answer,published,answer?now():null,qid).run();
  return json({ok:true});
}
// The widget is injected into the visitor page only when the organizer switched questions on.
export function askWidget(slug){
  const code='(function(slug){if(window.__oeAsk)return;window.__oeAsk=1;'+
  'var css=".oe-ask-btn{position:fixed;left:14px;bottom:84px;z-index:2147483000;border:0;border-radius:999px;padding:10px 16px;background:#222;color:#fff;font:600 14px system-ui,sans-serif;cursor:pointer;box-shadow:0 6px 18px #0004}.oe-ask-panel{position:fixed;left:14px;bottom:134px;z-index:2147483000;width:min(340px,calc(100vw - 28px));max-height:70vh;overflow:auto;background:#fff;color:#222;border-radius:16px;box-shadow:0 12px 40px #0005;padding:16px;font:14px/1.6 system-ui,sans-serif}.oe-ask-panel[hidden]{display:none}.oe-ask-panel h3{margin:0 0 8px;font-size:16px}.oe-ask-panel details{border-top:1px solid #eee;padding:8px 0}.oe-ask-panel summary{cursor:pointer;font-weight:600}.oe-ask-panel p{margin:6px 0 0;white-space:pre-line}.oe-ask-panel textarea{width:100%;box-sizing:border-box;border:1px solid #ccc;border-radius:10px;padding:8px;font:inherit;margin-top:10px}.oe-ask-panel button.oe-send{margin-top:8px;border:0;border-radius:999px;padding:8px 18px;background:#222;color:#fff;font:inherit;cursor:pointer}.oe-ask-msg{color:#666;font-size:13px;margin-top:6px}";'+
  'var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);'+
  'var btn=document.createElement("button");btn.type="button";btn.className="oe-ask-btn";btn.textContent="有问题？问主办方";'+
  'var box=document.createElement("div");box.className="oe-ask-panel";box.hidden=true;'+
  'var h=document.createElement("h3");h.textContent="常见问题";var list=document.createElement("div");'+
  'var ta=document.createElement("textarea");ta.rows=3;ta.maxLength=300;ta.placeholder="没找到答案？在这里写下你的问题";'+
  'var send=document.createElement("button");send.type="button";send.className="oe-send";send.textContent="发送给主办方";'+
  'var msg=document.createElement("div");msg.className="oe-ask-msg";'+
  'box.appendChild(h);box.appendChild(list);box.appendChild(ta);box.appendChild(send);box.appendChild(msg);'+
  'var api="/api/ask/"+encodeURIComponent(slug),loaded=false;'+
  'function load(){fetch(api).then(function(r){return r.json()}).then(function(d){loaded=true;list.textContent="";(d.faq||[]).forEach(function(f){var de=document.createElement("details"),su=document.createElement("summary"),p=document.createElement("p");su.textContent=f.q;p.textContent=f.a;de.appendChild(su);de.appendChild(p);list.appendChild(de)});if(!(d.faq||[]).length)h.textContent="向主办方提问"}).catch(function(){msg.textContent="现在连不上网络。"})}'+
  'btn.onclick=function(){box.hidden=!box.hidden;if(!box.hidden&&!loaded)load()};'+
  'send.onclick=function(){var t=ta.value.trim();if(t.length<2){msg.textContent="请写一下你想问的问题";return}send.disabled=true;msg.textContent="";'+
  'fetch(api,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({text:t})}).then(function(r){return r.json()}).then(function(d){msg.textContent=d.ok?"已发给主办方，回复后会出现在上面的常见问题里。":(d.error||"没发出去，请稍后再试");if(d.ok)ta.value=""}).catch(function(){msg.textContent="没发出去，请检查网络"}).then(function(){send.disabled=false})};'+
  'document.body.appendChild(btn);document.body.appendChild(box)})('+JSON.stringify(slug).replace(/</g,'\\u003c')+');';
  return '<script>'+code+'</script>';
}
