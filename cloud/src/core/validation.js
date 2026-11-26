import { ApiError } from './errors.js';

export function validUsername(v) {
  return /^[\p{L}\p{N}_-](?:[\p{L}\p{N}_ -]{0,30}[\p{L}\p{N}_-])$/u.test(String(v || ''));
}

export function cleanSlug(v) {
  return String(v || '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').replace(/-+/g, '-').slice(0, 50);
}

export function cleanText(v, n = 200) {
  return String(v ?? '').trim().slice(0, n);
}

export async function bodyJson(req) {
  try { return await req.json(); }
  catch { throw new ApiError(400, 'VALIDATION_ERROR', '请求内容不是有效 JSON'); }
}
