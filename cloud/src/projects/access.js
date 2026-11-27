import { ApiError } from '../core/errors.js';
import { cookie } from '../core/http.js';
import { cleanText } from '../core/validation.js';
import { parseCookies, requireUser } from '../auth/session.js';

export const PROJECT_COOKIE = 'onlyevent_project';

export function currentProjectId(req) {
  return cleanText(req.headers.get('x-onlyevent-project') || parseCookies(req)[PROJECT_COOKIE] || '', 100);
}

export async function projectWithAccess(env, user, projectId) {
  return env.DB.prepare('SELECT p.* FROM projects p LEFT JOIN project_members m ON m.project_id=p.id AND m.user_id=? WHERE p.id=? AND (p.user_id=? OR m.user_id IS NOT NULL)').bind(user.id, projectId, user.id).first();
}

export async function projectFor(req, env, user) {
  const pid = currentProjectId(req);
  if (pid) {
    const p = await projectWithAccess(env, user, pid);
    if (!p) throw new ApiError(404, 'PROJECT_NOT_FOUND', '活动不存在');
    return p;
  }
  return await env.DB.prepare('SELECT * FROM projects WHERE user_id=? ORDER BY updated_at DESC LIMIT 1').bind(user.id).first();
}

export function projectCookie(projectId) {
  return cookie(PROJECT_COOKIE, projectId, { maxAge: 365 * 86400, httpOnly: true });
}

export function emptyProjectCookie() {
  return cookie(PROJECT_COOKIE, '', { maxAge: 0, httpOnly: true });
}

export async function ownedProject(req, env, projectId) {
  const user = await requireUser(req, env);
  const p = await env.DB.prepare('SELECT p.id,p.name FROM projects p LEFT JOIN project_state s ON s.project_id=p.id WHERE p.id=? AND p.user_id=? AND s.deleted_at IS NULL').bind(projectId, user.id).first();
  if (!p) throw new ApiError(404, 'PROJECT_NOT_FOUND', '活动不存在');
  return p;
}
