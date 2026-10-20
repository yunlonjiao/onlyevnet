/* OnlyEvent event-kind contracts. Activity kind is independent of visual template.
   This catalog describes planned product lines; no draft types are publishable yet. */
export const EVENT_TYPE_DEFINITIONS=Object.freeze([
  Object.freeze({
    id:'ip-only',label:'IP ONLY / 单作品同好活动',status:'available',
    description:'单 IP、同好主题、ONLY 活动',
    requiredModules:Object.freeze(['tickets','booths','activities','guests','guide','map']),
    optionalModules:Object.freeze(['ribbon','community','sponsors','customPages','freewalk','itasha']),
    templateIds:Object.freeze(['01-ip-only','02-scrapbook','03-school-festival','04-museum-editorial','05-live-poster','06-expo-catalogue','07-immersive-character'])
  }),
  Object.freeze({
    id:'tea-party',label:'同好茶会',status:'planned',
    description:'小型同好交流、茶会、CP ONLY 类聚会；具体活动名称由主办方填写',
    requiredModules:Object.freeze(['eventInformation','registration','agenda','venue','participationGuide']),
    optionalModules:Object.freeze(['guests','announcements','gallery','community','tickets']),
    templateIds:Object.freeze([])
  }),
  Object.freeze({
    id:'creator-market',label:'同人创作展',status:'planned',
    description:'同人创作展与创作者市集共用一类，支持社团、作品与摊位目录',
    requiredModules:Object.freeze(['creators','booths','products','boothMap','visitorGuide']),
    optionalModules:Object.freeze(['tickets','news','featuredCreators','favorites','wishlist','community']),
    templateIds:Object.freeze([])
  }),
  Object.freeze({
    id:'live-stage',label:'舞台活动',status:'planned',
    description:'乐队Live、演出、嘉宾见面会等以出演及节目日程为核心的活动',
    requiredModules:Object.freeze(['performers','shows','setlist','admission','visitorGuide']),
    optionalModules:Object.freeze(['tickets','news','venueMap','merchandise','community']),
    templateIds:Object.freeze([])
  })
]);
export function listEventTypes({includePlanned=false}={}){
  return EVENT_TYPE_DEFINITIONS.filter(x=>includePlanned||x.status==='available');
}
export function getEventType(id){
  return EVENT_TYPE_DEFINITIONS.find(x=>x.id===id)||null;
}
export function getEventTypeForTemplate(templateId){
  return EVENT_TYPE_DEFINITIONS.find(x=>x.templateIds.includes(templateId))||null;
}
