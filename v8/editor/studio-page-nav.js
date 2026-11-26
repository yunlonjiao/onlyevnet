export function pageContentItems({page,state,template,config}){
  const items=page==='home'&&state.templateId==='02-scrapbook'?
   config.home.filter(x=>x.collection!=='ribbonItems'&&x.collection!=='explore').flatMap(x=>x.tool==='hero'?[x,{tool:'intro',label:'活动简介'}]:x.tool==='map'?[x,{collection:'guests',label:'嘉宾阵容'}]:[x]):
   (config[page]||[]).filter(x=>!(template.studioPages?.hiddenContent||[]).includes(x.collection||x.tool));
 if(page==='home'&&/^0[56]/.test(state.templateId)){items.push({collection:'participation',label:'现场活动'},{collection:'guests',label:'出演阵容'},{collection:'guide',label:'观演秩序'},{collection:'schedule',label:'活动日程'})}
  const list03=[{tool:'basic',label:'基本信息'},{tool:'banner',label:'横幅'},{tool:'lifecycle',label:'活动状态'},{tool:'traffic',label:'交通到达'},{collection:'guide',label:'规则与须知'},...items.filter(x=>x.tool!=='hero'&&x.collection!=='explore'&&x.tool!=='basic'&&x.tool!=='lifecycle'&&x.collection!=='guide')];
  const list04=[{tool:'basic',label:'基本信息'},{tool:'cover',label:'封面图'},{tool:'lifecycle',label:'活动状态'},{collection:'updates',label:'最新公告'},{collection:'tickets',label:'入场票'},{tool:'map',label:'场地图'},{collection:'booths',label:'参展社团与制品'},{tool:'streets',label:'街道'},{tool:'traffic',label:'交通到达'},{collection:'guide',label:'入场与须知'},{collection:'socialLinks',label:'社群'},{collection:'sponsors',label:'赞助'}];
  const visibleItems=page!=='home'?items:state.templateId==='03-creator-market'?list03:state.templateId==='04-creator-catalogue'?list04:items;
  return visibleItems;
}
