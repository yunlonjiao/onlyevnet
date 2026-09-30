export function createRouter({qs:$,qsa:qa,getState,renderPassport}){
  const standalonePages=['booths','activities'];
  const homeModules=['tickets','highlights','passport','guests','guide','freewalk','itasha','community','sponsors'];
  let currentPage='home';
  function getCurrentPage(){return currentPage}
  function setCurrentPage(page){currentPage=page||'home'}
  function moduleOn(key){return getState().modules?.[key]!==false}
  function isHomeModule(id){return homeModules.includes(id)}
  function isStandalonePage(id){return standalonePages.includes(id)}
  function renderQuickAccess(){
    const grid=$('.quick-grid');if(!grid)return;
    const defs=[
      ['tickets','票务与特典','查看票种 →','home'],
      ['highlights','特别企划','查看企划 →','home'],
      ['passport','活动护照','开始集章 →','home'],
      ['booths','摊位与地图','查找摊位 →','page'],
      ['activities','活动 / 日程','查看活动 →','page'],
      ['guests','嘉宾','查看嘉宾 →','home'],
      ['guide','观展指南','查看指南 →','home'],
      ['freewalk','自由行','参与说明 →','home'],
      ['itasha','痛车','报名 / 展示 →','home'],
      ['community','社群公告','查看社群 →','home'],
      ['sponsors','赞助支持','查看支持 →','home']
    ];
    grid.innerHTML=defs.filter(x=>moduleOn(x[0])).map((x,i)=>'<a class="quick-card reveal in" href="#'+x[0]+'" data-target-mode="'+x[3]+'" data-page-link="'+x[0]+'"><span>'+String(i+1).padStart(2,'0')+'</span><b>'+x[1]+'</b><small>'+x[2]+'</small></a>').join('');
  }
  function applyModules(){
    $('.ribbon')?.classList.toggle('oe-page-hidden',!moduleOn('ribbon'));
    [...homeModules,...standalonePages].forEach(id=>$('#'+id)?.classList.toggle('oe-module-off',!moduleOn(id)));
    const navMap={tickets:'tickets',highlights:'highlights',booths:'booths',activities:'activities',community:'community'};
    Object.entries(navMap).forEach(([id,key])=>qa('.nav a[href="#'+id+'"],.mobile-dock a[href="#'+id+'"]').forEach(a=>a.hidden=!moduleOn(key)));
    renderQuickAccess();renderPassport();
  }
  function showPage(page,updateHash=true){
    if(page!=='home'&&!standalonePages.includes(page))page='home';
    if(page!=='home'&&!moduleOn(page))page='home';
    currentPage=page;
    const hero=$('.hero'),ribbon=$('.ribbon'),quick=$('.quick');
    [hero,quick].filter(Boolean).forEach(el=>el.classList.toggle('oe-page-hidden',page!=='home'));
    if(ribbon)ribbon.classList.toggle('oe-page-hidden',page!=='home'||!moduleOn('ribbon'));
    homeModules.forEach(id=>{const el=$('#'+id);if(el)el.classList.toggle('oe-page-hidden',page!=='home'||!moduleOn(id))});
    standalonePages.forEach(id=>{const el=$('#'+id);if(el)el.classList.toggle('oe-page-hidden',page!==id||!moduleOn(id))});
    $('.footer')?.classList.toggle('oe-page-hidden',false);
    document.documentElement.scrollTop=0;document.body.scrollTop=0;
    if(updateHash){const hash=page==='home'?'#home':'#'+page;history.replaceState(null,'',location.pathname+location.search+hash)}
  }
  function scrollHomeSection(id){showPage('home',false);requestAnimationFrame(()=>$('#'+id)?.scrollIntoView({behavior:'smooth',block:'start'}))}
  return {applyModules,showPage,scrollHomeSection,moduleOn,isHomeModule,isStandalonePage,getCurrentPage,setCurrentPage};
}