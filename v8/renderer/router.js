export function createRouter({qs:$,qsa:qa,getState,renderPassport}){
  const standalonePages=['booths','activities'];
  const homeSections=[
    ['tickets','tickets'],
    ['highlights','highlights'],
    ['passport','passport'],
    ['map-home','booths'],
    ['schedule-home','activities'],
    ['guests','guests'],
    ['guide','guide'],
    ['freewalk','freewalk'],
    ['itasha','itasha'],
    ['community','community'],
    ['sponsors','sponsors']
  ];
  let currentPage='home';

  function getCurrentPage(){return currentPage}
  function setCurrentPage(page){currentPage=page||'home'}
  function moduleOn(key){return getState().modules?.[key]!==false}
  function isHomeModule(id){return homeSections.some(([section])=>section===id)}
  function isStandalonePage(id){return standalonePages.includes(id)}

  function renderQuickAccess(){
    const grid=$('.quick-grid');if(!grid)return;
    const defs=[
      ['tickets','tickets','票务与特典','查看票种 →','home'],
      ['highlights','highlights','特别企划','查看企划 →','home'],
      ['passport','passport','活动护照','活动入口 →','home'],
      ['booths','map-home','场地图','查看场地 →','home'],
      ['activities','schedule-home','当天日程','查看日程 →','home'],
      ['guests','guests','嘉宾','查看嘉宾 →','home'],
      ['guide','guide','观展指南','查看指南 →','home'],
      ['freewalk','freewalk','自由行','参与说明 →','home'],
      ['itasha','itasha','痛车','报名 / 展示 →','home'],
      ['community','community','社群公告','查看社群 →','home'],
      ['sponsors','sponsors','赞助支持','查看支持 →','home']
    ];
    grid.innerHTML=defs.filter(x=>moduleOn(x[0])).map((x,i)=>'<a class="quick-card reveal in" href="#'+x[1]+'" data-target-mode="'+x[4]+'" data-page-link="'+x[1]+'"><span>'+String(i+1).padStart(2,'0')+'</span><b>'+x[2]+'</b><small>'+x[3]+'</small></a>').join('');
  }

  function applyModules(){
    $('.ribbon')?.classList.toggle('oe-page-hidden',!moduleOn('ribbon'));
    homeSections.forEach(([id,key])=>$('#'+id)?.classList.toggle('oe-module-off',!moduleOn(key)));
    standalonePages.forEach(id=>$('#'+id)?.classList.toggle('oe-module-off',!moduleOn(id)));
    const navMap={'tickets':'tickets','highlights':'highlights','map-home':'booths','schedule-home':'activities','community':'community'};
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
    homeSections.forEach(([id,key])=>{const el=$('#'+id);if(el)el.classList.toggle('oe-page-hidden',page!=='home'||!moduleOn(key))});
    standalonePages.forEach(id=>{const el=$('#'+id);if(el)el.classList.toggle('oe-page-hidden',page!==id||!moduleOn(id))});
    $('.footer')?.classList.toggle('oe-page-hidden',false);
    document.documentElement.scrollTop=0;document.body.scrollTop=0;
    if(updateHash){const hash=page==='home'?'#home':'#'+page;history.replaceState(null,'',location.pathname+location.search+hash)}
  }

  function scrollHomeSection(id){
    showPage('home',false);
    requestAnimationFrame(()=>$('#'+id)?.scrollIntoView({behavior:'smooth',block:'start'}));
  }

  function showActivityDetail(index){
    showPage('activities',false);
    requestAnimationFrame(()=>$('#activity-detail-'+Number(index))?.scrollIntoView({behavior:'smooth',block:'start'}));
  }

  return {applyModules,showPage,scrollHomeSection,showActivityDetail,moduleOn,isHomeModule,isStandalonePage,getCurrentPage,setCurrentPage};
}