export function createRouter({qs:$,qsa:qa,getState,renderPassport}){
  const standalonePages=['booths','stage'],homeModules=['tickets','highlights','passport','community','sponsors'];
  let currentPage='home';
  function getCurrentPage(){return currentPage}
  function setCurrentPage(page){currentPage=page||'home'}
  function moduleOn(key){return getState().modules?.[key]!==false}
  function isHomeModule(id){return homeModules.includes(id)}
  function isStandalonePage(id){return standalonePages.includes(id)}
  function renderQuickAccess(){
    const grid=$('.quick-grid');if(!grid)return;
    const defs=[
      ['tickets','01','票务与特典','查看票种 →','home'],
      ['highlights','02','特别企划','查看企划 →','home'],
      ['passport','03','活动护照','开始集章 →','home'],
      ['booths','04','摊位与地图','查找摊位 →','page'],
      ['stage','05','舞台日程','查看节目 →','page'],
      ['community','06','社群公告','查看社群 →','home'],
      ['sponsors','07','赞助支持','查看支持 →','home']
    ];
    grid.innerHTML=defs.filter(x=>moduleOn(x[0])).map(x=>'<a class="quick-card reveal in" href="#'+x[0]+'" data-target-mode="'+x[4]+'" data-page-link="'+x[0]+'"><span>'+x[1]+'</span><b>'+x[2]+'</b><small>'+x[3]+'</small></a>').join('');
  }
  function applyModules(){
    $('.ribbon')?.classList.toggle('oe-page-hidden',!moduleOn('ribbon'));
    [...homeModules,...standalonePages].forEach(id=>$('#'+id)?.classList.toggle('oe-module-off',!moduleOn(id)));
    const navMap={tickets:'tickets',highlights:'highlights',booths:'booths',stage:'stage',community:'community'};
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