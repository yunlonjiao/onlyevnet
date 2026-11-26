import {readJson,writeJson} from './studio-storage.js';

const ADMIN_PROJECTS_KEY='onlyevent-admin-projects-v1';

export function upsertAdminProject({projectId,templateId,name,extra={}}){
  if(projectId==='default')return;
  const rows=readJson(ADMIN_PROJECTS_KEY,[])||[];
  const i=rows.findIndex(p=>p.id===projectId);
  const base=i>=0?rows[i]:{id:projectId,templateId};
  const next={...base,name:name||base.name||'未命名活动',templateId,updatedAt:new Date().toISOString(),...extra};
  if(i>=0)rows[i]=next;else rows.push(next);
  writeJson(ADMIN_PROJECTS_KEY,rows);
}
