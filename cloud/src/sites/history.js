import { now, id } from '../core/ids.js';
import { projectFor } from '../projects/access.js';
import { ensureProjectState } from '../projects/lifecycle.js';

export async function markCurrentProjectPublished(req,env,u,cfg){const p=await projectFor(req,env,u);if(!p)return;await ensureProjectState(env,p.id,p.user_id);const t=now();await env.DB.prepare('UPDATE project_state SET published_at=?,published_config_json=?,updated_at=? WHERE project_id=? AND user_id=?').bind(t,JSON.stringify(cfg||{}),t,p.id,u.id).run()}

export async function archiveCurrentSiteVersion(env,site){const obj=await env.SITES.get(site.object_key);if(!obj)return;const verId=id('ver'),key=`versions/${site.id}/${Date.now()}.html`,body=await obj.arrayBuffer();await env.SITES.put(key,body,{httpMetadata:{contentType:'text/html; charset=utf-8'}});await env.DB.prepare('INSERT INTO site_versions(id,site_id,object_key,size_bytes,created_at) VALUES(?,?,?,?,?)').bind(verId,site.id,key,body.byteLength,now()).run();const {results=[]}=await env.DB.prepare('SELECT id,object_key FROM site_versions WHERE site_id=? ORDER BY created_at DESC').bind(site.id).all();for(const old of results.slice(5)){await env.SITES.delete(old.object_key);await env.DB.prepare('DELETE FROM site_versions WHERE id=?').bind(old.id).run()}}
