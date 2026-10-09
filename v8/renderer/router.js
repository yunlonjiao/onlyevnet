export function createRouter({qs:$,qsa:qa,getState,getMode,renderParticipation,onPageNavigate=()=>{}}){
  const baseStandalonePages=['booths','activities','guests','guide'];
  const fixedModules=new Set(['tickets','map']);
  const homeSections=[
    ['tickets','tickets'],['map-home','map'],['participation','activities'],['schedule-home','activities'],['community','community'],['sponsors','sponsors']
  ];
  let currentPage='home';
  const customPageIds=()=> (getState().customPages||[]).map(p=>'custom-'+p.id);
  const standalonePages=()=>[...baseStandalonePages,...customPageIds()];
  function getCurrentPage(){return currentPage}
  function setCurrentPage(page){currentPage=page||'home'}
  function hasSponsors(){
    return (getState().sponsors||[]).some(x=>String(x?.name||'').trim()||String(x?.logo||'').trim()||String(x?.url||'').trim());
  }
  function moduleHasContent(key){
    const state=getState();
    if(key==='booths')return (state.booths||[]).length>0;
    if(key==='activities')return (state.participation||[]).length>0||(state.schedule||[]).length>0;
    if(key==='guests')return (state.guests||[]).length>0;
    if(key==='guide')return (state.guide?.items||[]).length>0;
    if(key==='community')return (state.socialLinks||[]).some(x=>String(x?.label||'').trim()||String(x?.note||'').trim()||String(x?.url||'').trim()||String(x?.image||'').trim());
    if(key==='ribbon')return (state.ribbonItems||[]).some(x=>String(x?.text||'').trim());
    if(key==='sponsors')return hasSponsors();
    return true;
  }
  function moduleOn(key){
    if(String(key).startsWith('custom-'))return customPageIds().includes(key);
    if(fixedModules.has(key))return true;
    const enabled=getState().modules?.[key]!==false;
    if(!enabled)return false;
    return getMode?.()==='edit'||moduleHasContent(key);
  }
  function isHomeModule(id){return homeSections.some(([section])=>section===id)}
  function isStandalonePage(id){return standalonePages().includes(id)}
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
  function renderCustomNav(){
    const pages=getState().customPages||[],desktop=$('.nav .links'),mobile=$('.mobile-dock');
    qa('[data-custom-nav]').forEach(x=>x.remove());
    pages.forEach(page=>{
      const key='custom-'+page.id,label=page.title||'专题页面';
      if(desktop)desktop.insertAdjacentHTML('beforeend','<a href="#'+key+'" data-target-mode="page" data-page-link="'+key+'" data-custom-nav="1">'+label+'</a>');
      if(mobile)mobile.insertAdjacentHTML('beforeend','<a href="#'+key+'" data-target-mode="page" data-page-link="'+key+'" data-custom-nav="1">'+label+'</a>');
    });
  }
  function applyModules(){
    $('.ribbon')?.classList.toggle('oe-page-hidden',!moduleOn('ribbon'));
    homeSections.forEach(([id,key])=>$('#'+id)?.classList.toggle('oe-module-off',!moduleOn(key)));
    standalonePages().forEach(id=>$('#'+id)?.classList.toggle('oe-module-off',!moduleOn(id)));
    const navMap={'tickets':'tickets','map-home':'map','schedule-home':'activities','community':'community','booths':'booths','activities':'activities','guests':'guests','guide':'guide'};
    Object.entries(navMap).forEach(([id,key])=>qa('.nav a[href="#'+id+'"],.mobile-dock a[href="#'+id+'"]').forEach(a=>a.hidden=!moduleOn(key)));
    renderCustomNav();
    renumberSections();
    renderQuickAccess();renderParticipation();
  }
  function renumberSections(){
    const defs=[
      ['tickets','tickets'],
      ['map-home','map'],
      ['participation','activities'],
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
    if(page!=='home'&&!isStandalonePage(page))page='home';
    if(page!=='home'&&!moduleOn(page)&&getMode?.()!=='edit')page='home';
    const changed=currentPage!==page;
    currentPage=page;
    if(updateHash&&changed)onPageNavigate(page);
    [$('.hero'),$('.quick')].filter(Boolean).forEach(el=>el.classList.toggle('oe-page-hidden',page!=='home'));
    $('.ribbon')?.classList.toggle('oe-page-hidden',page!=='home'||!moduleOn('ribbon'));
    homeSections.forEach(([id,key])=>{const el=$('#'+id);if(el)el.classList.toggle('oe-page-hidden',page!=='home'||!moduleOn(key))});
    standalonePages().forEach(id=>{const el=$('#'+id);if(el)el.classList.toggle('oe-page-hidden',page!==id||(!moduleOn(id)&&getMode?.()!=='edit'))});
    $('.footer')?.classList.toggle('oe-page-hidden',false);
    if(updateHash){
      const hash=page==='home'?'#home':'#'+page;
      history.replaceState(null,'',location.pathname+location.search+hash);
      window.scrollTo({top:0,left:0,behavior:'auto'});
    }
  }
  function scrollHomeSection(id){const changed=currentPage!=='home';showPage('home',false);if(changed)onPageNavigate('home');requestAnimationFrame(()=>$('#'+id)?.scrollIntoView({behavior:'smooth',block:'start'}))}
  function showActivityDetail(index){const changed=currentPage!=='activities';showPage('activities',false);if(changed)onPageNavigate('activities');requestAnimationFrame(()=>document.querySelector('#activities [data-activity-index="'+Number(index)+'"]')?.scrollIntoView({behavior:'smooth',block:'start'}))}
  return {applyModules,showPage,scrollHomeSection,showActivityDetail,moduleOn,isHomeModule,isStandalonePage,getCurrentPage,setCurrentPage};
}
