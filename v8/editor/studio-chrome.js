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
