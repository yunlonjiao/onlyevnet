import {makeIpOnlyTemplate} from '/v8/templates/ip-only-template-factory.js?v=8.41.4';
/* Template 03 runs on the shared IP ONLY core; only its art and the product spotlight differ.
   纯摊位同人创作展：只有摊位与制品，没有舞台/COS/自由行；街道由摊位的 street 字段聚合。 */
export const template03=makeIpOnlyTemplate({
 id:'03-creator-market',name:'03 · 创作者集市',label:'创作者集市',studioName:'创作者集市',
 description:'首页像内容社区：一张轮换推荐图，加六件每次刷新都会变的制品，再加一条随机街道，适合社团和摊位很多的创作者集市。',
 structureProfile:'catalogue',artDirection:'creator-portal',motionProfile:'portal',
 theme:'#00aeec',heroTitleColor:'#18191c',heroTitleAccentColor:'#00aeec',
 presentationProfile:{entryAnimation:true,quickAccess:false,ribbon:false,mobileDock:false,scrollProgress:false,floatingStickers:false,passportProgress:false,decorativeSectionOrbits:false,productSpotlight:true,streetSpotlight:true},
 studioPages:{hidden:['activities','guests'],hiddenContent:['ribbonItems','featuredActivities'],customPages:false},
 design:{hero:'portal-carousel+grid',motif:'feed'}
});
const d=template03.defaults;
d.tagline='以创作者和同人作品为主角的交流活动。';
d.entryAnimation={...d.entryAnimation,style:'bilibili-splash',subtitle:'同人创作展 / DOUJIN ONLY',duration:1900};
d.modules={...d.modules,activities:false,guests:false,ribbon:false,sponsors:true};
d.tickets=[
 {id:'t1',name:'一日票',price:'¥40',gift:'当天入场资格\n入场手环一枚',note:'购买与退票规则以主办方指定售票平台为准',image:''},
 {id:'t2',name:'两日通票',price:'¥70',gift:'两天入场资格\n限定社团特典一份',note:'仅限两日举办的活动\n入场时出示订单截图',image:''}
];
/* 街道顺序（可选）：不填就按摊位号首个字符排。 */
d.streetOrder=['A 街道 · 星屑区','B 街道 · 月见区','C 街道 · 白昼区'];
d.booths=[
 {id:'c1',no:'A01',street:'A 街道 · 星屑区',name:'浮光工房',logo:'',type:'原创 · 画集',intro:'原创插画与画集',products:[
  {id:'p1',name:'星空画集',tag:'画集',price:'¥45',note:'',image:''},
  {id:'p4',name:'夜色插画明信片',tag:'明信片',price:'¥15',note:'',image:''},
  {id:'p7',name:'星光贴纸套装',tag:'贴纸',price:'¥18',note:'',image:''}]},
 {id:'c2',no:'A02',street:'A 街道 · 星屑区',name:'月见社',logo:'',type:'漫画 · 周边',intro:'漫画与纸制品',products:[
  {id:'p2',name:'春日明信片',tag:'周边',price:'¥20',note:'',image:''},
  {id:'p5',name:'月光亚克力立牌',tag:'立牌',price:'¥35',note:'',image:''},
  {id:'p8',name:'夏日角色徽章',tag:'徽章',price:'¥20',note:'',image:''}]},
 {id:'c3',no:'A03',street:'A 街道 · 星屑区',name:'星野制作所',logo:'',type:'同人志',intro:'独立出版与同人志',products:[
  {id:'p3',name:'同人志',tag:'本子',price:'¥50',note:'',image:''},
  {id:'p6',name:'独立创作画册',tag:'画册',price:'¥60',note:'',image:''}]},
 {id:'c4',no:'B01',street:'B 街道 · 月见区',name:'白昼书室',logo:'',type:'小说 · 合志',intro:'小说本与合志',products:[
  {id:'p9',name:'月光合志',tag:'合志',price:'¥55',note:'',image:''},
  {id:'p10',name:'短篇小册子',tag:'小说',price:'¥25',note:'',image:''}]},
 {id:'c5',no:'B02',street:'B 街道 · 月见区',name:'薄荷工坊',logo:'',type:'原创 · 挂件',intro:'亚克力与挂件',products:[
  {id:'p11',name:'薄荷色挂件',tag:'挂件',price:'¥30',note:'',image:''},
  {id:'p12',name:'双层亚克力',tag:'立牌',price:'¥42',note:'',image:''}]},
 {id:'c6',no:'C01',street:'C 街道 · 白昼区',name:'远方出版社',logo:'',type:'画册 · 杂志',intro:'画册与独立杂志',products:[
  {id:'p13',name:'远方画册',tag:'画册',price:'¥68',note:'',image:''},
  {id:'p14',name:'独立杂志 01',tag:'杂志',price:'¥38',note:'',image:''}]},
 {id:'c7',no:'C02',street:'C 街道 · 白昼区',name:'纸月社',logo:'',type:'文具 · 纸品',intro:'纸品与文具',products:[
  {id:'p15',name:'纸月便签',tag:'纸品',price:'¥12',note:'',image:''},
  {id:'p16',name:'胶带套装',tag:'文具',price:'¥22',note:'',image:''}]}
];
d.venueMap={image:'',links:[{id:'ml2',label:'社团摊位',target:'booths',itemType:'page',itemId:''},{id:'ml3',label:'观展指南',target:'guide',itemType:'page',itemId:''}]};
d.updates=[{id:'u1',date:'10/01',title:'参展社团名单公开',target:'booths'}];
d.socialLinks=[{id:'sl1',label:'游客群',note:'游客交流与活动信息',url:'',image:''},{id:'sl2',label:'摊主群',note:'摊主沟通与布撤展信息',url:'',image:''}];
d.featuredActivities=[];
/* 纯摊位展：观展指南里不要 COS / 道具规则，活动里不要 COS 舞台、COS 自由行、痛车。 */
d.guide={...d.guide,items:(d.guide.items||[]).filter(x=>x.preset!=='cosplay')};
d.participation=(d.participation||[]).filter(x=>!/COS|自由行|痛车/i.test(String(x.title||'')));
