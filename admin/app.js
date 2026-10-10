import {listTemplates,DEFAULT_TEMPLATE_ID,getTemplate} from '/v8/templates/registry.js?v=8.34.52';
import {deleteSite} from '/v8/publisher.js?v=8.34.52';

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
  if(!record.siteId||!record.editToken){
    alert('这个已发布网站缺少下线凭证，暂时不能安全删除线上站点。');
    return false;
  }
  if(!confirm('确定下线这个游客网站？\n下线后公开链接将不可访问，项目内容仍会保留。'))return false;
  try{
    await deleteSite({siteId:record.siteId,editToken:record.editToken});
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
    if(!record.siteId||!record.editToken){
      alert('为避免留下无法管理的线上网站，当前不会只删除本地项目。\n请先恢复发布凭证或下线网站。');
      return;
    }
    try{await deleteSite({siteId:record.siteId,editToken:record.editToken})}
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
  const migrated={id,name:state.eventName||'STARDUST ONLY 2026',templateId,status:'draft',updatedAt:new Date().toISOString(),legacy:true};
  localStorage.setItem('onlyevent-studio-v8:'+templateId+':'+id+':iframe',JSON.stringify({...state,projectId:id,templateId}));
  const oldPublish=localStorage.getItem('onlyevent-studio-publish:'+templateId+':iframe');
  if(oldPublish)localStorage.setItem('onlyevent-studio-publish:'+templateId+':'+id+':iframe',oldPublish);
  writeProjects([migrated]);
}
migrateLegacyProject();projects=readProjects();

function renderTemplates(){
  const templates=listTemplates(),grid=$('#templateGrid');grid.innerHTML='';
  templates.forEach((template,index)=>{
    const card=document.createElement('article');card.className='template-card';
    card.innerHTML='<div class="template-preview"><div class="template-preview-window"><span class="bar"></span><div class="hero"><b>STAR<br>BEAT<br>ONLY</b><span class="art"></span></div><div class="rows"><i></i><i></i><i></i></div></div></div>'+
      '<div class="template-card-body"><span>TEMPLATE '+String(index+1).padStart(2,'0')+'</span><h2>'+template.label+'</h2><p>'+template.description+'</p><div class="template-card-footer"><span class="template-tag">'+template.category+'</span><button class="use-template" data-template="'+template.id+'" type="button">使用此模板</button></div></div>';
    grid.appendChild(card);
  });
  for(const [name,tag] of [['综合漫展','COMING SOON'],['Live / 舞台活动','COMING SOON']]){
    const card=document.createElement('article');card.className='template-card template-coming';
    card.innerHTML='<div class="template-preview"><div class="template-preview-window"><span class="bar"></span><div class="hero"><b>ONLY<br>EVENT</b><span class="art"></span></div><div class="rows"><i></i><i></i><i></i></div></div></div><div class="template-card-body"><span>'+tag+'</span><h2>'+name+'</h2><p>模板框架已预留，完成设计与压力测试后开放。</p><div class="template-card-footer"><span class="template-tag">开发中</span><button class="use-template" disabled>暂未开放</button></div></div>';
    grid.appendChild(card);
  }
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
  $('#selectedTemplateCard').innerHTML='<span class="thumb"></span><div><b>'+t.label+'</b><span>'+t.category+' · '+t.version+'</span></div>';
  $('#createProjectName').value='';
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
renderTemplates();renderProjects();
