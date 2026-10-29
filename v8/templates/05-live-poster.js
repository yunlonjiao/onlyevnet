import {makeIpOnlyTemplate} from '/v8/templates/ip-only-template-factory.js?v=8.37.2';
/* Template 05 runs on the shared IP ONLY core; the stage-night art, the LINE UP and the TIME TABLE differ. */
export const template05=makeIpOnlyTemplate({
 id:'05-live-poster',name:'05 · 舞台现场',label:'舞台现场',studioName:'舞台现场',
 description:'夜场舞台风格：首页先放出演嘉宾和节目表，适合乐队 Live、声优活动、演出和见面会。',
 structureProfile:'lineup',artDirection:'live-stage',motionProfile:'energetic',
 theme:'#ff3d8b',heroTitleColor:'#ffffff',heroTitleAccentColor:'#35e3ff',
 presentationProfile:{entryAnimation:true,ribbon:true,mobileDock:true},
 studioPages:{hidden:['booths'],hiddenContent:[],customPages:false}
});
// Starter content for a live show: a short running order and four performers.
const d=template05.defaults;
d.tagline='喜欢的乐队和声优都在台上，来现场听。';
d.modules={...d.modules,booths:false,sponsors:true,ribbon:true};
d.ribbonItems=[{id:'rb1',text:'出演阵容公开'},{id:'rb2',text:'节目表已更新'},{id:'rb3',text:'票务开售中'},{id:'rb4',text:'应援规则见指南'}];
d.tickets=[
 {id:'t1',name:'一般席',price:'¥280',gift:'入场资格',note:'购买与退票规则以售票平台为准',image:''},
 {id:'t2',name:'前排席',price:'¥480',gift:'入场资格\n前排座位\n纪念票根',note:'限量发售',image:''},
 {id:'t3',name:'应援套票',price:'¥380',gift:'入场资格\n应援手幅\n荧光棒一支',note:'礼品内容由主办方填写',image:''}
];
const g0=d.guests[0];
d.guests=[
 {...g0,id:'g1',guestType:'band',name:'NEON SIGNAL',role:'BAND',members:'Aki / Ren / Yuu / Mio',attendanceNote:'全员出席',works:'主题曲演出',intro:'四人乐队，带来作品主题曲和三首新歌。',appearance:'18:30 主舞台'},
 {...g0,id:'g2',guestType:'person',name:'星野 澪',role:'VOICE ACTOR',members:'',attendanceNote:'',works:'《星轨回响》角色配音',intro:'角色配音演员，演唱角色歌并参与现场问答。',appearance:'19:30 主舞台'},
 {...g0,id:'g3',guestType:'duo',name:'MOMO & RIN',role:'DUO',members:'MOMO / RIN',attendanceNote:'双人出演',works:'官方主题舞台',intro:'双人舞台表演，现场有合影环节。',appearance:'17:40 主舞台'},
 {...g0,id:'g4',guestType:'group',name:'月见组',role:'DJ / VISUAL',members:'',attendanceNote:'',works:'开场 DJ 与视觉演出',intro:'负责开场和换场的 DJ 与视觉演出。',appearance:'17:00 主舞台'}
];
d.schedule=[
 {id:'s1',day:'DAY 1',time:'16:30',endTime:'17:00',title:'开场 · 入场',stage:'MAIN STAGE',category:'舞台',detail:'开放入场，播放暖场影像。',guestIds:[],registrationUrl:''},
 {id:'s2',day:'DAY 1',time:'17:00',endTime:'17:40',title:'DJ 开场',stage:'MAIN STAGE',category:'舞台',detail:'开场 DJ 与视觉演出。',guestIds:['g4'],registrationUrl:''},
 {id:'s3',day:'DAY 1',time:'17:40',endTime:'18:20',title:'MOMO & RIN 舞台',stage:'MAIN STAGE',category:'舞台',detail:'双人舞台表演。',guestIds:['g3'],registrationUrl:''},
 {id:'s4',day:'DAY 1',time:'18:30',endTime:'19:15',title:'NEON SIGNAL LIVE',stage:'MAIN STAGE',category:'舞台',detail:'乐队演出，含主题曲。',guestIds:['g1'],registrationUrl:''},
 {id:'s5',day:'DAY 1',time:'19:30',endTime:'20:15',title:'星野澪 Talk & Live',stage:'MAIN STAGE',category:'舞台',detail:'角色歌演唱与现场问答。',guestIds:['g2'],registrationUrl:''},
 {id:'s6',day:'DAY 1',time:'20:15',endTime:'20:30',title:'全体合唱 · 散场',stage:'MAIN STAGE',category:'舞台',detail:'全员合唱，结束后有序退场。',guestIds:[],registrationUrl:''}
];
d.updates=[{id:'u1',date:'10/01',title:'出演阵容公开',target:'guests'},{id:'u2',date:'09/28',title:'节目表已更新',target:'activities'}];
d.venueMap={image:'',links:[{id:'ml1',label:'节目表',target:'activities',itemType:'page',itemId:''},{id:'ml2',label:'出演嘉宾',target:'guests',itemType:'page',itemId:''},{id:'ml3',label:'观演指南',target:'guide',itemType:'page',itemId:''}]};
d.booths=[];
d.guide.items=d.guide.items.filter(x=>x.id!=='gd4');
d.guide.items.push({id:'gd6',preset:'admission',title:'应援规则',label:'CHEER',text:'荧光棒、手幅等应援物品请按【主办方规定】携带。\n请勿遮挡后排视线，演出中不要站上座椅。\n拍摄与录音规则以现场公告为准。'});
