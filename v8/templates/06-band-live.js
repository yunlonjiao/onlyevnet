import {makeIpOnlyTemplate} from '/v8/templates/ip-only-template-factory.js?v=8.37.2';
/* Template 06 runs on the shared IP ONLY core; the live-house flyer art, the band list and the set times differ. */
export const template06=makeIpOnlyTemplate({
 id:'06-band-live',name:'06 · 乐队演出',label:'乐队演出',studioName:'乐队演出',
 description:'演出传单风格：黑白复印质感加一抹信号橙，先看哪几组乐队、几点上场，适合 Live House 和乐队合演。',
 structureProfile:'lineup',artDirection:'band-live',motionProfile:'energetic',
 theme:'#ff4a1c',heroTitleColor:'#ffffff',heroTitleAccentColor:'#ff4a1c',
 presentationProfile:{ribbon:true,mobileDock:true},
 studioPages:{hidden:['booths'],hiddenContent:[],customPages:false},
 group:'stage',
 design:{hero:'split-tilted-photo',motif:'photocopy-tape'}
});
// Starter content for a four-band night.
const d=template06.defaults;
d.tagline='四组乐队连着演，一个晚上。门票含一杯饮料。';
d.modules={...d.modules,booths:false,sponsors:true,ribbon:true,guests:true,activities:true,guide:true,community:true};
d.ribbonItems=[{id:'rb1',text:'出演乐队公开'},{id:'rb2',text:'预售票开售中'},{id:'rb3',text:'门票含一杯饮料'},{id:'rb4',text:'请自备耳塞'}];
d.tickets=[
 {id:'t1',name:'预售票 ADV',price:'¥120',gift:'入场资格\n饮料券一张',note:'开演前一天截止预售',image:''},
 {id:'t2',name:'当天票 DOOR',price:'¥150',gift:'入场资格\n饮料券一张',note:'当天现场购买，数量有限',image:''},
 {id:'t3',name:'学生票',price:'¥90',gift:'入场资格\n饮料券一张',note:'入场时请出示学生证',image:''}
];
const g0=d.guests[0];
d.guests=[
 {...g0,id:'g1',guestType:'band',name:'MIDNIGHT TRAIN',role:'BAND',members:'Aki / Ren / Yuu / Mio',attendanceNote:'全员出演',works:'曲目：夜行 / 末班车 / 站台灯',intro:'四人摇滚乐队，主唱兼吉他。这次带来三首新歌。',appearance:'20:00 第 4 组'},
 {...g0,id:'g2',guestType:'band',name:'paper moon',role:'BAND',members:'Hina / Sora / Kai',attendanceNote:'三人出演',works:'曲目：纸月亮 / 窗边 / 回信',intro:'三人编制的 indie 乐队，主打轻快的吉他旋律。',appearance:'19:10 第 3 组'},
 {...g0,id:'g3',guestType:'band',name:'回声实验室',role:'BAND',members:'小野 / 阿澈 / 七海 / 琉',attendanceNote:'全员出演',works:'曲目：回声 / 频率 / 零点',intro:'电子与摇滚混合的四人乐队，现场有视觉投影。',appearance:'18:30 第 2 组'},
 {...g0,id:'g4',guestType:'band',name:'COLOR BARS',role:'OPENING ACT',members:'Mai / Toto',attendanceNote:'两人出演',works:'曲目：彩条 / 信号 / 晴天',intro:'开场乐队，带着新鲜的 demo 来暖场。',appearance:'18:00 第 1 组'}
];
d.schedule=[
 {id:'s1',day:'LIVE',time:'17:30',endTime:'',title:'OPEN · 开场入场',stage:'LIVE HOUSE',category:'入场',detail:'按票号顺序入场，饮料券在吧台兑换。',guestIds:[],registrationUrl:''},
 {id:'s2',day:'LIVE',time:'18:00',endTime:'18:30',title:'COLOR BARS',stage:'LIVE HOUSE',category:'演出',detail:'第 1 组，开场乐队。',guestIds:['g4'],registrationUrl:''},
 {id:'s3',day:'LIVE',time:'18:40',endTime:'19:10',title:'回声实验室',stage:'LIVE HOUSE',category:'演出',detail:'第 2 组，带视觉投影。',guestIds:['g3'],registrationUrl:''},
 {id:'s4',day:'LIVE',time:'19:20',endTime:'19:50',title:'paper moon',stage:'LIVE HOUSE',category:'演出',detail:'第 3 组。',guestIds:['g2'],registrationUrl:''},
 {id:'s5',day:'LIVE',time:'20:00',endTime:'20:40',title:'MIDNIGHT TRAIN',stage:'LIVE HOUSE',category:'演出',detail:'第 4 组，压轴。',guestIds:['g1'],registrationUrl:''},
 {id:'s6',day:'LIVE',time:'21:00',endTime:'',title:'终演',stage:'LIVE HOUSE',category:'散场',detail:'有序散场，周边物贩开放到 21:30。',guestIds:[],registrationUrl:''}
];
d.participation=[
 {id:'pa1',preset:'stage',activityType:'general',title:'周边物贩',meta:'场地后方 · 全程开放',text:'本场限定的 T 恤、徽章和 CD。',detail:'物贩在场地后方，演出间隙和散场后都可以购买。现金和扫码都可以。',participationMode:'现场购买',requirements:'无。',rules:'限定周边卖完即止，每人限购数量以现场告示为准。',target:'activities',url:'',guestIds:[]},
 {id:'pa2',preset:'guest',activityType:'general',title:'演后交流',meta:'场地后方 · 终演后',text:'终演后，乐队成员会在物贩处和大家聊几句。',detail:'乐队成员在物贩区，买周边的朋友可以请他们签名、合影。',participationMode:'现场排队',requirements:'无。',rules:'请排队，每人合影一次。',target:'activities',url:'',guestIds:['g1','g2']}
];
d.featuredActivities=[{id:'fa1',participationId:'pa1',image:''},{id:'fa2',participationId:'pa2',image:''},{id:'fa3',participationId:'',image:''}];
d.updates=[{id:'u1',date:'10/01',title:'出演乐队与出场顺序公开',target:'guests'},{id:'u2',date:'09/28',title:'预售票开售',target:'tickets'}];
d.venueMap={image:'',links:[{id:'ml1',label:'出场顺序',target:'activities',itemType:'page',itemId:''},{id:'ml2',label:'出演乐队',target:'guests',itemType:'page',itemId:''},{id:'ml3',label:'入场须知',target:'guide',itemType:'page',itemId:''}]};
d.booths=[];
d.guide.items=[
 {id:'gd1',preset:'traffic',title:'场地与交通',label:'ACCESS',text:'场地：【Live House 名称】（【详细地址】）\n交通：【地铁或公交线路、站点、出口】，步行约【X】分钟。\n场地在【楼层】，没有电梯请留意。'},
 {id:'gd2',preset:'admission',title:'入场方式',label:'ENTRY',text:'开场【17:30】，按票号顺序分批入场。\n入场时出示电子票，并在吧台用饮料券换一杯饮料。\n场内追加饮料另付费，价格以吧台为准。'},
 {id:'gd3',preset:'facilities',title:'寄存与耳塞',label:'LOCKER',text:'场地有投币寄存柜：【价格】。\n现场声音较大，请自备耳塞；吧台有少量耳塞出售。'},
 {id:'gd5',preset:'safety',title:'拍摄与观演规则',label:'RULES',text:'演出中禁止拍摄、录音，请把手机收好。\n请勿推挤，不要跳上舞台。\n身体不适请及时联系工作人员。'}
];
