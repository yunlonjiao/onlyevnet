import {createCreatorFairDefaults} from '/v8/templates/creator-fair-core.js';
const common={category:'同人创作展',eventType:'creator-market',version:'1.0.0',engine:'onlyevent-studio-v8',supportedModules:['creators','products','booths','boothMap','tickets','news','community','sponsors','visitorGuide']};
const defaults=()=>({...createCreatorFairDefaults(),ticketUrl:'',mobileHeroImage:'',maps:[],community:[],sponsors:[],guide:'',news:[],products:[],creators:[]});
export const template04={...common,id:'04-creator-catalogue',name:'04 · CREATOR CATALOGUE',label:'CREATOR CATALOGUE',studioName:'CREATOR CATALOGUE',artDirection:'illustrated-catalogue',description:'二次元插画主视觉与可翻阅的创作者电子场刊。',renderer:'04-creator-catalogue',defaults:defaults()};
