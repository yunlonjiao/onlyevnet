import {makeProjectBackup,restoreProjectBackup} from '/admin/project-backup.js';
import {listTemplates,DEFAULT_TEMPLATE_ID,getTemplate} from '/v8/templates/registry.js?v=8.41.5';
import {deleteSite,readCloudSession,loginAccount,registerAccount,recoverAccount,fetchAccount,logoutAccount} from '/v8/publisher.js?v=8.42.0';

const $=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
const PROJECTS_KEY='onlyevent-admin-projects-v1';
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
async function deleteProject(project){
  if(project.siteUrl){
    const ok=confirm('这个项目已经发布。\n\n确定删除项目吗？系统会先下线游客网站，再删除本地项目数据。');
    if(!ok)return;
    const record=getPublishRecord(project);
    if(!record.siteId||!record.cloudProjectId){
      alert('为避免留下无法管理的线上网站，当前不会只删除本地项目。\n请先恢复发布凭证或下线网站。');
      return;
    }
    try{await deleteSite({siteId:record.siteId,projectId:record.cloudProjectId})}
    catch(error){alert('线上网站下线失败，项目未删除：'+(error?.message||'Publisher 暂未启用删除接口'));return}
  }else if(!confirm('确定删除这个项目？\n项目内容会从当前浏览器中删除。'))return;
  clearProjectLocalData(project);
  writeProjects(projects.filter(p=>p.id!==project.id));
  renderProjects($('#projectSearch').value);
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
      '<div class="template-card-body"><span>TEMPLATE '+String(index+1).padStart(2,'0')+'</span><h2>'+template.label+'</h2><p>'+template.description+'</p><div class="template-card-footer"><span class="template-tag">'+template.artDirection+'</span><button class="use-template" data-template="'+template.id+'" type="button">使用此模板</button></div></div>';
    grid.appendChild(card);
  });

}
function renderProjects(filter=''){
  const term=filter.trim().toLocaleLowerCase(),grid=$('#projectGrid'),empty=$('#emptyProjects');
  grid.innerHTML='';
  const visible=projects.filter(p=>!term||String(p.name||'').toLocaleLowerCase().includes(term));
  $('#projectCount').textContent=String(projects.length);
  empty.hidden=projects.length>0;
  visible.sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||''))).forEach(project=>{
    const frag=$('#projectCardTemplate').content.cloneNode(true),card=frag.querySelector('.project-card');
    const status=project.siteUrl?'published':'draft';
    card.dataset.projectId=project.id;
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
    card.querySelector('.delete-project').onclick=()=>deleteProject(project);
    grid.appendChild(frag);
  });
  if(!visible.length&&projects.length){grid.innerHTML='<div class="empty-projects" style="grid-column:1/-1"><b>没有找到匹配项目</b><p>换一个关键词试试。</p></div>'}
}
function showPage(name){
  qa('[data-admin-page]').forEach(b=>b.classList.toggle('active',b.dataset.adminPage===name));
  qa('[data-page-panel]').forEach(p=>{const on=p.dataset.pagePanel===name;p.hidden=!on;p.classList.toggle('active',on)});
}
function openCreate(templateId=DEFAULT_TEMPLATE_ID){
  selectedTemplateId=templateId;
  const t=getTemplate(templateId);
  $('#selectedTemplateCard').innerHTML='<span class="thumb thumb-'+String(t.artDirection||'default').replace(/[^a-z0-9-]/gi,'')+'"></span><div><b>'+t.label+'</b><span>'+t.artDirection+' · '+t.version+'</span></div>';
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
    authShowAdmin(session);
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
$('#authEnterAdmin')?.addEventListener('click',()=>{const session=readCloudSession();if(session)authShowAdmin(session)});

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
  catch(err){if(err?.status===401)authSyncView()}
}
authSyncView();authVerifySession();
window.addEventListener('pageshow',()=>authSyncView());
document.addEventListener('visibilitychange',()=>{if(!document.hidden)authSyncView()});
