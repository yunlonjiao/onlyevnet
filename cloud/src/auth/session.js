import { ApiError } from '../core/errors.js';
import { cookie, json } from '../core/http.js';
import { randomToken, sha256 } from '../core/crypto.js';

export const SESSION_COOKIE = 'onlyevent_session';

export function sessionDays(env) {
  const n = Number(env.SESSION_DAYS || 30);
  return Number.isFinite(n) && n > 0 ? n : 30;
}

export function parseCookies(req) {
  const out = {};
  for (const part of String(req.headers.get('cookie') || '').split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    const k = part.slice(0, i).trim(), v = part.slice(i + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  }
  return out;
}

export async function tokenFromReq(req) {
  const h = req.headers.get('authorization') || '', m = h.match(/^Bearer\s+(.+)$/i);
  if (m) return m[1];
  return parseCookies(req)[SESSION_COOKIE] || '';
}

export async function authUser(req, env) {
  const token = await tokenFromReq(req);
  if (!token) return null;
  const th = await sha256(token);
  const row = await env.DB.prepare(`SELECT users.id,users.username,sessions.expires_at FROM sessions JOIN users ON users.id=sessions.user_id WHERE sessions.token_hash=? LIMIT 1`).bind(th).first();
  if (!row) return null;
  if (new Date(row.expires_at).getTime() <= Date.now()) {
    await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(th).run();
    return null;
  }
  return { id: row.id, username: row.username, tokenHash: th };
}

export async function requireUser(req, env) {
  const u = await authUser(req, env);
  if (!u) throw new ApiError(401, 'AUTH_REQUIRED', '请先登录');
  return u;
}

export async function issueSession(env, userId, username, status = 200, extra = {}) {
  const token = randomToken(36), tokenHash = await sha256(token), days = sessionDays(env);
  const exp = new Date(Date.now() + days * 86400000).toISOString();
  await env.DB.prepare('INSERT INTO sessions(token_hash,user_id,expires_at,created_at) VALUES(?,?,?,?)').bind(tokenHash, userId, exp, new Date().toISOString()).run();
  return json({ ok: true, token, user: { id: userId, username }, username, expiresAt: exp, ...extra }, status, { 'set-cookie': cookie(SESSION_COOKIE, token, { maxAge: days * 86400 }) });
}

export async function logout(req, env) {
  const token = await tokenFromReq(req);
  if (token) await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await sha256(token)).run();
  return json({ ok: true }, 200, { 'set-cookie': cookie(SESSION_COOKIE, '', { maxAge: 0 }) });
}
