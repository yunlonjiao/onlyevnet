import { json } from '../core/http.js';
import { authUser } from './session.js';

export async function accountStatus(req,env){const u=await authUser(req,env);const row=await env.DB.prepare('SELECT COUNT(*) AS n FROM users').first();return json({ok:true,initialized:Number(row?.n||0)>0,authenticated:!!u,username:u?.username||null})}
export async function sessionInfo(req,env){const u=await authUser(req,env);return json(u?{authenticated:true,role:'organizer',username:u.username,boothId:null}:{authenticated:false})}
