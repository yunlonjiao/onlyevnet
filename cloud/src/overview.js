import { json } from './core/http.js';
import { now, id } from './core/ids.js';
import { bodyJson, cleanText } from './core/validation.js';
import { requireUser } from './auth/session.js';
import { rateLimit } from './auth/rate-limit.js';
import { chinaDay } from './stats.js';

/* ---- overview numbers for the organizer's start page ---- */
export async function listFeedback(req,env){
  const u=await requireUser(req,env);
  const admins=String(env.PLATFORM_ADMINS||env.PLATFORM_ADMIN||'admin').toLowerCase().split(',').map(x=>x.trim()).filter(Boolean);
  if(!admins.includes(String(u.username||'').toLowerCase()))return json({ok:false,error:'只有平台管理员可以查看反馈。'},403);
  const rows=await env.DB.prepare('SELECT id,username,message,created_at FROM feedback ORDER BY created_at DESC LIMIT 200').all();
  return json({ok:true,items:rows.results||[]});
}
export async function sendFeedback(req,env){
  const u=await requireUser(req,env);await rateLimit(env,'feedback:'+u.id,10,86400);
  const message=cleanText((await bodyJson(req)).message,2000);
  if(message.length<2)return json({ok:false,error:'请写一下想反馈的内容。'},400);
  await env.DB.prepare('INSERT INTO feedback(id,user_id,username,message,created_at) VALUES(?,?,?,?,?)').bind(id('fb'),u.id,u.username,message,now()).run();
  return json({ok:true},201);
}
export async function accountOverview(req,env){
  const u=await requireUser(req,env),since=chinaDay(Date.now()-6*86400000),today=chinaDay();
  const pending=await env.DB.prepare("SELECT COUNT(*) AS n FROM collect_entries e JOIN projects p ON p.id=e.project_id LEFT JOIN project_state s ON s.project_id=p.id WHERE p.user_id=? AND s.deleted_at IS NULL AND e.status='pending'").bind(u.id).first();
  const views=await env.DB.prepare('SELECT COALESCE(SUM(v.views),0) AS n FROM site_stats v JOIN sites s ON s.id=v.site_id WHERE s.user_id=? AND v.day>=?').bind(u.id,since).first();
  const todayViews=await env.DB.prepare('SELECT COALESCE(SUM(v.views),0) AS n FROM site_stats v JOIN sites s ON s.id=v.site_id WHERE s.user_id=? AND v.day=?').bind(u.id,today).first();
  return json({ok:true,pendingCircles:Number(pending?.n)||0,views7:Number(views?.n)||0,viewsToday:Number(todayViews?.n)||0});
}
