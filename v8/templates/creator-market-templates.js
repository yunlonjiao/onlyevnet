import {createCreatorFairDefaults} from '/v8/templates/creator-fair-core.js';
const common={category:'同人创作展',eventType:'creator-market',version:'1.0.0',engine:'onlyevent-studio-v8',supportedModules:['creators','products','booths','boothMap','tickets','news','community','sponsors','visitorGuide']};
const defaults=()=>({...createCreatorFairDefaults(),ticketUrl:'',mobileHeroImage:'',maps:[],community:[],sponsors:[],guide:'',news:[],products:[],creators:[]});
export const template03={...common,id:'03-creator-market',name:'03 · 创作放送',label:'创作放送',studioName:'CREATOR MARKET',artDirection:'creator-portal',description:'内容门户式布局、首页制品轮播与六件随机作品推荐。',renderer:'03-creator-market',defaults:defaults()};
export const template04={...common,id:'04-creator-catalogue',name:'04 · 星绘场刊',label:'星绘场刊',studioName:'CREATOR CATALOGUE',artDirection:'illustrated-catalogue',description:'二次元插画主视觉与可翻阅的创作者电子场刊。',renderer:'04-creator-catalogue',defaults:defaults()};
