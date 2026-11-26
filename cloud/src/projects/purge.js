import { json } from '../core/http.js';
import { requireUser } from '../auth/session.js';
import { currentProjectId, emptyProjectCookie } from './access.js';
import { currentProjectSite } from '../sites/access.js';
import { deleteSiteResources } from '../sites/resources.js';
import { deleteProjectMedia } from '../media/cleanup.js';

export async function purgeProject(req,env,pid){const u=await requireUser(req,env);const p=await env.DB.prepare(`SELECT p.* FROM projects p JOIN project_state ps ON ps.project_id=p.id WHERE p.id=? AND p.user_id=? AND ps.deleted_at IS NOT NULL`).bind(pid,u.id).first();if(!p)return json({ok:false,error:'回收站中没有这个项目'},404);let cfg={};try{cfg=JSON.parse(p.config_json||'{}')}catch{}const site=await currentProjectSite(req,env,u,p);if(site){await deleteSiteResources(env,site);await env.DB.prepare('DELETE FROM sites WHERE id=? AND user_id=?').bind(site.id,u.id).run()}await deleteProjectMedia(env,u.id,pid,cfg);await env.DB.prepare('DELETE FROM projects WHERE id=? AND user_id=?').bind(pid,u.id).run();const extra=currentProjectId(req)===pid?{'set-cookie':emptyProjectCookie()}:{};return json({ok:true},200,extra)}
