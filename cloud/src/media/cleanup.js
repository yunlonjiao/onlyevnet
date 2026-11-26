import { mediaKeysFromValue } from './keys.js';

export async function deleteProjectMedia(env,userId,projectId,cfg){
  const keys=mediaKeysFromValue(cfg||{}),tracked=await env.DB.prepare('SELECT object_key FROM project_media WHERE project_id=?').bind(projectId).all();for(const r of tracked.results||[])keys.add(r.object_key);
  for(const key of keys){const ref=await env.DB.prepare('SELECT 1 AS x FROM project_media WHERE object_key=? AND project_id<>? LIMIT 1').bind(key,projectId).first();if(ref)continue;const other=await env.DB.prepare('SELECT 1 AS x FROM projects WHERE user_id=? AND id<>? AND instr(config_json,?)>0 LIMIT 1').bind(userId,projectId,key).first();if(!other)await env.SITES.delete(key)}
}
