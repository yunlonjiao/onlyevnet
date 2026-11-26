export async function stageKeys(env,siteId){const {results=[]}=await env.DB.prepare('SELECT object_key FROM site_stages WHERE site_id=?').bind(siteId).all();return results.map(r=>r.object_key)}

export async function deleteSiteResources(env,site){
  if(!site)return;if(site.object_key)await env.SITES.delete(site.object_key);
  const {results=[]}=await env.DB.prepare('SELECT object_key FROM site_versions WHERE site_id=?').bind(site.id).all();for(const v of results)if(v.object_key)await env.SITES.delete(v.object_key);
  for(const k of await stageKeys(env,site.id))await env.SITES.delete(k);
}
