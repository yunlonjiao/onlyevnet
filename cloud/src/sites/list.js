import { json } from '../core/http.js';
import { requireUser } from '../auth/session.js';
import { projectFor } from '../projects/access.js';
import { currentProjectSite } from './access.js';
import { publicUrl } from '../core/http.js';

export async function listSites(req,env){const u=await requireUser(req,env),p=await projectFor(req,env,u);if(!p)return json({ok:true,sites:[]});const site=await currentProjectSite(req,env,u,p);if(!site)return json({ok:true,sites:[]});return json({ok:true,sites:[{id:site.id,project_id:p.id,slug:site.slug,title:site.title,size_bytes:site.size_bytes,status:site.status,last_viewed_at:site.last_viewed_at,removed_at:site.removed_at,created_at:site.created_at,updated_at:site.updated_at,url:publicUrl(env,site.slug,req)}]})}

export async function systemLinks(req,env){const u=await requireUser(req,env),p=await projectFor(req,env,u),site=p?await currentProjectSite(req,env,u,p):null;let cfg={};try{cfg=JSON.parse(p?.config_json||'{}')}catch{}const visitor=site?publicUrl(env,site.slug,req):(cfg.visitorSiteUrl||new URL(req.url).origin+'/');return json({ok:true,visitor,autoVisitor:visitor,scope:'public',publicUrl:visitor,customVisitor:!!site})}
