import { baseDomain } from '../core/http.js';
import { now } from '../core/ids.js';
import { cleanSlug } from '../core/validation.js';
import { projectFor } from '../projects/access.js';

export async function ensureLegacyProjectSiteBinding(req,env,u,p){
  if(!p)return null;
  let row=await env.DB.prepare(`SELECT s.* FROM project_sites ps JOIN sites s ON s.id=ps.site_id WHERE ps.project_id=? AND ps.user_id=? LIMIT 1`).bind(p.id,u.id).first();
  if(row)return row;
  let cfg={};try{cfg=JSON.parse(p.config_json||'{}')}catch{}
  const url=String(cfg.visitorSiteUrl||'');let slug='';
  try{const parsed=new URL(url),host=parsed.hostname.toLowerCase(),base=baseDomain(env);if(host.endsWith('.'+base))slug=cleanSlug(host.slice(0,-(base.length+1)));else{const m=parsed.pathname.match(/^\/s\/([^/]+)/);if(m)slug=cleanSlug(m[1])}}catch{}
  if(!slug)return null;
  row=await env.DB.prepare(`SELECT s.* FROM sites s LEFT JOIN project_sites ps ON ps.site_id=s.id WHERE s.user_id=? AND s.slug=? COLLATE NOCASE AND ps.site_id IS NULL LIMIT 1`).bind(u.id,slug).first();
  if(!row)return null;
  const t=now();await env.DB.prepare(`INSERT INTO project_sites(project_id,site_id,user_id,created_at,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(project_id) DO NOTHING`).bind(p.id,row.id,u.id,t,t).run();
  return row;
}

export async function currentProjectSite(req,env,u,p=null){p=p||await projectFor(req,env,u);if(!p)return null;return await ensureLegacyProjectSiteBinding(req,env,u,p)}
