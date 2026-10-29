import {makeProjectBackup,restoreProjectBackup} from '/admin/project-backup.js';
import {listTemplates,DEFAULT_TEMPLATE_ID,getTemplate} from '/v8/templates/registry.js?v=8.41.5';
import {deleteSite,readCloudSession,loginAccount,registerAccount,recoverAccount,fetchAccount,logoutAccount,listCloudProjects,loadCloudConfig,deleteCloudProject,restoreCloudProject,purgeCloudProject,getCloudProjectId,setCloudProjectId,getCloudSite,ensureCloudProjectFor,saveCloudConfig,changeAccountPassword,rotateRecoveryCode,getCollect,manageCollect,setCollectEntryStatus,deleteCollectEntry,collectLink,cloudMediaUrl} from '/v8/publisher.js?v=8.47.0';

const $=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
const PROJECTS_KEY='onlyevent-admin-projects-v1';
// Short Chinese tags for the template gallery (the internal art-direction names stay English).
const TEMPLATE_TAGS={'01-ip-only':'活泼 · 贴纸','02-scrapbook':'手账 · 叙事','03-creator-market':'社区 · 内容流','04-creator-catalogue':'二次元 · 电子场刊'};
const templateTag=t=>TEMPLATE_TAGS[t.id]||'';
let selectedTemplateId=DEFAULT_TEMPLATE_ID;
let projects=readProjects();

function readProjects(){
  try{return JSON.parse(localStorage.getItem(PROJECTS_KEY)||'[]')||[]}catch{return []}
}
function writeProjects(next){projects=next;localStorage.setItem(PROJECTS_KEY,JSON.stringify(projects))}
function uid(){return 'oe-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7)}
function formatTime(value){
  const d=value?new Date(value):new Date();
  return new Intl.DateTimeFormat('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(d);
}
function studioUrl(project){
  const q=new URLSearchParams({template:project.templateId||DEFAULT_TEMPLATE_ID,project:project.id});
  if(project.name)q.set('name',project.name);
  return '/v8/?'+q.toString();
}
function publishStorageKey(project){
  return 'onlyevent-studio-publish:'+(project.templateId||DEFAULT_TEMPLATE_ID)+':'+project.id+':iframe';
}
function projectStorageKey(project){
  return 'onlyevent-studio-v8:'+(project.templateId||DEFAULT_TEMPLATE_ID)+':'+project.id+':iframe';
}
function getPublishRecord(project){
  try{return JSON.parse(localStorage.getItem(publishStorageKey(project))||'{}')||{}}catch{return {}}
}
function clearProjectLocalData(project){
  localStorage.removeItem(projectStorageKey(project));
  localStorage.removeItem(publishStorageKey(project));
}
async function unpublishProject(project){
  const record=getPublishRecord(project);
  if(!record.siteId||!record.cloudProjectId){
    alert('这个已发布网站缺少云端项目记录，暂时不能安全删除线上站点。');
    return false;
  }
  if(!confirm('确定下线这个游客网站？\n下线后公开链接将不可访问，项目内容仍会保留。'))return false;
  try{
    await deleteSite({siteId:record.siteId,projectId:record.cloudProjectId});
    localStorage.removeItem(publishStorageKey(project));
    writeProjects(projects.map(p=>p.id===project.id?{...p,siteUrl:'',status:'draft',updatedAt:new Date().toISOString()}:p));
    renderProjects($('#projectSearch').value);
    return true;
  }catch(error){
    alert('下线失败：'+(error?.message||'Publisher 暂未启用删除接口'));
    return false;
  }
}
/* ---- recycle bin, duplicate and batch actions ---- */
const TRASH_KEY='onlyevent-admin-trash-v1',TRASH_DAYS=30,DAY_MS=86400000;
function readTrash(){try{return JSON.parse(localStorage.getItem(TRASH_KEY)||'[]')||[]}catch{return []}}
let trash=readTrash();
function writeTrash(next){trash=next;localStorage.setItem(TRASH_KEY,JSON.stringify(trash));renderBinBadge()}
const cloudIdOf=project=>project.cloudProjectId||getCloudProjectId(project.templateId||DEFAULT_TEMPLATE_ID,project.id)||'';
function daysLeft(project){return Math.max(0,TRASH_DAYS-Math.floor((Date.now()-(Date.parse(project.deletedAt)||Date.now()))/DAY_MS))}
function renderBinBadge(){const badge=$('#binCount');if(!badge)return;badge.hidden=!trash.length;badge.textContent=String(trash.length)}
let selectMode=false,visibleIds=[];
const selected=new Set(),binSelected=new Set();
const currentSearch=()=>$('#projectSearch')?.value||'';
function updateSelectBar(){
  $('#projectSelectBar').hidden=!selectMode;
  $('#selectedCount').textContent=String(selected.size);
  $('#bulkDuplicateBtn').disabled=!selected.size;$('#bulkTrashBtn').disabled=!selected.size;
  $('#selectAllProjects').checked=!!visibleIds.length&&visibleIds.every(id=>selected.has(id));
  $('#selectModeBtn').textContent=selectMode?'退出批量管理':'批量管理';
}
// A published site has to go offline before its project can be deleted; its content is kept.
async function takeSiteOffline(project){
  const record=getPublishRecord(project);
  if(!record.siteId||!record.cloudProjectId)return false;
  try{await deleteSite({siteId:record.siteId,projectId:record.cloudProjectId});localStorage.removeItem(publishStorageKey(project));return true}
  catch{return false}
}
async function moveToTrash(list){
  if(!list.length)return;
  const published=list.filter(p=>p.siteUrl).length;
  const ask='把 '+list.length+' 个活动移入回收站？'+(published?'\n其中 '+published+' 个已发布，网站会先下线，游客暂时打不开。':'')+'\n30 天内可以在回收站恢复，内容不会丢。';
  if(!confirm(ask))return;
  const moved=[],skipped=[];
  for(const project of list){
    if(project.siteUrl&&!(await takeSiteOffline(project))){skipped.push(project.name||'未命名活动');continue}
    moved.push(project);
  }
  if(moved.length){
    const ids=new Set(moved.map(p=>p.id)),when=new Date().toISOString();
    writeTrash([...moved.map(p=>({...p,siteUrl:'',status:'draft',deletedAt:when,cloudProjectId:cloudIdOf(p)||undefined})),...trash]);
    writeProjects(projects.filter(p=>!ids.has(p.id)));
    // Without this the project would come back from the cloud on the next sign-in.
    if(readCloudSession())for(const p of moved){const cid=cloudIdOf(p);if(cid)deleteCloudProject(cid).catch(()=>{})}
  }
  selected.clear();renderProjects(currentSearch());
  if(skipped.length)alert('这些活动没能移入回收站，因为网站没能下线（缺少发布记录，或网络出错）：\n'+skipped.join('、')+'\n请登录发布它们的账号，或稍后再试。');
}
async function restoreFromTrash(list){
  if(!list.length)return;
  const ids=new Set(list.map(p=>p.id)),now=new Date().toISOString();
  writeProjects([...projects,...list.map(({deletedAt,...p})=>({...p,status:'draft',siteUrl:'',updatedAt:now}))]);
  writeTrash(trash.filter(p=>!ids.has(p.id)));
  if(readCloudSession())for(const p of list){if(p.cloudProjectId)restoreCloudProject(p.cloudProjectId).catch(()=>{})}
  binSelected.clear();renderBin();renderProjects(currentSearch());
}
function purgeLocalData(project){clearProjectLocalData(project);setCloudProjectId(project.templateId||DEFAULT_TEMPLATE_ID,project.id,'')}
function purgeFromTrash(list,{ask=true}={}){
  if(!list.length)return;
  if(ask&&!confirm('永久删除 '+list.length+' 个活动？\n内容和上传的图片都会一起删掉，找不回来。'))return;
  const ids=new Set(list.map(p=>p.id));
  for(const p of list){purgeLocalData(p);if(p.cloudProjectId&&readCloudSession())purgeCloudProject(p.cloudProjectId).catch(()=>{})}
  writeTrash(trash.filter(p=>!ids.has(p.id)));binSelected.clear();renderBin();
}
function purgeExpiredTrash(){purgeFromTrash(trash.filter(p=>p.deletedAt&&daysLeft(p)<=0),{ask:false})}
async function duplicateProjects(list){
  const made=[];
  for(const project of list){
    const templateId=project.templateId||DEFAULT_TEMPLATE_ID,id=uid();
    const name=(String(project.name||'未命名活动')+' 副本').slice(0,80);
    let state=null;try{state=JSON.parse(localStorage.getItem(projectStorageKey(project))||'null')}catch{}
    if(state&&typeof state==='object'){
      state={...state,projectId:id,templateId,eventName:name};
      try{localStorage.setItem('onlyevent-studio-v8:'+templateId+':'+id+':iframe',JSON.stringify(state))}
      catch{alert('浏览器存储空间不足，没能复制「'+(project.name||'未命名活动')+'」。');continue}
    }
    made.push({project:{id,name,templateId,status:'draft',siteUrl:'',updatedAt:new Date().toISOString()},state});
  }
  if(!made.length)return 0;
  writeProjects([...projects,...made.map(m=>m.project)]);
  selected.clear();renderProjects(currentSearch());
  // Keep the copy in the cloud right away so deleting the original later cannot take shared images with it.
  if(readCloudSession())for(const {project,state} of made){
    if(state)ensureCloudProjectFor({templateId:project.templateId,projectId:project.id,name:project.name}).then(cid=>saveCloudConfig({projectId:cid,config:state})).catch(()=>{});
  }
  return made.length;
}
function renderBin(){
  const grid=$('#binGrid');grid.innerHTML='';
  $('#emptyBin').hidden=trash.length>0;
  [...trash].sort((a,b)=>String(b.deletedAt||'').localeCompare(String(a.deletedAt||''))).forEach(project=>{
    const frag=$('#binCardTemplate').content.cloneNode(true),card=frag.querySelector('.bin-card');
    card.dataset.projectId=project.id;
    card.querySelector('.project-card-title b').textContent=project.name||'未命名活动';
    card.querySelector('.project-card-title span').textContent='还剩 '+daysLeft(project)+' 天自动清除';
    card.querySelector('.project-template').textContent=getTemplate(project.templateId)?.label||project.templateId||'模板';
    card.querySelector('.project-time').textContent='删除于 '+formatTime(project.deletedAt);
    const input=card.querySelector('.select-project');input.checked=binSelected.has(project.id);card.classList.toggle('is-selected',input.checked);
    input.onchange=()=>{input.checked?binSelected.add(project.id):binSelected.delete(project.id);card.classList.toggle('is-selected',input.checked);updateBinBar()};
    card.querySelector('.restore-project').onclick=()=>restoreFromTrash([project]);
    card.querySelector('.purge-project').onclick=()=>purgeFromTrash([project]);
    grid.appendChild(frag);
  });
  updateBinBar();
}
function updateBinBar(){
  for(const id of [...binSelected])if(!trash.some(p=>p.id===id))binSelected.delete(id);
  $('#binSelectedCount').textContent=String(binSelected.size);
  $('#binRestoreBtn').disabled=!binSelected.size;$('#binPurgeBtn').disabled=!binSelected.size;
  $('#binEmptyBtn').hidden=!trash.length;
  $('#selectAllBin').checked=!!trash.length&&trash.every(p=>binSelected.has(p.id));
}
/* ---- circle collection ---- */
let collectCloudId='',collectForm=null,collectEntries=[];
const collectProject=()=>projects.find(p=>p.id===$('#collectProject').value)||null;
function collectMsg(text,kind){authSetMessage('collectMessage',text,kind||'')}
function renderCollectProjects(){
  const select=$('#collectProject'),keep=select.value;
  select.innerHTML=projects.map(p=>'<option value="'+p.id+'">'+String(p.name||'未命名活动').replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'})[c])+'</option>').join('');
  if(keep&&projects.some(p=>p.id===keep))select.value=keep;
}
async function loadCollect(){
  const project=collectProject();
  $('#collectSetup').hidden=true;$('#collectLinkBox').hidden=true;$('#collectList').innerHTML='';$('#collectEmpty').hidden=true;collectMsg('');
  collectCloudId='';collectForm=null;collectEntries=[];
  if(!project){collectMsg('还没有活动，先去「模板库」新建一个。');return}
  if(!readCloudSession()){collectMsg('请先登录主办方账号。');return}
  try{
    collectCloudId=await ensureCloudProjectFor({templateId:project.templateId||DEFAULT_TEMPLATE_ID,projectId:project.id,name:project.name});
    const data=await getCollect(collectCloudId);collectForm=data.form;collectEntries=data.entries||[];
  }catch(err){collectMsg(authNetworkMessage(err),'error');return}
  renderCollect();
}
function renderCollect(){
  const form=collectForm;
  $('#collectSetup').hidden=!!form;$('#collectLinkBox').hidden=!form;
  if(form){
    $('#collectLinkInput').value=collectLink(form.token);
    $('#collectState').textContent=form.open?'收集中':'已关闭';$('#collectState').classList.toggle('off',!form.open);
    $('#collectToggle').textContent=form.open?'关闭收集':'重新开启';
  }
  const list=$('#collectList');list.innerHTML='';
  $('#collectEmpty').hidden=!form||collectEntries.length>0;
  const label={pending:'待审核',approved:'已加入摊位',rejected:'未通过'};
  const pending=collectEntries.filter(e=>e.status==='pending').length,badge=$('#collectCount');
  badge.hidden=!pending;badge.textContent=String(pending);
  collectEntries.forEach(entry=>{
    const d=entry.data||{},frag=$('#collectEntryTemplate').content.cloneNode(true),card=frag.querySelector('.collect-entry');
    card.classList.add('is-'+entry.status);
    card.querySelector('.collect-title b').textContent=d.name||'未命名社团';
    card.querySelector('.collect-title small').textContent=[d.type,formatTime(entry.createdAt)].filter(Boolean).join(' · ');
    card.querySelector('.collect-pill').textContent=label[entry.status]||entry.status;
    if(d.logo)card.querySelector('.collect-logo').style.backgroundImage='url("'+cloudMediaUrl(d.logo)+'")';
    card.querySelector('.collect-intro').textContent=d.intro||'（没有填写介绍）';
    card.querySelector('.collect-contact').textContent='联系方式：'+(d.contact||'—');
    const products=card.querySelector('.collect-products');
    (d.products||[]).forEach(p=>{
      const item=document.createElement('div');item.className='collect-product';
      const img=document.createElement('i');if(p.image)img.style.backgroundImage='url("'+cloudMediaUrl(p.image)+'")';
      const name=document.createElement('b');name.textContent=p.name;
      const price=document.createElement('span');price.textContent=p.price||'';
      item.append(img,name,price);products.appendChild(item);
    });
    card.querySelector('.approve').onclick=()=>approveEntry(entry,card.querySelector('.collect-no input').value.trim());
    card.querySelector('.reject').onclick=()=>changeEntry(entry,'rejected');
    card.querySelector('.remove').onclick=async()=>{if(!confirm('删除这条提交？删除后找不回来。'))return;try{await deleteCollectEntry(collectCloudId,entry.id);collectEntries=collectEntries.filter(e=>e.id!==entry.id);renderCollect()}catch(err){collectMsg(authNetworkMessage(err),'error')}};
    if(entry.status==='rejected'){const back=document.createElement('button');back.type='button';back.className='quiet';back.textContent='恢复待审';back.onclick=()=>changeEntry(entry,'pending');card.querySelector('.collect-ops').prepend(back)}
    list.appendChild(frag);
  });
}
async function changeEntry(entry,status){
  try{await setCollectEntryStatus(collectCloudId,entry.id,status);entry.status=status;renderCollect()}
  catch(err){collectMsg(authNetworkMessage(err),'error')}
}
// The approved entry becomes a normal booth in the project, so every template shows it the same way.
async function approveEntry(entry,no){
  const project=collectProject();if(!project)return;
  const d=entry.data||{},key=projectStorageKey(project);
  let state=null;try{state=JSON.parse(localStorage.getItem(key)||'null')}catch{}
  try{if(!state)state=await loadCloudConfig(collectCloudId)}catch(err){collectMsg(authNetworkMessage(err),'error');return}
  if(!state||typeof state!=='object'){collectMsg('这个活动还没有保存过内容，请先打开编辑器保存一次。','error');return}
  const booth={id:uid(),no,name:d.name||'',logo:cloudMediaUrl(d.logo||''),type:d.type||'',intro:d.intro||'',products:(d.products||[]).map(p=>({id:uid(),name:p.name||'',tag:'',price:p.price||'',note:p.note||'',image:cloudMediaUrl(p.image||'')}))};
  state.booths=[...(Array.isArray(state.booths)?state.booths:[]),booth];
  try{localStorage.setItem(key,JSON.stringify(state))}catch{collectMsg('浏览器存储空间不足，没能加入摊位。','error');return}
  try{await saveCloudConfig({projectId:collectCloudId,config:state})}catch{}
  await changeEntry(entry,'approved');
  collectMsg('已把「'+booth.name+'」加入摊位列表'+(no?'，摊位号 '+no:'')+'。回到编辑器可以继续调整，改完记得更新网站。','ok');
}
function renderSettings(){
  $('#settingsUsername').textContent=readCloudSession()?.username||'';
  $('#newRecoveryBox').hidden=true;authSetMessage('changePasswordMessage','');authSetMessage('rotateRecoveryMessage','');
}
/* Projects saved in the cloud on another device appear here after signing in. */
async function restoreCloudProjects(){
  if(!readCloudSession())return;
  let remote=[];
  try{remote=await listCloudProjects()}catch{return}
  // Projects sitting in the local recycle bin must not be restored from the cloud again.
  const known=new Set([...projects,...trash].map(p=>p.cloudProjectId||getCloudProjectId(p.templateId||DEFAULT_TEMPLATE_ID,p.id)).filter(Boolean));
  const templateIds=new Set(listTemplates().map(t=>t.id));
  const added=[];
  // The site's ID lives in the browser that published it; rebuild the record so this device can update or unpublish it.
  const restorePublication=async item=>{
    if(!item.visitorSiteUrl||!templateIds.has(item.templateId))return;
    const key='onlyevent-studio-publish:'+item.templateId+':'+(projects.find(p=>(p.cloudProjectId||getCloudProjectId(p.templateId||DEFAULT_TEMPLATE_ID,p.id))===item.id)?.id||item.id)+':iframe';
    try{if(JSON.parse(localStorage.getItem(key)||'{}').siteId)return}catch{}
    try{
      const site=await getCloudSite(item.id);
      if(site)localStorage.setItem(key,JSON.stringify({siteId:site.id,cloudProjectId:item.id,slug:site.slug,url:site.url,publishedAt:site.updated_at}));
    }catch{}
  };
  for(const item of remote){
    if(known.has(item.id)||projects.some(p=>p.id===item.id))await restorePublication(item);
    // Cloud projects without a template are publish-only shells made before project sync existed.
    if(!item.templateId||!templateIds.has(item.templateId)||known.has(item.id)||projects.some(p=>p.id===item.id))continue;
    try{
      const config=await loadCloudConfig(item.id);
      if(!config||typeof config!=='object')continue;
      localStorage.setItem('onlyevent-studio-v8:'+item.templateId+':'+item.id+':iframe',JSON.stringify({...config,projectId:item.id,templateId:item.templateId}));
      setCloudProjectId(item.templateId,item.id,item.id);
      await restorePublication(item);
      added.push({id:item.id,name:item.name||config.eventName||'未命名活动',templateId:item.templateId,status:item.visitorSiteUrl?'published':'draft',siteUrl:item.visitorSiteUrl||'',updatedAt:item.updatedAt,cloudProjectId:item.id});
    }catch{}
  }
  if(added.length){writeProjects([...projects,...added]);renderProjects($('#projectSearch').value)}
}
function migrateLegacyProject(){
  if(projects.length)return;
  let state=null;
  for(const key of ['onlyevent-studio-v8:01-ip-only:iframe','onlyevent-studio-v8:01:iframe']){
    try{const raw=localStorage.getItem(key);if(raw){state=JSON.parse(raw);break}}catch{}
  }
  if(!state)return;
  const id='legacy-ip-only',templateId=state.templateId||DEFAULT_TEMPLATE_ID;
  const migrated={id,name:state.eventName||'STARDUST ONLY',templateId,status:'draft',updatedAt:new Date().toISOString(),legacy:true};
  localStorage.setItem('onlyevent-studio-v8:'+templateId+':'+id+':iframe',JSON.stringify({...state,projectId:id,templateId}));
  const oldPublish=localStorage.getItem('onlyevent-studio-publish:'+templateId+':iframe');
  if(oldPublish)localStorage.setItem('onlyevent-studio-publish:'+templateId+':'+id+':iframe',oldPublish);
  writeProjects([migrated]);
}
migrateLegacyProject();projects=readProjects();

function renderTemplates(){
  const templates=listTemplates(),grid=$('#templateGrid');grid.innerHTML='';
  templates.forEach((template,index)=>{
    const card=document.createElement('article');
    card.className='template-card template-art-'+String(template.artDirection||'default').replace(/[^a-z0-9-]/gi,'')+(template.eventType==='creator-market'?' template-market-preview':'');
    card.dataset.templateId=template.id;
    const coverFile=template.id==='01-ip-only'?'template-01.png':template.id==='02-scrapbook'?'template-02.png':template.id==='03-creator-market'?'template-03.png':template.id==='04-creator-catalogue'?'template-04.png':'';
    const marketUrl='';
    card.innerHTML='<div class="template-preview"><div class="template-preview-window"><span class="bar"></span><div class="hero"><b>STAR<br>DUST<br>ONLY</b><span class="art"></span><em>'+String(template.structureProfile||'portal').toUpperCase()+'</em></div><div class="rows"><i></i><i></i><i></i></div></div>'+(coverFile?'<img class="template-real-cover" src="/admin/covers/'+coverFile+'" alt="'+template.name+' 真实网页首屏截图" loading="lazy" onerror="this.remove()">':'')+(marketUrl?'<iframe class="market-thumbnail" src="'+marketUrl+'" title="模板视觉预览" tabindex="-1" loading="lazy" aria-hidden="true"></iframe>':'')+'</div>'+
      '<div class="template-card-body"><span>模板 '+String(index+1).padStart(2,'0')+'</span><h2>'+template.label+'</h2><p>'+template.description+'</p><div class="template-card-footer"><span class="template-tag">'+templateTag(template)+'</span><button class="use-template" data-template="'+template.id+'" type="button">使用此模板</button></div></div>';
    grid.appendChild(card);
  });

}
function renderProjects(filter=''){
  const term=filter.trim().toLocaleLowerCase(),grid=$('#projectGrid'),empty=$('#emptyProjects');
  grid.innerHTML='';
  const visible=projects.filter(p=>!term||String(p.name||'').toLocaleLowerCase().includes(term));
  visibleIds=visible.map(p=>p.id);
  $('#projectCount').textContent=String(projects.length);
  empty.hidden=projects.length>0;
  visible.sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||''))).forEach(project=>{
    const frag=$('#projectCardTemplate').content.cloneNode(true),card=frag.querySelector('.project-card');
    const status=project.siteUrl?'published':'draft';
    card.dataset.projectId=project.id;
    card.classList.toggle('is-selected',selected.has(project.id));
    const pick=card.querySelector('.card-select'),pickInput=pick.querySelector('input');
    pick.hidden=!selectMode;pickInput.checked=selected.has(project.id);
    pickInput.onchange=()=>{pickInput.checked?selected.add(project.id):selected.delete(project.id);card.classList.toggle('is-selected',pickInput.checked);updateSelectBar()};
    card.querySelector('.duplicate-project').onclick=async()=>{await duplicateProjects([project])};
    card.querySelector('.project-card-title b').textContent=project.name||'未命名活动';
    card.querySelector('.project-card-title span').textContent=project.siteUrl||'尚未发布游客网站';
    card.querySelector('.project-template').textContent=getTemplate(project.templateId)?.label||project.templateId||'模板';
    card.querySelector('.project-time').textContent='更新 '+formatTime(project.updatedAt);
    const st=card.querySelector('.project-status');st.textContent=status==='published'?'已发布':'草稿';st.classList.toggle('published',status==='published');
    card.querySelector('.edit-project').onclick=()=>location.href=studioUrl(project);
    const open=card.querySelector('.open-site'),unpublish=card.querySelector('.unpublish-site');
    if(project.siteUrl){
      open.hidden=false;open.href=project.siteUrl;unpublish.hidden=false;
      open.addEventListener('click',e=>{
        e.preventDefault();
        const url=String(project.siteUrl||'').trim();
        if(!/^https?:\/\//i.test(url)){alert('这个项目没有有效的游客网站地址。');return}
        const win=window.open(url,'_blank','noopener');
        if(!win)location.href=url;
      });
    }
    unpublish.onclick=()=>unpublishProject(project);
    card.querySelector('.delete-project').onclick=()=>moveToTrash([project]);
    grid.appendChild(frag);
  });
  if(!visible.length&&projects.length){grid.innerHTML='<div class="empty-projects" style="grid-column:1/-1"><b>没有找到匹配项目</b><p>换一个关键词试试。</p></div>'}
  updateSelectBar();
}
function showPage(name){
  qa('[data-admin-page]').forEach(b=>b.classList.toggle('active',b.dataset.adminPage===name));
  qa('[data-page-panel]').forEach(p=>{const on=p.dataset.pagePanel===name;p.hidden=!on;p.classList.toggle('active',on)});
  if(name==='bin')renderBin();
  if(name==='collect'){renderCollectProjects();loadCollect()}
  if(name==='settings')renderSettings();
}
function openCreate(templateId=DEFAULT_TEMPLATE_ID){
  selectedTemplateId=templateId;
  const t=getTemplate(templateId);
  $('#selectedTemplateCard').innerHTML='<span class="thumb thumb-'+String(t.artDirection||'default').replace(/[^a-z0-9-]/gi,'')+'"></span><div><b>'+t.label+'</b><span>'+templateTag(t)+'</span></div>';
  $('#createProjectName').value=getTemplate(selectedTemplateId).defaults.eventName||'STARDUST ONLY';
  $('#createDialog').showModal();
  setTimeout(()=>$('#createProjectName').focus(),0);
}
function createProject(name){
  const project={id:uid(),name:name.trim()||'未命名活动',templateId:selectedTemplateId,status:'draft',updatedAt:new Date().toISOString(),siteUrl:''};
  writeProjects([...projects,project]);
  location.href=studioUrl(project);
}
qa('[data-admin-page]').forEach(b=>b.onclick=()=>showPage(b.dataset.adminPage));
for(const id of ['newProjectHeroBtn','emptyCreateBtn'])$('#'+id).onclick=()=>showPage('templates');
$('#templateGrid').addEventListener('click',e=>{const b=e.target.closest('[data-template]');if(b)openCreate(b.dataset.template)});
$('#createCancel').onclick=()=>$('#createDialog').close();
$('#createForm').addEventListener('submit',e=>{e.preventDefault();createProject($('#createProjectName').value)});
$('#projectSearch').addEventListener('input',e=>renderProjects(e.target.value));

$('#exportProjectBackupBtn').addEventListener('click',()=>{
 if(!projects.length){alert('目前还没有活动项目可备份。');return}
 const includePublisherCredentials=$('#includePublisherCredentials').checked;
 if(includePublisherCredentials&&!confirm('备份文件将包含已发布网站的管理记录。导入后仍需登录同一主办方账号才能更新或下线网站。确认导出？'))return;
 try{
  const data=makeProjectBackup(projects,localStorage,{includePublisherCredentials});
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'});
  const url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download='onlyevent-projects-'+new Date().toISOString().slice(0,10)+'.json';
  document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
 }catch(error){alert('导出失败：'+(error?.message||error))}
});
$('#importProjectBackupBtn').addEventListener('click',()=>$('#importProjectBackupFile').click());
$('#importProjectBackupFile').addEventListener('change',async e=>{
 const file=e.target.files?.[0];e.target.value='';
 if(!file)return;
 if(file.size>60*1024*1024){alert('备份文件超过 60MB，请先检查文件。');return}
 try{
  const data=JSON.parse(await file.text());
  const count=data?.records?.length;
  if(!Number.isInteger(count))throw new Error('文件缺少活动项目清单');
  const detail=data.containsPublisherCredentials
   ?'此备份包含已发布网站的管理记录；登录发布该网站的主办方账号后即可继续更新。'
   :'不包含发布记录的项目将作为草稿导入，不会自动连接或替换线上网站。';
  if(!confirm('从备份导入 '+count+' 个活动项目到当前浏览器？\n不会覆盖已有项目；重复 ID 将自动重命名。\n'+detail))return;
  const result=restoreProjectBackup(data,localStorage,{
   existingProjects:projects,
   allowedTemplateIds:listTemplates().map(template=>template.id),
   makeId:uid
  });
  projects=result.projects;
  renderProjects($('#projectSearch').value);
  showPage('projects');
  alert('已导入 '+result.added.length+' 个项目'+(result.credentialsRestored?'，其中 '+result.credentialsRestored+' 个包含网站发布管理凭证':'')+'。请进入 Studio 核对页面数据。');
 }catch(error){alert('导入失败：'+(error?.message||error))}
});
renderTemplates();renderProjects();
purgeExpiredTrash();renderBinBadge();
$('#selectModeBtn').onclick=()=>{selectMode=!selectMode;selected.clear();renderProjects(currentSearch())};
$('#selectAllProjects').onchange=e=>{visibleIds.forEach(id=>e.target.checked?selected.add(id):selected.delete(id));renderProjects(currentSearch())};
$('#bulkDuplicateBtn').onclick=async()=>{const n=await duplicateProjects(projects.filter(p=>selected.has(p.id)));if(n)alert('已复制 '+n+' 个活动，名字后面加了「副本」。')};
$('#bulkTrashBtn').onclick=()=>moveToTrash(projects.filter(p=>selected.has(p.id)));
$('#selectAllBin').onchange=e=>{trash.forEach(p=>e.target.checked?binSelected.add(p.id):binSelected.delete(p.id));renderBin()};
$('#binRestoreBtn').onclick=()=>restoreFromTrash(trash.filter(p=>binSelected.has(p.id)));
$('#binPurgeBtn').onclick=()=>purgeFromTrash(trash.filter(p=>binSelected.has(p.id)));
$('#binEmptyBtn').onclick=()=>purgeFromTrash([...trash]);
$('#collectProject').onchange=loadCollect;
$('#collectRefresh').onclick=loadCollect;
$('#collectEnable').onclick=async()=>{try{collectForm=(await manageCollect(collectCloudId,'enable')).form;renderCollect()}catch(err){collectMsg(authNetworkMessage(err),'error')}};
$('#collectToggle').onclick=async()=>{try{collectForm=(await manageCollect(collectCloudId,collectForm.open?'close':'open')).form;renderCollect()}catch(err){collectMsg(authNetworkMessage(err),'error')}};
$('#collectReset').onclick=async()=>{if(!confirm('换新链接后，已经发出去的旧链接会马上失效。继续吗？'))return;try{collectForm=(await manageCollect(collectCloudId,'reset')).form;renderCollect()}catch(err){collectMsg(authNetworkMessage(err),'error')}};
$('#collectCopy').onclick=async()=>{const v=$('#collectLinkInput').value;try{await navigator.clipboard.writeText(v);$('#collectCopy').textContent='已复制';setTimeout(()=>{$('#collectCopy').textContent='复制链接'},1500)}catch{$('#collectLinkInput').select()}};
$('#changePasswordForm').addEventListener('submit',async e=>{
  e.preventDefault();authSetMessage('changePasswordMessage','');
  const btn=e.submitter;btn.disabled=true;
  try{
    const next=$('#newPassword').value;
    if(next!==$('#newPassword2').value)throw Object.assign(new Error('两次输入的新密码不一致。'),{status:400});
    await changeAccountPassword({oldPassword:$('#oldPassword').value,newPassword:next});
    e.target.reset();authSetMessage('changePasswordMessage','密码已修改。其他设备需要用新密码重新登录。','ok');
  }catch(err){authSetMessage('changePasswordMessage',authNetworkMessage(err),'error')}
  finally{btn.disabled=false}
});
$('#rotateRecoveryBtn').onclick=async()=>{
  if(!confirm('重新生成后，旧的找回码会立刻作废。继续吗？'))return;
  authSetMessage('rotateRecoveryMessage','');
  try{
    const code=await rotateRecoveryCode();
    $('#newRecoveryCodeValue').textContent=code;$('#newRecoveryBox').hidden=false;$('#copyNewRecoveryBtn').textContent='复制';
    authSetMessage('rotateRecoveryMessage','请现在就抄下来或保存好，离开这个页面后就看不到了。','ok');
  }catch(err){authSetMessage('rotateRecoveryMessage',authNetworkMessage(err),'error')}
};
$('#copyNewRecoveryBtn').onclick=async()=>{const code=$('#newRecoveryCodeValue').textContent;try{await navigator.clipboard.writeText(code);$('#copyNewRecoveryBtn').textContent='已复制'}catch{prompt('复制找回码',code)}};
$('#settingsLogoutBtn').onclick=()=>$('#authLogoutBtn').click();


/* -------------------------------------------------------------------------- */
/* Organizer accounts v2.0.0 — stored in the convention-publisher Worker (D1). */
/* -------------------------------------------------------------------------- */
function authSetMessage(id,text,type=''){
  const el=$('#'+id);if(!el)return;
  el.textContent=text||'';
  el.className='auth-message'+(type?' '+type:'');
}
function authNormalizeName(v){return String(v||'').trim().replace(/\s+/g,' ')}
function authShowAdmin(session){
  $('#authShell').hidden=true;
  $('#adminShell').hidden=false;
  $('#authAccountActions').hidden=false;
  $('#authCurrentUser').textContent=session?.username||'主办方';
  document.body.classList.add('auth-signed-in');
}
function authShowGate(){
  $('#authShell').hidden=false;
  $('#adminShell').hidden=true;
  $('#authAccountActions').hidden=true;
  document.body.classList.remove('auth-signed-in');
}
function authShowPage(page){
  document.querySelectorAll('[data-auth-page]').forEach(btn=>btn.classList.toggle('active',btn.dataset.authPage===page));
  document.querySelectorAll('[data-auth-panel]').forEach(panel=>{
    const on=panel.dataset.authPanel===page;
    panel.hidden=!on;panel.classList.toggle('active',on);
  });
  $('#authRecoveryCodeResult').hidden=true;
  if(page!=='recovery'){
    $('#authEmailResetForm').hidden=true;
    $('#authEmailRecoveryForm').hidden=false;
    $('#authDemoMail').hidden=true;
  }
  ['authLoginMessage','authQuickMessage','authEmailMessage','authRecoveryMessage','authRecoveryEmailMessage','authEmailResetMessage'].forEach(id=>authSetMessage(id,''));
}
function authSetRegisterMode(mode){
  document.querySelectorAll('[data-register-mode]').forEach(b=>b.classList.toggle('active',b.dataset.registerMode===mode));
  document.querySelectorAll('[data-register-panel]').forEach(p=>p.hidden=p.dataset.registerPanel!==mode);
}
function authSetRecoveryMode(mode){
  document.querySelectorAll('[data-recovery-mode]').forEach(b=>b.classList.toggle('active',b.dataset.recoveryMode===mode));
  document.querySelectorAll('[data-recovery-panel]').forEach(p=>p.hidden=p.dataset.recoveryPanel!==mode);
  $('#authEmailResetForm').hidden=true;
}
function authNetworkMessage(err){
  return err?.status?err.message:'无法连接账号服务，请检查网络后重试。';
}

document.querySelectorAll('[data-auth-page]').forEach(btn=>btn.addEventListener('click',()=>authShowPage(btn.dataset.authPage)));
document.querySelectorAll('[data-register-mode]').forEach(btn=>btn.addEventListener('click',()=>authSetRegisterMode(btn.dataset.registerMode)));
document.querySelectorAll('[data-recovery-mode]').forEach(btn=>btn.addEventListener('click',()=>authSetRecoveryMode(btn.dataset.recoveryMode)));
$('#authForgotBtn')?.addEventListener('click',()=>{authShowPage('recovery');authSetRecoveryMode('code')});
$('#authRecoveryBack')?.addEventListener('click',()=>authShowPage('login'));

$('#authLoginForm')?.addEventListener('submit',async e=>{
  e.preventDefault();authSetMessage('authLoginMessage','');
  const btn=e.submitter;btn.disabled=true;
  try{
    const session=await loginAccount({username:authNormalizeName($('#authLoginAccount').value),password:$('#authLoginPassword').value});
    authShowAdmin(session);restoreCloudProjects();
  }catch(err){authSetMessage('authLoginMessage',authNetworkMessage(err),'error')}
  finally{btn.disabled=false}
});

$('#authQuickRegisterForm')?.addEventListener('submit',async e=>{
  e.preventDefault();authSetMessage('authQuickMessage','');
  const btn=e.submitter;btn.disabled=true;
  try{
    const p=$('#authQuickPassword').value,p2=$('#authQuickPassword2').value;
    if(p!==p2)throw Object.assign(new Error('两次输入的密码不一致。'),{status:400});
    const {recoveryCode}=await registerAccount({username:authNormalizeName($('#authQuickName').value),password:p});
    $('#authRecoveryCodeValue').textContent=recoveryCode;
    document.querySelectorAll('[data-auth-panel]').forEach(x=>x.hidden=true);
    $('#authRecoveryCodeResult').hidden=false;
  }catch(err){authSetMessage('authQuickMessage',authNetworkMessage(err),'error')}
  finally{btn.disabled=false}
});

$('#authEmailRegisterForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  authSetMessage('authEmailMessage','邮箱注册暂未开放，请使用主办方名称注册。','error');
});

$('#authCopyRecoveryCode')?.addEventListener('click',async()=>{
  const code=$('#authRecoveryCodeValue').textContent;
  try{await navigator.clipboard.writeText(code);$('#authCopyRecoveryCode').textContent='已复制'}catch{prompt('复制找回码',code)}
});
$('#authEnterAdmin')?.addEventListener('click',()=>{const session=readCloudSession();if(session){authShowAdmin(session);restoreCloudProjects()}});

$('#authCodeRecoveryForm')?.addEventListener('submit',async e=>{
  e.preventDefault();authSetMessage('authRecoveryMessage','');
  const btn=e.submitter;btn.disabled=true;
  try{
    const p=$('#authRecoveryPassword').value,p2=$('#authRecoveryPassword2').value;
    if(p.length<6)throw Object.assign(new Error('新密码至少需要 6 个字符。'),{status:400});
    if(p!==p2)throw Object.assign(new Error('两次输入的新密码不一致。'),{status:400});
    await recoverAccount({username:authNormalizeName($('#authRecoveryName').value),recoveryCode:$('#authRecoveryCode').value.trim(),newPassword:p});
    authSetMessage('authRecoveryMessage','密码已重设，请使用新密码登录。','ok');
    setTimeout(()=>authShowPage('login'),900);
  }catch(err){authSetMessage('authRecoveryMessage',authNetworkMessage(err),'error')}
  finally{btn.disabled=false}
});

$('#authEmailRecoveryForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  authSetMessage('authRecoveryEmailMessage','邮箱找回暂未开放，请使用找回码。','error');
});
$('#authLogoutBtn')?.addEventListener('click',async()=>{
  await logoutAccount().catch(()=>{});
  authShowGate();authShowPage('login');
  $('#authLoginPassword').value='';
});

function authSyncView(){
  const session=readCloudSession();
  if(session)authShowAdmin(session);
  else{authShowGate();authShowPage('login')}
}
async function authVerifySession(){
  if(!readCloudSession())return;
  try{await fetchAccount()}
  catch(err){if(err?.status===401){authSyncView();return}}
  restoreCloudProjects();
}
authSyncView();authVerifySession();
window.addEventListener('pageshow',()=>authSyncView());
document.addEventListener('visibilitychange',()=>{if(!document.hidden)authSyncView()});
