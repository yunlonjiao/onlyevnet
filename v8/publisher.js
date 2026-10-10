export const PUBLISHER_ORIGIN='https://convention-publisher.onlyevents.workers.dev';

const jsonHeaders=token=>({
  'Content-Type':'application/json',
  ...(token?{'Authorization':'Bearer '+token,'X-Edit-Token':token}:{})
});

async function readJson(response){
  const text=await response.text();
  let data={};
  try{data=text?JSON.parse(text):{}}catch{data={message:text}}
  if(!response.ok){
    const error=new Error(data?.error||data?.message||('发布服务返回 '+response.status));
    error.status=response.status;
    error.data=data;
    throw error;
  }
  return data;
}

function normalizeResult(data,{slug,editToken}={}){
  const siteId=data?.siteId||data?.id||data?.site?.id||'';
  const nextSlug=data?.slug||data?.site?.slug||slug||'';
  const token=data?.editToken||data?.token||data?.site?.editToken||editToken||'';
  const url=data?.url||data?.siteUrl||data?.publicUrl||data?.site?.url||(nextSlug?'https://'+nextSlug+'.onlyevent.cn':'');
  return {siteId,slug:nextSlug,editToken:token,url,raw:data};
}

export function cleanSlug(value){
  return String(value||'')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//,'')
    .replace(/\.onlyevent\.cn.*$/,'')
    .replace(/[^a-z0-9-]+/g,'-')
    .replace(/-+/g,'-')
    .replace(/^-|-$/g,'')
    .slice(0,63);
}

export function suggestSlug(eventName,date=''){
  const fromName=cleanSlug(eventName);
  if(fromName.length>=3)return fromName;
  const datePart=String(date||'').replace(/\D/g,'').slice(0,8);
  return 'event'+(datePart?'-'+datePart:'');
}

export function isValidSlug(value){
  const slug=cleanSlug(value);
  return slug.length>=3&&slug.length<=63&&/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(slug);
}

export async function createSite({html,title,slug,templateId}){
  const response=await fetch(PUBLISHER_ORIGIN+'/api/sites',{
    method:'POST',
    headers:jsonHeaders(),
    body:JSON.stringify({html,title,slug,templateId})
  });
  return normalizeResult(await readJson(response),{slug});
}

export async function updateSite({siteId,editToken,html,title,slug,templateId}){
  if(!siteId)throw new Error('缺少已发布站点 ID');
  if(!editToken)throw new Error('缺少站点编辑凭证，请重新发布为新站点');
  const response=await fetch(PUBLISHER_ORIGIN+'/api/sites/'+encodeURIComponent(siteId),{
    method:'PUT',
    headers:jsonHeaders(editToken),
    body:JSON.stringify({html,title,slug,templateId,editToken})
  });
  return normalizeResult(await readJson(response),{slug,editToken});
}
