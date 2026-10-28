/* Common publishing operations for every Studio template. HTML rendering remains template-specific. */
import {ensureCloudProjectFor,createSite,updateSite} from '/v8/publisher.js?v=8.45.0';
export function downloadStudioHtml(html,name){
 const blob=new Blob([html],{type:'text/html;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=(String(name||'onlyevent').replace(/[\\/:*?"<>|]+/g,'-').trim()||'onlyevent')+'.html';
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
/* Records saved before the account API (editToken only, no cloud project) never reached a live site. */
export function hasLiveSite(publication){return !!(publication?.siteId&&publication?.cloudProjectId)}
export async function publishStudioSite({html,title,slug,templateId,localProjectId='default',publication}){
 // The cloud project is shared with project sync and image uploads for this local project.
 const cloudProjectId=await ensureCloudProjectFor({templateId,projectId:localProjectId,name:title,known:publication?.cloudProjectId});
 const payload={html,title,slug,templateId,projectId:cloudProjectId};
 const existing=hasLiveSite(publication)&&publication.cloudProjectId===cloudProjectId;
 const result=existing?await updateSite({...payload,siteId:publication.siteId}):await createSite(payload);
 if(!result.siteId)throw new Error('发布平台未返回有效站点');
 return {siteId:result.siteId,cloudProjectId,slug:result.slug||slug,url:result.url||'',publishedAt:new Date().toISOString()};
}
