import {makeIpOnlyTemplate} from '/v8/templates/ip-only-template-factory.js?v=8.41.4';
/* Template 03 runs on the shared IP ONLY core; only its art and the product spotlight differ. */
export const template03=makeIpOnlyTemplate({
 id:'03-creator-market',name:'03 · 创作者集市',label:'创作者集市',studioName:'创作者集市',
 description:'首页像内容社区：一张轮换推荐图，加六件每次刷新都会变的制品，适合社团和摊位很多的创作者集市。',
 structureProfile:'catalogue',artDirection:'creator-portal',motionProfile:'portal',
 theme:'#00aeec',heroTitleColor:'#18191c',heroTitleAccentColor:'#00aeec',
 presentationProfile:{entryAnimation:true,quickAccess:false,ribbon:false,mobileDock:false,scrollProgress:false,floatingStickers:false,passportProgress:false,decorativeSectionOrbits:false,productSpotlight:true},
 studioPages:{hidden:[],hiddenContent:['ribbonItems'],customPages:false},
 design:{hero:'portal-carousel+grid',motif:'feed'}
});
const d=template03.defaults;
d.tagline='以创作者和同人作品为主角的交流活动。';
d.modules={...d.modules,activities:true,guests:true,ribbon:false,sponsors:true};
d.tickets=[{id:'t1',name:'入场票',price:'¥30',gift:'入场资格',note:'票务及入场规则以主办方指定平台为准',image:''}];
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
const g0=d.guests[0];
d.guests=[
 {...g0,id:'g1',guestType:'person',name:'白雪',role:'GUEST ARTIST',members:'',attendanceNote:'',works:'星空系列插画',intro:'特邀插画师，现场有签名板和限量小卡。',appearance:'13:30 签售会'},
 {...g0,id:'g2',guestType:'person',name:'月见社',role:'CIRCLE',members:'',attendanceNote:'',works:'漫画与纸制品',intro:'参展社团代表，来聊聊怎么把本子做出来。',appearance:'15:00 创作分享'}
];
d.participation=[
 {id:'pa1',preset:'guest',activityType:'guest',title:'画师签售会',meta:'签售区 · 13:30 开始',text:'白雪现场签名，限量小卡先到先得。',detail:'凭当天购买的任一制品排队签名，每人限签一件。小卡数量有限，送完为止。',participationMode:'凭制品排队',requirements:'请先在摊位购买制品。',rules:'每人限签一件，请听从现场工作人员引导。',target:'activities',url:'',guestIds:['g1']},
 {id:'pa2',preset:'stage',activityType:'general',title:'创作分享会',meta:'分享区 · 15:00 开始',text:'参展社团分享做本子的经验。',detail:'两位社团代表分享从选题、排版到印刷的流程，最后留 15 分钟提问。',participationMode:'现场自由旁听',requirements:'无。',rules:'提问请举手，按顺序发言。',target:'activities',url:'',guestIds:['g2']}
];
d.schedule=[
 {id:'s1',day:'DAY 1',time:'11:00',endTime:'',title:'入场开放',stage:'入口',category:'入场',detail:'开放入场，摊位同步开始营业。',guestIds:[],registrationUrl:''},
 {id:'s2',day:'DAY 1',time:'13:30',endTime:'14:30',title:'画师签售会',stage:'签售区',category:'签售',detail:'白雪现场签名。',guestIds:['g1'],registrationUrl:''},
 {id:'s3',day:'DAY 1',time:'15:00',endTime:'15:40',title:'创作分享会',stage:'分享区',category:'分享',detail:'参展社团分享创作经验。',guestIds:['g2'],registrationUrl:''},
 {id:'s4',day:'DAY 1',time:'17:00',endTime:'',title:'闭幕',stage:'入口',category:'结束',detail:'摊位收摊，有序离场。',guestIds:[],registrationUrl:''}
];
d.featuredActivities=[{id:'fa1',participationId:'pa1',image:''},{id:'fa2',participationId:'pa2',image:''},{id:'fa3',participationId:'',image:''}];
