/* Common publishing operations for every Studio template. HTML rendering remains template-specific. */
export function downloadStudioHtml(html,name){
 const blob=new Blob([html],{type:'text/html;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=(String(name||'onlyevent').replace(/[\\/:*?"<>|]+/g,'-').trim()||'onlyevent')+'.html';
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export async function publishStudioSite({html,title,slug,templateId,publication,createSite,updateSite}){
 const payload={html,title,slug,templateId};
 const result=publication?.siteId
  ?await updateSite({...payload,siteId:publication.siteId,editToken:publication.editToken})
  :await createSite(payload);
 if(!result.siteId||!(result.editToken||publication?.editToken))throw new Error('发布平台未返回有效站点凭证');
 return {siteId:result.siteId,editToken:result.editToken||publication?.editToken,slug:result.slug||slug,url:result.url||'',publishedAt:new Date().toISOString()};
}
