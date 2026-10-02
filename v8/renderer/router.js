export function createRouter({qs:$,qsa:qa,getState,getMode,renderParticipation}){
  const standalonePages=['booths','activities','guests','guide'];
  const fixedModules=new Set(['tickets','map','guests']);
  const homeSections=[
    ['tickets','tickets'],['map-home','map'],['activity-home','activities'],['community','community'],['sponsors','sponsors']
  ];
  let currentPage='home';
  function getCurrentPage(){return currentPage}
  function setCurrentPage(page){currentPage=page||'home'}
  function hasSponsors(){
    return (getState().sponsors||[]).some(x=>String(x?.name||'').trim()||String(x?.logo||'').trim()||String(x?.url||'').trim());
  }
  function moduleOn(key){
    if(key==='sponsors')return hasSponsors();
    return fixedModules.has(key)||getState().modules?.[key]!==false;
  }
  function isHomeModule(id){return homeSections.some(([section])=>section===id)}
  function isStandalonePage(id){return standalonePages.includes(id)}
  function renderQuickAccess(){
    const grid=$('.quick-grid');if(!grid)return;
    const defs=[
      ['tickets','tickets','票务与特典','查看票种 →','home'],
      ['booths','booths','摊位与制品','查看摊位 →','page'],
      ['activities','activities','活动','查看活动 →','page'],
      ['guide','guide','观展指南','查看指南 →','page'],
      ['map','map-home','场地图','查看场地 →','home']
    ].filter(x=>moduleOn(x[0]));
    grid.innerHTML=defs.map((x,i)=>'<a class="quick-card reveal in" href="#'+x[1]+'" data-target-mode="'+x[4]+'" data-page-link="'+x[1]+'"><span>'+String(i+1).padStart(2,'0')+'</span><b>'+x[2]+'</b><small>'+x[3]+'</small></a>').join('');
  }
  function applyModules(){
    $('.ribbon')?.classList.toggle('oe-page-hidden',!moduleOn('ribbon'));
    homeSections.forEach(([id,key])=>$('#'+id)?.classList.toggle('oe-module-off',!moduleOn(key)));
    standalonePages.forEach(id=>$('#'+id)?.classList.toggle('oe-module-off',!moduleOn(id)));
    const navMap={'tickets':'tickets','map-home':'map','community':'community','guests':'guests','guide':'guide','activities':'activities','booths':'booths'};
    Object.entries(navMap).forEach(([id,key])=>qa('.nav a[href="#'+id+'"],.mobile-dock a[href="#'+id+'"]').forEach(a=>a.hidden=!moduleOn(key)));
    renumberSections();
    renderQuickAccess();renderParticipation();
  }
  function renumberSections(){
    const defs=[
      ['tickets','tickets'],
      ['map-home','map'],
      ['activity-home','activities'],
      ['community','community'],
      ['sponsors','sponsors']
    ];
    let n=1;
    defs.forEach(([id,key])=>{
      const el=$('#'+id),badge=el?.querySelector('.section-no');if(!el||!badge)return;
      if(!moduleOn(key))return;
      badge.textContent='SECTION '+String(n++).padStart(2,'0');
    });
  }
  function showPage(page,updateHash=true){
    if(page!=='home'&&!standalonePages.includes(page))page='home';
    if(page!=='home'&&!moduleOn(page)&&getMode?.()!=='edit')page='home';
    currentPage=page;
    [$('.hero'),$('.quick')].filter(Boolean).forEach(el=>el.classList.toggle('oe-page-hidden',page!=='home'));
    $('.ribbon')?.classList.toggle('oe-page-hidden',page!=='home'||!moduleOn('ribbon'));
    homeSections.forEach(([id,key])=>{const el=$('#'+id);if(el)el.classList.toggle('oe-page-hidden',page!=='home'||!moduleOn(key))});
    standalonePages.forEach(id=>{const el=$('#'+id);if(el)el.classList.toggle('oe-page-hidden',page!==id||(!moduleOn(id)&&getMode?.()!=='edit'))});
    $('.footer')?.classList.toggle('oe-page-hidden',false);
    if(updateHash){
      const hash=page==='home'?'#home':'#'+page;
      history.replaceState(null,'',location.pathname+location.search+hash);
      window.scrollTo({top:0,left:0,behavior:'auto'});
    }
  }
  function scrollHomeSection(id){showPage('home',false);requestAnimationFrame(()=>$('#'+id)?.scrollIntoView({behavior:'smooth',block:'start'}))}
  function showActivityDetail(index){showPage('activities',false);requestAnimationFrame(()=>document.querySelector('#activities [data-activity-index="'+Number(index)+'"]')?.scrollIntoView({behavior:'smooth',block:'start'}))}
  return {applyModules,showPage,scrollHomeSection,showActivityDetail,moduleOn,isHomeModule,isStandalonePage,getCurrentPage,setCurrentPage};
}