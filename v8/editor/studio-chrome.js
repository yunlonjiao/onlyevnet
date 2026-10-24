/* Studio chrome shared by the original IP ONLY editor and creator templates. */
export function inspectorMarkup(escape,kicker,title,body){
 return '<div class="inspector-header"><div><span class="inspector-kicker">'+escape(kicker||'属性')+'</span><b>'+escape(title||'未选择内容')+'</b></div><span class="inspector-status"><i></i>自动保存</span></div><div class="inspector-body">'+body+'</div>';
}
export function renderInspector(panel,escape,kicker,title,body){
 panel.innerHTML=inspectorMarkup(escape,kicker,title,body);
}
export function renderPageTree(host,pages,activePage,escape){
 if(!host)return;
 host.innerHTML=pages.map(([id,label],i)=>'<div class="page-tree-row is-fixed"><button type="button" data-market-page="'+escape(id)+'" data-page="'+escape(id)+'" class="'+(id===activePage?'active':'')+'"><span class="nav-icon">'+(i===0?'⌂':id==='animation'?'✦':id==='booths'?'⌘':id==='map'?'▤':'i')+'</span><span>'+escape(label)+'</span></button></div>').join('');
}

/* Only the editor chrome uses the English template identifier; event names and gallery labels remain user-authored/localized. */
export function studioTemplateTitle(template){
 return String(template.studioName||template.name||template.id||'ONLYEVENT').replace(/^\d+\s*·\s*/,'').trim();
}
export function syncStudioIdentity(template,eventName,root=document){
 const title=studioTemplateTitle(template);
 const workspace=root.querySelector('#workspaceTemplateName');if(workspace)workspace.textContent=title;
 const project=root.querySelector('#projectTemplateName');if(project)project.textContent=title;
 const event=root.querySelector('#projectEventName');if(event)event.textContent=String(eventName||'未命名活动');
}

/* Upgrade earlier sample titles only for unscoped demo templates. User-created project names are never rewritten. */
export function migrateDemoEventName(state,projectId){
 if(projectId!=='default'||!state)return state;
 const old=String(state.eventName||'');
 if(old==='STARDUST ONLY 2026'||old==='同人创作展'){
  state.eventName='STARDUST ONLY';
  if(old==='STARDUST ONLY 2026'&&state.heroTitle1==='STAR'&&state.heroTitle2==='BEAT'&&state.heroTitle3==='ONLY')state.heroTitle2='DUST';
 }
 return state;
}
