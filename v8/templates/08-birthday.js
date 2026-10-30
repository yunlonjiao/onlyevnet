import {makeIpOnlyTemplate} from '/v8/templates/ip-only-template-factory.js?v=8.37.2';
/* Template 08 runs on the shared IP ONLY core; the birthday-card art and the support-first home differ. */
export const template08=makeIpOnlyTemplate({
 id:'08-birthday',name:'08 · 生日应援',label:'生日应援',studioName:'生日应援',
 description:'生日贺卡风格：首页先讲应援内容、赠品和领取方式，适合角色生日、生咖应援和小型主题布置。',
 structureProfile:'invitation',artDirection:'birthday-card',motionProfile:'gentle',
 theme:'#ff8fb8',heroTitleColor:'#4a3358',heroTitleAccentColor:'#ff8fb8',
 presentationProfile:{mobileDock:true},
 studioPages:{hidden:['booths'],hiddenContent:[],customPages:false},
 group:'small',
 design:{hero:'saturated-block+polaroid',motif:'confetti-scallop'}
});
// Starter content for a birthday support event: what is set up, what can be taken home, and when.
const d=template08.defaults;
d.tagline='今天是 TA 的生日。来看布置、领赠品，也留下一句祝福。';
d.modules={...d.modules,booths:false,sponsors:false,ribbon:false,guests:true,activities:true,guide:true,community:true};
d.ticketLinkLabel='预约领取';
d.tickets=[
 {id:'t1',name:'生日明信片',price:'免费',gift:'手绘生日明信片一张',note:'凭预约号领取，每人一张',image:''},
 {id:'t2',name:'亚克力挂件',price:'限量 100',gift:'生日限定亚克力挂件',note:'先到先得，送完即止',image:''},
 {id:'t3',name:'集章小礼',price:'集满 3 章',gift:'逛完三个布置点盖章\n换一份小礼物',note:'章在入口领取',image:''}
];
d.guests=d.guests.slice(0,2).map((g,i)=>i===0
 ?{...g,id:'g1',guestType:'person',name:'白雪',role:'ILLUSTRATOR',members:'',attendanceNote:'',works:'生日主视觉与明信片绘制',intro:'画了这次的生日主视觉，也画了每一张明信片。',appearance:'全天'}
 :{...g,id:'g2',guestType:'person',name:'小夏',role:'DECORATION',members:'',attendanceNote:'',works:'主题布置负责人',intro:'负责场地布置，今天在现场回答大家的问题。',appearance:'全天'});
d.participation=[
 {id:'pa1',preset:'stage',activityType:'general',title:'主题布置「星空教室」',meta:'一楼展区 · 10:00 开放',text:'把教室搬到星空下：黑板、课桌和满天星。',detail:'布置分成黑板区、课桌区和星空区三个拍照点。可以随意拍照，请不要触碰展品。',participationMode:'自由参观',requirements:'无需预约，持预约号可优先进场。',rules:'拍照请避让他人，不要挪动布置物品。',target:'activities',url:'',guestIds:['g2']},
 {id:'pa2',preset:'guest',activityType:'general',title:'祝福留言墙',meta:'二楼走廊 · 全天',text:'写一张卡片，贴在墙上，送给 TA。',detail:'现场提供卡片和笔。留言会在活动结束后统一收好，之后会寄给 TA 的应援站。',participationMode:'现场书写',requirements:'无。',rules:'请只写祝福，不要写他人隐私。',target:'activities',url:'',guestIds:[]},
 {id:'pa3',preset:'guest',activityType:'general',title:'赠品领取',meta:'入口处 · 11:00 开始',text:'凭预约号领取生日明信片和挂件。',detail:'预约号会在预约成功后发给你。领取时报预约号即可，不用排太久的队。',participationMode:'凭预约号领取',requirements:'请提前预约。',rules:'一个预约号只能领取一次。',target:'activities',url:'',guestIds:[]},
 {id:'pa4',preset:'guest',activityType:'general',title:'一起唱生日歌',meta:'一楼展区 · 14:00',text:'下午两点，大家一起给 TA 唱生日歌。',detail:'主持人会带大家倒数。歌词会投在墙上，不会唱也可以跟着哼。',participationMode:'现场参加',requirements:'无。',rules:'请把手机调成静音。',target:'activities',url:'',guestIds:['g2']}
];
d.featuredActivities=[{id:'fa1',participationId:'pa1',image:''},{id:'fa2',participationId:'pa2',image:''},{id:'fa3',participationId:'pa3',image:''}];
d.schedule=[
 {id:'s1',day:'生日当天',time:'10:00',endTime:'',title:'布置区开放',stage:'一楼展区',category:'参观',detail:'可以开始参观和拍照。',guestIds:['g2'],registrationUrl:''},
 {id:'s2',day:'生日当天',time:'11:00',endTime:'17:00',title:'赠品领取',stage:'入口处',category:'领取',detail:'凭预约号领取，送完为止。',guestIds:[],registrationUrl:''},
 {id:'s3',day:'生日当天',time:'14:00',endTime:'14:20',title:'一起唱生日歌',stage:'一楼展区',category:'互动',detail:'集体给 TA 送祝福。',guestIds:[],registrationUrl:''},
 {id:'s4',day:'生日当天',time:'16:00',endTime:'',title:'留言墙收卡',stage:'二楼走廊',category:'收集',detail:'截止收卡，之后会统一整理。',guestIds:[],registrationUrl:''},
 {id:'s5',day:'生日当天',time:'18:00',endTime:'',title:'活动结束',stage:'一楼展区',category:'结束',detail:'谢谢大家来过。',guestIds:[],registrationUrl:''}
];
d.updates=[{id:'u1',date:'10/01',title:'预约已开放',target:'tickets'},{id:'u2',date:'09/28',title:'赠品图公开',target:'tickets'}];
d.venueMap={image:'',links:[{id:'ml1',label:'当天安排',target:'activities',itemType:'page',itemId:''},{id:'ml2',label:'协力的人',target:'guests',itemType:'page',itemId:''},{id:'ml3',label:'领取须知',target:'guide',itemType:'page',itemId:''}]};
d.booths=[];
d.guide.items=[
 {id:'gd1',preset:'traffic',title:'地点与交通',label:'ACCESS',text:'地点：【场地名称】（【详细地址】）\n交通：【地铁或公交线路、站点、出口】，步行约【X】分钟。\n入口在【位置】，门口有应援海报。'},
 {id:'gd2',preset:'admission',title:'预约与领取',label:'RESERVE',text:'预约方式：点上方「预约领取」，填写【需要的信息】。\n预约成功后会收到预约号。\n领取时间：【HH:MM–HH:MM】，请带好预约号。'},
 {id:'gd3',preset:'facilities',title:'布置说明',label:'DECOR',text:'布置区在【楼层 / 区域】，请不要触碰展品，不要挪动布置物品。\n拍照时请避让他人，大型相机请提前告诉工作人员。'},
 {id:'gd5',preset:'safety',title:'注意事项',label:'NOTICE',text:'场内请勿吸烟，饮料请在指定区域饮用。\n赠品每人限领一份，不能转赠、转卖。\n如有疑问，请联系【联系人】：【联系方式】。'}
];
