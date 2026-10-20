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
    id:'creator-market',label:'创作者 / 同人市集',status:'planned',
    description:'原创创作者、同人社团、独立刊物、手作与周边市集',
    requiredModules:Object.freeze(['organizers','creators','products','boothMap','visitorGuide']),
    optionalModules:Object.freeze(['tickets','news','featuredCreators','favorites','wishlist','community']),
    templateIds:Object.freeze([])
  }),
  Object.freeze({
    id:'live-stage',label:'Live / 舞台活动',status:'planned',
    description:'演出、音乐 Live、声优活动和多场次舞台专题',
    requiredModules:Object.freeze(['performers','shows','setlist','admission','visitorGuide']),
    optionalModules:Object.freeze(['tickets','news','venueMap','merchandise','community']),
    templateIds:Object.freeze([])
  }),
  Object.freeze({
    id:'game-theme',label:'游戏 / 主题企划',status:'planned',
    description:'游戏联动、体验活动、主题企划及沉浸式专题',
    requiredModules:Object.freeze(['chapters','experiences','participationRules','schedule','visitorGuide']),
    optionalModules:Object.freeze(['characters','tickets','news','venueMap','merchandise','community']),
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
