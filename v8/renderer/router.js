export function createRouter({qs:$,qsa:qa,getState,renderPassport}){
  const standalonePages=['booths','activities','guide'];
  const fixedModules=new Set(['tickets','passport','booths','activities','guide']);
  const homeSections=[
    ['tickets','tickets'],['highlights','highlights'],['passport','passport'],['map-home','booths'],['schedule-home','activities'],['guests','guests'],['guide-home','guide'],['community','community'],['sponsors','sponsors']
  ];
  let currentPage='home';
  function getCurrentPage(){return currentPage}
  function setCurrentPage(page){currentPage=page||'home'}
  function moduleOn(key){return fixedModules.has(key)||getState().modules?.[key]!==false}
  function isHomeModule(id){return homeSections.some(([section])=>section===id)}
  function isStandalonePage(id){return standalonePages.includes(id)}
  function renderQuickAccess(){
    const grid=$('.quick-grid');if(!grid)return;
    const defs=[
      ['tickets','tickets','票务与特典','查看票种 →','home'],
      ['passport','passport','活动参与','查看参与内容 →','home'],
      ['booths','map-home','场地图','查看场地 →','home'],
      ['activities','schedule-home','当天日程','查看日程 →','home'],
      ['guide','guide-home','观展指南','查看指南 →','home']
    ];
    grid.innerHTML=defs.map((x,i)=>'<a class="quick-card reveal in" href="#'+x[1]+'" data-target-mode="'+x[4]+'" data-page-link="'+x[1]+'"><span>'+String(i+1).padStart(2,'0')+'</span><b>'+x[2]+'</b><small>'+x[3]+'</small></a>').join('');
  }
  function applyModules(){
    $('.ribbon')?.classList.toggle('oe-page-hidden',!moduleOn('ribbon'));
    homeSections.forEach(([id,key])=>$('#'+id)?.classList.toggle('oe-module-off',!moduleOn(key)));
    standalonePages.forEach(id=>$('#'+id)?.classList.toggle('oe-module-off',!moduleOn(id)));
    const navMap={'tickets':'tickets','highlights':'highlights','map-home':'booths','schedule-home':'activities','guide-home':'guide','community':'community'};
    Object.entries(navMap).forEach(([id,key])=>qa('.nav a[href="#'+id+'"],.mobile-dock a[href="#'+id+'"]').forEach(a=>a.hidden=!moduleOn(key)));
    renderQuickAccess();renderPassport();
  }
  function showPage(page,updateHash=true){
    if(page!=='home'&&!standalonePages.includes(page))page='home';
    if(page!=='home'&&!moduleOn(page))page='home';
    currentPage=page;
    [$('.hero'),$('.quick')].filter(Boolean).forEach(el=>el.classList.toggle('oe-page-hidden',page!=='home'));
    $('.ribbon')?.classList.toggle('oe-page-hidden',page!=='home'||!moduleOn('ribbon'));
    homeSections.forEach(([id,key])=>{const el=$('#'+id);if(el)el.classList.toggle('oe-page-hidden',page!=='home'||!moduleOn(key))});
    standalonePages.forEach(id=>{const el=$('#'+id);if(el)el.classList.toggle('oe-page-hidden',page!==id||!moduleOn(id))});
    $('.footer')?.classList.toggle('oe-page-hidden',false);
    if(updateHash){
      const hash=page==='home'?'#home':'#'+page;
      history.replaceState(null,'',location.pathname+location.search+hash);
      window.scrollTo({top:0,left:0,behavior:'auto'});
    }
  }
  function scrollHomeSection(id){showPage('home',false);requestAnimationFrame(()=>$('#'+id)?.scrollIntoView({behavior:'smooth',block:'start'}))}
  function showActivityDetail(index){showPage('activities',false);requestAnimationFrame(()=>$('#activity-detail-'+Number(index))?.scrollIntoView({behavior:'smooth',block:'start'}))}
  return {applyModules,showPage,scrollHomeSection,showActivityDetail,moduleOn,isHomeModule,isStandalonePage,getCurrentPage,setCurrentPage};
}