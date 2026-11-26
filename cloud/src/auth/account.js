import { json } from '../core/http.js';
import { now, id } from '../core/ids.js';
import { bodyJson, cleanText, validUsername } from '../core/validation.js';
import { requireUser, issueSession } from './session.js';
import { hashPassword, newSalt } from './password.js';
import { newRecoveryCode, formatRecoveryCode, recoveryCandidates } from './recovery.js';
import { rateLimit, clientIp } from './rate-limit.js';
import { mediaKeysFromValue } from '../media/keys.js';

export async function register(req,env){await rateLimit(env,'register:'+clientIp(req),5,3600);const b=await bodyJson(req),username=cleanText(b.username,32),password=String(b.password||'');if(!validUsername(username))return json({ok:false,error:'主办方名称需为 2–32 个字符，可使用中英文、数字、空格、_ 或 -'},400);if(password.length<6)return json({ok:false,error:'密码至少 6 位'},400);const exists=await env.DB.prepare('SELECT id FROM users WHERE username=? COLLATE NOCASE').bind(username).first();if(exists)return json({ok:false,error:'这个账号已经注册'},409);const salt=newSalt(),passwordHash=await hashPassword(password,salt),userId=id('usr'),recoveryCode=newRecoveryCode(),recoverySalt=newSalt(),recoveryHash=await hashPassword(recoveryCode,recoverySalt),created=now();await env.DB.batch([env.DB.prepare('INSERT INTO users(id,username,password_hash,password_salt,created_at) VALUES(?,?,?,?,?)').bind(userId,username,passwordHash,salt,created),env.DB.prepare('INSERT INTO account_recovery(user_id,code_hash,code_salt,updated_at) VALUES(?,?,?,?)').bind(userId,recoveryHash,recoverySalt,created)]);return issueSession(env,userId,username,201,{recoveryCode:formatRecoveryCode(recoveryCode)})}
export async function login(req,env){const b=await bodyJson(req),username=cleanText(b.username,32),password=String(b.password||'');await rateLimit(env,'login-ip:'+clientIp(req),30,900);await rateLimit(env,'login:'+username.toLowerCase(),10,900);const row=await env.DB.prepare('SELECT id,username,password_hash,password_salt FROM users WHERE username=? COLLATE NOCASE').bind(username).first();if(!row)return json({ok:false,error:'账号或密码不正确'},401);const got=await hashPassword(password,row.password_salt);if(got!==row.password_hash)return json({ok:false,error:'账号或密码不正确'},401);return issueSession(env,row.id,row.username)}
export async function recoverAccount(req,env){const b=await bodyJson(req);await rateLimit(env,'recover-ip:'+clientIp(req),20,3600);await rateLimit(env,'recover:'+cleanText(b.username,32).toLowerCase(),5,3600);const username=cleanText(b.username,32),recoveryCode=String(b.recoveryCode||'').trim(),newPassword=String(b.newPassword||'');if(!validUsername(username)||!recoveryCode)return json({ok:false,error:'请输入账号和恢复码'},400);if(newPassword.length<6)return json({ok:false,error:'新密码至少 6 位'},400);const row=await env.DB.prepare(`SELECT users.id,account_recovery.code_hash,account_recovery.code_salt FROM users LEFT JOIN account_recovery ON account_recovery.user_id=users.id WHERE users.username=? COLLATE NOCASE LIMIT 1`).bind(username).first();if(!row?.code_hash)return json({ok:false,error:'账号或恢复码不正确'},400);let matched=false;for(const candidate of recoveryCandidates(recoveryCode)){if(await hashPassword(candidate,row.code_salt)===row.code_hash){matched=true;break}}if(!matched)return json({ok:false,error:'账号或恢复码不正确'},400);const salt=newSalt(),passwordHash=await hashPassword(newPassword,salt);await env.DB.batch([env.DB.prepare('UPDATE users SET password_hash=?,password_salt=? WHERE id=?').bind(passwordHash,salt,row.id),env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(row.id)]);return json({ok:true})}
export async function rotateRecoveryCode(req,env){const u=await requireUser(req,env),recoveryCode=newRecoveryCode(),recoverySalt=newSalt(),recoveryHash=await hashPassword(recoveryCode,recoverySalt),updated=now();await env.DB.prepare(`INSERT INTO account_recovery(user_id,code_hash,code_salt,updated_at) VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET code_hash=excluded.code_hash,code_salt=excluded.code_salt,updated_at=excluded.updated_at`).bind(u.id,recoveryHash,recoverySalt,updated).run();return json({ok:true,recoveryCode:formatRecoveryCode(recoveryCode),updatedAt:updated})}
export async function changePassword(req,env){
  const u=await requireUser(req,env);await rateLimit(env,'password:'+u.id,10,3600);
  const b=await bodyJson(req),oldPassword=String(b.oldPassword||''),newPassword=String(b.newPassword||'');
  if(newPassword.length<6)return json({ok:false,error:'新密码至少 6 位'},400);
  const row=await env.DB.prepare('SELECT password_hash,password_salt FROM users WHERE id=?').bind(u.id).first();
  if(!row||await hashPassword(oldPassword,row.password_salt)!==row.password_hash)return json({ok:false,error:'当前密码不正确'},400);
  const salt=newSalt(),hash=await hashPassword(newPassword,salt);
  // Other devices must sign in again with the new password; this session stays.
  await env.DB.batch([env.DB.prepare('UPDATE users SET password_hash=?,password_salt=? WHERE id=?').bind(hash,salt,u.id),env.DB.prepare('DELETE FROM sessions WHERE user_id=? AND token_hash<>?').bind(u.id,u.tokenHash)]);
  return json({ok:true});
}
export async function deleteAccount(req,env){
  const u=await requireUser(req,env);await rateLimit(env,'account-delete:'+u.id,5,3600);
  const b=await bodyJson(req),password=String(b.password||'');
  const row=await env.DB.prepare('SELECT password_hash,password_salt FROM users WHERE id=?').bind(u.id).first();
  if(!row||await hashPassword(password,row.password_salt)!==row.password_hash)return json({ok:false,error:'密码不正确'},400);
  // Collect every stored file first: once the user row is gone the links to them are gone too.
  const keys=new Set();
  const add=rows=>{for(const r of rows.results||[])if(r.object_key)keys.add(r.object_key)};
  add(await env.DB.prepare('SELECT object_key FROM sites WHERE user_id=?').bind(u.id).all());
  add(await env.DB.prepare('SELECT v.object_key FROM site_versions v JOIN sites s ON s.id=v.site_id WHERE s.user_id=?').bind(u.id).all());
  add(await env.DB.prepare('SELECT v.object_key FROM site_stages v JOIN sites s ON s.id=v.site_id WHERE s.user_id=?').bind(u.id).all());
  add(await env.DB.prepare('SELECT m.object_key FROM project_media m JOIN projects p ON p.id=m.project_id WHERE p.user_id=?').bind(u.id).all());
  const {results=[]}=await env.DB.prepare('SELECT config_json FROM projects WHERE user_id=?').bind(u.id).all();
  for(const r of results){try{for(const k of mediaKeysFromValue(JSON.parse(r.config_json||'{}')))keys.add(k)}catch{}}
  await env.DB.prepare('DELETE FROM users WHERE id=?').bind(u.id).run();
  for(const key of keys){try{await env.SITES.delete(key)}catch(e){console.error(e)}}
  return json({ok:true});
}
