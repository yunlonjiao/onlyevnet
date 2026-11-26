import { json } from './core/http.js';
import { ownedProject } from './projects/access.js';

/* ---- visit statistics: a daily counter per site, nothing about the visitor is kept ---- */
export const BOT_UA=/bot|spider|crawl|slurp|preview|monitor|uptime|curl|wget|python|httpclient|headless|facebookexternalhit|lighthouse/i;
export const chinaDay=(t=Date.now())=>new Date(t+8*3600*1000).toISOString().slice(0,10);
export async function countView(env,req,siteId){
  if(req.method!=='GET')return;
  const ua=req.headers.get('user-agent')||'';if(!ua||BOT_UA.test(ua))return;
  await env.DB.prepare('INSERT INTO site_stats(site_id,day,views) VALUES(?,?,1) ON CONFLICT(site_id,day) DO UPDATE SET views=views+1').bind(siteId,chinaDay()).run();
  let from='';try{from=String(new URL(req.url).searchParams.get('from')||'').toLowerCase()}catch{}
  if(/^[a-z0-9_-]{1,20}$/.test(from))await env.DB.prepare('INSERT INTO site_channel_stats(site_id,channel,day,views) VALUES(?,?,?,1) ON CONFLICT(site_id,channel,day) DO UPDATE SET views=views+1').bind(siteId,from,chinaDay()).run();
}
export async function projectStats(req,env,pid){
  const p=await ownedProject(req,env,pid);
  const link=await env.DB.prepare('SELECT s.id,s.slug FROM project_sites ps JOIN sites s ON s.id=ps.site_id WHERE ps.project_id=?').bind(pid).first();
  const days=[];for(let i=29;i>=0;i--)days.push({day:chinaDay(Date.now()-i*86400000),views:0});
  if(!link)return json({ok:true,published:false,name:p.name,days,today:0,last7:0,last30:0,total:0,channels:[]});
  const {results=[]}=await env.DB.prepare('SELECT day,views FROM site_stats WHERE site_id=? AND day>=?').bind(link.id,days[0].day).all();
  const byDay=new Map(results.map(r=>[r.day,Number(r.views)||0]));for(const d of days)d.views=byDay.get(d.day)||0;
  const total=await env.DB.prepare('SELECT COALESCE(SUM(views),0) AS n FROM site_stats WHERE site_id=?').bind(link.id).first();
  const sum=list=>list.reduce((n,d)=>n+d.views,0);
  const ch=await env.DB.prepare('SELECT channel,SUM(views) AS views FROM site_channel_stats WHERE site_id=? AND day>=? GROUP BY channel ORDER BY views DESC').bind(link.id,days[0].day).all();
  const channels=(ch.results||[]).map(r=>({channel:r.channel,views:Number(r.views)||0}));
  return json({ok:true,published:true,name:p.name,slug:link.slug,days,today:days[days.length-1].views,last7:sum(days.slice(-7)),last30:sum(days),total:Number(total?.n)||0,channels});
}
