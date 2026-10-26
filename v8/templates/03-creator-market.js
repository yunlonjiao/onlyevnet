import {makeIpOnlyTemplate} from '/v8/templates/ip-only-template-factory.js?v=8.41.4';
/* Template 03 runs on the shared IP ONLY core; only its art and the product spotlight differ. */
export const template03=makeIpOnlyTemplate({
 id:'03-creator-market',name:'03 · CREATOR MARKET',label:'CREATOR MARKET',studioName:'CREATOR MARKET',
 description:'内容门户式布局、首页制品轮播与六件随机作品推荐。',
 structureProfile:'catalogue',artDirection:'creator-portal',motionProfile:'portal',
 theme:'#00aeec',heroTitleColor:'#18191c',heroTitleAccentColor:'#00aeec',
 presentationProfile:{entryAnimation:true,quickAccess:false,ribbon:false,mobileDock:false,scrollProgress:false,floatingStickers:false,passportProgress:false,decorativeSectionOrbits:false,productSpotlight:true},
 studioPages:{hidden:['activities','guests'],hiddenContent:['ribbonItems','featuredActivities'],customPages:false}
});
const d=template03.defaults;
d.tagline='以创作者和同人作品为主角的交流活动。';
d.modules={...d.modules,activities:false,guests:false,ribbon:false,sponsors:true};
d.tickets=[{id:'t1',name:'入场票',price:'',gift:'入场资格',note:'票务及入场规则以主办方指定平台为准',image:''}];
d.booths=[
 {id:'c1',no:'A01',name:'浮光工房',logo:'',type:'原创 · 画集',intro:'原创插画与画集',products:[
  {id:'p1',name:'星空画集',tag:'画集',price:'¥45',note:'',image:''},
  {id:'p4',name:'夜色插画明信片',tag:'明信片',price:'¥15',note:'',image:''},
  {id:'p7',name:'星光贴纸套装',tag:'贴纸',price:'¥18',note:'',image:''}]},
 {id:'c2',no:'A02',name:'月见社',logo:'',type:'漫画 · 周边',intro:'漫画与纸制品',products:[
  {id:'p2',name:'春日明信片',tag:'周边',price:'¥20',note:'',image:''},
  {id:'p5',name:'月光亚克力立牌',tag:'立牌',price:'¥35',note:'',image:''},
  {id:'p8',name:'夏日角色徽章',tag:'徽章',price:'¥20',note:'',image:''}]},
 {id:'c3',no:'B03',name:'星野制作所',logo:'',type:'同人志',intro:'独立出版与同人志',products:[
  {id:'p3',name:'同人志',tag:'本子',price:'¥50',note:'',image:''},
  {id:'p6',name:'独立创作画册',tag:'画册',price:'¥60',note:'',image:''}]}
];
d.venueMap={image:'',links:[{id:'ml2',label:'社团摊位',target:'booths',itemType:'page',itemId:''},{id:'ml3',label:'观展指南',target:'guide',itemType:'page',itemId:''}]};
d.updates=[{id:'u1',date:'10/01',title:'参展社团名单公开',target:'booths'}];
d.socialLinks=[{id:'sl1',label:'游客群',note:'游客交流与活动信息',url:'',image:''},{id:'sl2',label:'社团群',note:'摊主沟通与布撤展信息',url:'',image:''}];
d.featuredActivities=[];
