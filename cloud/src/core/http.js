import { codeForStatus } from './errors.js';

export const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };
export const HTML_HEADERS = { 'content-type': 'text/html; charset=utf-8' };
export const CORS_ALLOW_HEADERS = 'content-type,authorization,x-onlyevent-project';
export const CORS_ALLOW_METHODS = 'GET,POST,PUT,DELETE,OPTIONS';
export const CONTENT_SECURITY_POLICY = "default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https: https://cloudflareinsights.com; frame-src 'self' blob:; media-src 'self' blob: data: https:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'";

export function baseDomain(env) {
  return String(env.BASE_DOMAIN || 'onlyevent.cn').trim().toLowerCase();
}

export function allowedOrigin(origin, env) {
  if (!origin) return '';
  let u;
  try { u = new URL(origin); } catch { return ''; }
  if ((u.hostname === 'localhost' || u.hostname === '127.0.0.1') && (u.protocol === 'http:' || u.protocol === 'https:')) return origin;
  if (u.protocol !== 'https:') return '';
  const base = baseDomain(env);
  if (u.hostname === base || u.hostname === 'www.' + base) return origin;
  for (const raw of String(env.ALLOWED_ORIGINS || '').split(',')) {
    const rule = raw.trim().toLowerCase();
    if (!rule) continue;
    if (rule.startsWith('https://*.')) {
      if (u.hostname.endsWith(rule.slice('https://*'.length))) return origin;
    } else if (rule === origin.toLowerCase()) return origin;
  }
  return '';
}

export function corsOrigin(req, env) {
  return allowedOrigin(req.headers.get('origin') || '', env);
}

export function withCors(req, env, res) {
  const origin = corsOrigin(req, env);
  if (!origin) return res;
  const h = new Headers(res.headers);
  h.set('access-control-allow-origin', origin);
  h.append('vary', 'Origin');
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

export function json(data, status = 200, extra = {}) {
  if (data && data.ok === false && data.error && !data.code) data = { ...data, code: codeForStatus(status), message: data.message || data.error };
  return new Response(JSON.stringify(data), { status, headers: { ...JSON_HEADERS, ...extra } });
}

export function html(body, status = 200, extra = {}) {
  return new Response(body, { status, headers: { ...HTML_HEADERS, ...extra } });
}

export function redirect(location, status = 302, extra = {}) {
  return new Response(null, { status, headers: { location, ...extra } });
}

export function cookie(name, value, { maxAge = null, httpOnly = true } = {}) {
  let s = `${name}=${encodeURIComponent(value)}; Path=/; Secure; SameSite=Lax`;
  if (httpOnly) s += '; HttpOnly';
  if (maxAge !== null) s += `; Max-Age=${maxAge}`;
  return s;
}

export function cookieHeaders(...items) {
  const h = new Headers();
  for (const x of items.filter(Boolean)) h.append('set-cookie', x);
  return h;
}
