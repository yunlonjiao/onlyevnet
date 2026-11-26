import { json } from '../core/http.js';
import { now } from '../core/ids.js';
import { bodyJson, cleanText } from '../core/validation.js';
import { requireUser } from '../auth/session.js';
import { projectWithAccess } from './access.js';

export async function listProjectMembers(req,env,pid){
 const u=await requireUser(req,env),p=await projectWithAccess(env,u,pid);
 if(!p)return json({ok:false,error:'找不到这个活动'},404);
 const owner=await env.DB.prepare('SELECT id,username FROM users WHERE id=?').bind(p.user_id).first();
 const {results=[]}=await env.DB.prepare('SELECT m.user_id,m.role,m.created_at,us.username FROM project_members m JOIN users us ON us.id=m.user_id WHERE m.project_id=? ORDER BY m.created_at').bind(pid).all();
 return json({ok:true,isOwner:p.user_id===u.id,owner:owner?{id:owner.id,username:owner.username}:null,members:results.map(r=>({id:r.user_id,username:r.username,role:r.role,createdAt:r.created_at}))});
}
export async function addProjectMember(req,env,pid){
 const u=await requireUser(req,env),p=await projectWithAccess(env,u,pid);
 if(!p||p.user_id!==u.id)return json({ok:false,error:'只有创建者可以添加协作者'},403);
 const b=await bodyJson(req),username=cleanText(b.username,32);
 const target=await env.DB.prepare('SELECT id,username FROM users WHERE username=? COLLATE NOCASE').bind(username).first();
 if(!target)return json({ok:false,error:'找不到这个账号，请让对方先用该名称注册'},404);
 if(target.id===u.id)return json({ok:false,error:'不能添加自己'},400);
 const exists=await env.DB.prepare('SELECT 1 AS x FROM project_members WHERE project_id=? AND user_id=?').bind(pid,target.id).first();
 if(exists)return json({ok:false,error:'对方已经在协作者列表里了'},409);
 await env.DB.prepare('INSERT INTO project_members(project_id,user_id,role,created_at) VALUES(?,?,?,?) ON CONFLICT(project_id,user_id) DO NOTHING').bind(pid,target.id,'editor',now()).run();
 return json({ok:true,member:{id:target.id,username:target.username,role:'editor'}});
}
export async function removeProjectMember(req,env,pid,uid){
 const u=await requireUser(req,env),p=await projectWithAccess(env,u,pid);
 if(!p)return json({ok:false,error:'找不到这个活动'},404);
 if(p.user_id!==u.id&&uid!==u.id)return json({ok:false,error:'没有权限'},403);
 await env.DB.prepare('DELETE FROM project_members WHERE project_id=? AND user_id=?').bind(pid,uid).run();
 return json({ok:true});
}
