import { json } from '../core/http.js';
import { bodyJson, cleanText } from '../core/validation.js';
import { now } from '../core/ids.js';
import { requireUser } from '../auth/session.js';
import { projectFor } from './access.js';
import { ensureProjectState } from './lifecycle.js';
import { seedProject } from './seed.js';

const MAX_PROJECT_CONFIG_BYTES = 1900000;

export async function getConfig(req,env,publicMode=false){const u=await requireUser(req,env),p=await projectFor(req,env,u);if(!p)return json({ok:false,error:'请先创建一个活动'},404);await ensureProjectState(env,p.id,p.user_id);let cfg={};try{cfg=JSON.parse(p.config_json)}catch{cfg=seedProject(p.name)};const st=await env.DB.prepare('SELECT published_at,published_config_json,deleted_at FROM project_state WHERE project_id=? AND user_id=?').bind(p.id,u.id).first();return json({ok:true,config:cfg,session:{role:'organizer',username:u.username,boothId:null},project:{id:p.id,name:p.name,updatedAt:p.updated_at,publishedAt:st?.published_at||null,hasUnpublishedChanges:!!st?.published_at&&new Date(p.updated_at).getTime()>new Date(st.published_at).getTime()}})}
export async function putConfig(req,env){const u=await requireUser(req,env),p=await projectFor(req,env,u);if(!p)return json({ok:false,error:'请先创建一个漫展'},404);const b=await bodyJson(req),cfg=b.config&&typeof b.config==='object'?b.config:null;if(!cfg)return json({ok:false,error:'配置内容无效'},400);const configJson=JSON.stringify(cfg);if(new TextEncoder().encode(configJson).byteLength>MAX_PROJECT_CONFIG_BYTES)return json({ok:false,error:'项目数据超过 1.9MB，请把图片上传到云端后再保存'},413);const name=cleanText(cfg.eventName||p.name,160)||p.name,updated=now();await env.DB.prepare('UPDATE projects SET name=?,config_json=?,updated_at=? WHERE id=?').bind(name,JSON.stringify(cfg),updated,p.id).run();return json({ok:true,config:cfg})}
export async function resetConfig(req,env){const u=await requireUser(req,env),p=await projectFor(req,env,u);if(!p)return json({ok:false,error:'请先创建一个漫展'},404);const cfg=seedProject(p.name,'','');await env.DB.prepare('UPDATE projects SET config_json=?,updated_at=? WHERE id=?').bind(JSON.stringify(cfg),now(),p.id).run();return json({ok:true,config:cfg})}
