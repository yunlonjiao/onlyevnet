let publisherSitesCache=[];
async function publisherApi(path,{method='GET',json:body=null}={}){
  const headers={};let payload;
  if(body!==null){headers['content-type']='application/json';payload=JSON.stringify(body)}
  const r=await fetch(path,{method,headers,body:payload,credentials:'same-origin'});
  let d={};try{d=await r.json()}catch{}
  if(!r.ok)throw new Error(d.error||`发布服务返回 ${r.status}`);
  return d;
}
function publisherMsg(id,text,type=''){const el=$(id);if(!el)return;el.textContent=text||'';el.className='publisher-message '+type;}
function normalizePublisherSlug(v){return String(v||'').trim().toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'').replace(/-+/g,'-').slice(0,50);}
function publisherCurrentSite(){return publisherSitesCache[0]||null}
function publisherSiteBySlug(slug){return publisherCurrentSite()}
function renderPublisherState(){
  const user=session.username||'主办方';
  $('#publisherSitesCard')?.classList.remove('hidden');
  if($('#publisherCurrentUser'))$('#publisherCurrentUser').textContent=user;
  if($('#publisherConnectionText'))$('#publisherConnectionText').textContent='OnlyEvent 云端已连接';
  if($('#publisherPublishBtn'))$('#publisherPublishBtn').disabled=false;
  publisherMsg('#publisherAuthMessage','当前项目与发布服务使用同一个 OnlyEvent 账号。','ok');
  updatePublisherUrlPreview();
}
function updatePublisherUrlPreview(){
  const slug=normalizePublisherSlug($('#publisherSlug')?.value||'');
  const el=$('#publisherUrlPreview');if(!el)return;
  const existing=publisherCurrentSite();
  if(existing?.url&&(!slug||slug===existing.slug))el.textContent=existing.url;
  else if(slug){const base=window.ONLYEVENT_BASE_DOMAIN||'';el.textContent=base?`https://${slug}.${base}`:`网址名称：${slug}`;}
  else el.textContent='输入网址名称，例如 event-name';
}
async function verifyPublisherSession(){
  try{const d=await publisherApi('/api/me');session.username=d.user?.username||session.username;await loadPublisherSites();renderPublisherState();}
  catch(e){publisherSitesCache=[];publisherMsg('#publisherAuthMessage',e.message,'error');if($('#publisherPublishBtn'))$('#publisherPublishBtn').disabled=true;}
}
async function loadPublisherSites(){
  try{const d=await publisherApi('/api/sites');publisherSitesCache=d.sites||[];renderPublisherSites();updatePublisherUrlPreview();}
  catch(e){publisherSitesCache=[];renderPublisherSites();publisherMsg('#publisherAuthMessage',e.message,'error');}
}
function siteStatusLabel(s){return s.status==='inactive'?'已休眠':'在线'}
async function rollbackLatestSite(site){const d=await publisherApi('/api/sites/'+encodeURIComponent(site.id)+'/versions');const v=(d.versions||[])[0];if(!v)return publisherMsg('#publisherPublishMessage','还没有可恢复的历史版本。','error');if(!confirm(`恢复到 ${new Date(v.created_at).toLocaleString()} 的线上版本？当前线上版本会自动保存为历史版本。`))return;await publisherApi('/api/sites/'+encodeURIComponent(site.id)+'/rollback/'+encodeURIComponent(v.id),{method:'POST'});await loadPublisherSites();publisherMsg('#publisherPublishMessage','线上网站已恢复到上一版；当前编辑草稿没有改变。','ok');if($('#publishStateBadge')){$('#publishStateBadge').textContent='有未发布修改';$('#publishStateBadge').className='badge'}}
function renderPublisherSites(){
  const box=$('#publisherSiteList');if(!box)return;
  if(!publisherSitesCache.length){box.innerHTML='<div class="publisher-empty">这个账号还没有发布网站。</div>';return}
  box.innerHTML=publisherSitesCache.map(s=>`<article class="publisher-site-row"><div><b>${esc(s.title||s.slug)}</b><a href="${escAttr(s.url)}" target="_blank" rel="noopener">${esc(s.url)}</a><small>${siteStatusLabel(s)} · 最近更新：${esc(new Date(s.updated_at).toLocaleString())}</small></div><div class="publisher-site-actions"><button class="secondary compact" data-publisher-use="${escAttr(s.id)}">当前网站</button><button class="secondary compact" data-publisher-rollback="${escAttr(s.id)}">恢复线上上一版</button><button class="danger compact" data-publisher-delete="${escAttr(s.id)}">删除</button></div></article>`).join('');
  $$('[data-publisher-use]').forEach(btn=>btn.onclick=()=>{const s=publisherSitesCache.find(x=>x.id===btn.dataset.publisherUse);if(!s)return;$('#publisherSlug').value=s.slug;updatePublisherUrlPreview();publisherMsg('#publisherPublishMessage','已选择这个网站。更改网址后，旧地址会自动跳转到新地址。');const main=$('#publisherPublishBtn');if(main)main.textContent='发布更新';});
  $$('[data-publisher-rollback]').forEach(btn=>btn.onclick=async()=>{const s=publisherSitesCache.find(x=>x.id===btn.dataset.publisherRollback);if(!s)return;try{await rollbackLatestSite(s)}catch(e){publisherMsg('#publisherPublishMessage',e.message,'error')}});
  $$('[data-publisher-delete]').forEach(btn=>btn.onclick=async()=>{const s=publisherSitesCache.find(x=>x.id===btn.dataset.publisherDelete);if(!s||!confirm(`确定删除 ${s.url}？`))return;try{await publisherApi('/api/sites/'+encodeURIComponent(s.id),{method:'DELETE'});await loadPublisherSites();publisherMsg('#publisherPublishMessage','网站已删除。','ok')}catch(e){publisherMsg('#publisherPublishMessage',e.message,'error')}});
}
async function publisherPublishCurrent(){
  const btn=$('#publisherPublishBtn'),slug=normalizePublisherSlug($('#publisherSlug')?.value||'');
  if(slug.length<3)return publisherMsg('#publisherPublishMessage','网址名称至少 3 个字符。','error');
  const old=btn?.textContent||'一键发布网站';if(btn){btn.disabled=true;btn.textContent='正在生成并上传…'}
  try{
    publisherMsg('#publisherPublishMessage','正在生成完整游客网站…');
    const siteHtml=await buildStandaloneVisitorHtml(),existing=publisherCurrentSite(),title=config.eventName||slug;
    const d=existing?await publisherApi('/api/sites/'+encodeURIComponent(existing.id),{method:'PUT',json:{slug,title,html:siteHtml}}):await publisherApi('/api/sites',{method:'POST',json:{slug,title,html:siteHtml}});
    const site=d.site;if(site?.url){config.visitorSiteUrl=site.url;if($('#visitorSiteUrl'))$('#visitorSiteUrl').value=site.url;updatePortalLinksFromConfig();markSaved('已发布');publisherMsg('#publisherPublishMessage',`${existing?'更新':'发布'}成功：${site.url}`,'ok');toast(existing?'网站已更新':'网站发布成功');if($('#publishStateBadge')){$('#publishStateBadge').textContent='已发布';$('#publishStateBadge').className='badge published';}}
    await loadPublisherSites();
  }catch(e){publisherMsg('#publisherPublishMessage',e.message,'error')}
  finally{if(btn){btn.disabled=false;btn.textContent=publisherCurrentSite()?'发布更新':'发布网站'}}
}
if($('#publisherPublishBtn'))$('#publisherPublishBtn').onclick=publisherPublishCurrent;
if($('#publisherSlug'))$('#publisherSlug').addEventListener('input',()=>{const el=$('#publisherSlug');el.value=normalizePublisherSlug(el.value);updatePublisherUrlPreview();const s=publisherCurrentSite();if($('#publisherPublishBtn'))$('#publisherPublishBtn').textContent=s?'发布更新':'发布网站'});
verifyPublisherSession();

if($('#goPublishCenter'))$('#goPublishCenter').onclick=()=>setTab('publish');
