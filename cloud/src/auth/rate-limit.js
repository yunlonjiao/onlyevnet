import { ApiError } from '../core/errors.js';

export function clientIp(req) {
  return req.headers.get('cf-connecting-ip') || String(req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
}

// Fixed-window counters in D1: brute force and bulk abuse get a 429 before any expensive work.
export async function rateLimit(env, key, max, windowSec) {
  const t = Date.now();
  const row = await env.DB.prepare('SELECT window_start,count FROM rate_limits WHERE key=?').bind(key).first();
  if (!row || t - Date.parse(row.window_start) >= windowSec * 1000) {
    await env.DB.prepare('INSERT INTO rate_limits(key,window_start,count) VALUES(?,?,1) ON CONFLICT(key) DO UPDATE SET window_start=excluded.window_start,count=1').bind(key, new Date(t).toISOString()).run();
    return;
  }
  if (row.count >= max) {
    const minutes = Math.max(1, Math.ceil((Date.parse(row.window_start) + windowSec * 1000 - t) / 60000));
    throw new ApiError(429, 'RATE_LIMITED', '尝试次数过多，请 ' + minutes + ' 分钟后再试');
  }
  await env.DB.prepare('UPDATE rate_limits SET count=count+1 WHERE key=?').bind(key).run();
}
