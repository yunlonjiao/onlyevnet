import {makeIpOnlyTemplate} from '/v8/templates/ip-only-template-factory.js?v=8.37.2';
/* Template 06 runs on the shared IP ONLY core; the invitation-card art and the activity-first home differ. */
export const template07=makeIpOnlyTemplate({
 id:'07-tea-party',name:'07 · 茶会小聚',label:'茶会小聚',studioName:'茶会小聚',
 description:'邀请函风格：首页先讲清楚当天玩什么、几点做什么，适合茶会、小型 ONLY、生日会和线下交流会。',
 structureProfile:'invitation',artDirection:'tea-party',motionProfile:'gentle',
 theme:'#f08fa8',heroTitleColor:'#5a3d3a',heroTitleAccentColor:'#f08fa8',
 presentationProfile:{mobileDock:true},
 studioPages:{hidden:['booths'],hiddenContent:[],customPages:false},
 group:'small',
 quickSetup:{modules:[{key:'activities',label:'当天流程'},{key:'guests',label:'同席的人'},{key:'guide',label:'参加须知'},{key:'community',label:'联系与社群'}]},
 design:{hero:'invitation-card+round-photo',motif:'lace-dots'}
});
// Starter content for a small gathering: a few activities, a short agenda and the hosts.
const d=template07.defaults;
d.tagline='喝茶，聊天，玩小游戏。一个下午，和同好待在一起。';
d.modules={...d.modules,booths:false,sponsors:false,ribbon:false,guests:true,activities:true,guide:true,community:true};
d.tickets=[
 {id:'t1',name:'茶会席',price:'¥88',gift:'饮品一杯\n茶点一份\n伴手礼一份',note:'名额有限，先到先得',image:''},
 {id:'t2',name:'双人席',price:'¥158',gift:'两人同席\n饮品两杯\n茶点拼盘',note:'和朋友一起来',image:''}
];
d.guests=d.guests.slice(0,2).map((g,i)=>i===0
 ?{...g,id:'g1',guestType:'person',name:'小夏',role:'HOST',members:'',attendanceNote:'',works:'本次茶会主持',intro:'负责带大家聊天、玩游戏，也会照顾第一次来的朋友。',appearance:'14:00 开场'}
 :{...g,id:'g2',guestType:'person',name:'白雪',role:'GUEST',members:'',attendanceNote:'',works:'插画师 / 现场小卡绘制',intro:'带来亲手画的签名小卡，抽中的人可以带走。',appearance:'15:30 抽卡'});
d.participation=[
 {id:'pa1',preset:'stage',activityType:'general',title:'自由茶话',meta:'茶桌区 · 14:00 开始',text:'边喝茶边聊，不用提前准备话题。',detail:'入座后可以先领茶点，自己找位置坐。第一次来的朋友可以让主持帮忙介绍同桌的人。',participationMode:'入座即可参加',requirements:'无需提前报名活动，只要已经购买茶会席。',rules:'请把声音控制在同桌能听到的程度。',target:'activities',url:'',guestIds:['g1']},
 {id:'pa2',preset:'guest',activityType:'general',title:'角色猜猜看',meta:'茶桌区 · 15:00 开始',text:'看提示猜角色，答对的人拿小礼物。',detail:'主持会念三条提示，抢答猜出角色。每轮的答对者可以选一份小礼物。',participationMode:'现场举手抢答',requirements:'无。',rules:'每人每轮只能答一次。',target:'activities',url:'',guestIds:['g1']},
 {id:'pa3',preset:'guest',activityType:'general',title:'小卡交换',meta:'交换角 · 16:00 开始',text:'带一张自己的小卡来，换一张别人的。',detail:'可以是画的、拍的、自己做的小卡。交换时请当面说一句喜欢它的理由。',participationMode:'自带小卡参加',requirements:'请自备 1 至 3 张小卡。',rules:'不接受转卖和二次转赠。',target:'activities',url:'',guestIds:[]},
 {id:'pa4',preset:'guest',activityType:'guest',title:'签名小卡抽选',meta:'茶桌区 · 15:30 开始',text:'白雪带来的手绘签名小卡，抽中就能带走。',detail:'凭入场号码牌抽选，共 10 张，每人最多中一张。',participationMode:'凭号码牌抽选',requirements:'请保管好入场时领取的号码牌。',rules:'抽选结果以现场公布为准。',target:'activities',url:'',guestIds:['g2']}
];
d.featuredActivities=[{id:'fa1',participationId:'pa1',image:''},{id:'fa2',participationId:'pa2',image:''},{id:'fa3',participationId:'pa3',image:''}];
d.schedule=[
 {id:'s1',day:'DAY 1',time:'13:30',endTime:'14:00',title:'入场与领茶点',stage:'入口',category:'入场',detail:'核对名字，领取号码牌、饮品和茶点。',guestIds:[],registrationUrl:''},
 {id:'s2',day:'DAY 1',time:'14:00',endTime:'15:00',title:'自由茶话',stage:'茶桌区',category:'交流',detail:'主持开场，自由聊天。',guestIds:['g1'],registrationUrl:''},
 {id:'s3',day:'DAY 1',time:'15:00',endTime:'15:30',title:'角色猜猜看',stage:'茶桌区',category:'游戏',detail:'抢答游戏，答对拿小礼物。',guestIds:['g1'],registrationUrl:''},
 {id:'s4',day:'DAY 1',time:'15:30',endTime:'16:00',title:'签名小卡抽选',stage:'茶桌区',category:'抽选',detail:'凭号码牌抽选手绘签名小卡。',guestIds:['g2'],registrationUrl:''},
 {id:'s5',day:'DAY 1',time:'16:00',endTime:'17:00',title:'小卡交换',stage:'交换角',category:'交换',detail:'带来的小卡，当面交换。',guestIds:[],registrationUrl:''},
 {id:'s6',day:'DAY 1',time:'17:00',endTime:'17:30',title:'合影与散场',stage:'茶桌区',category:'合影',detail:'集体合影，之后自由离场。',guestIds:[],registrationUrl:''}
];
d.updates=[{id:'u1',date:'10/01',title:'报名已开放',target:'tickets'},{id:'u2',date:'09/28',title:'当天流程已更新',target:'activities'}];
d.venueMap={image:'',links:[{id:'ml1',label:'当天流程',target:'activities',itemType:'page',itemId:''},{id:'ml2',label:'主持与嘉宾',target:'guests',itemType:'page',itemId:''},{id:'ml3',label:'参加须知',target:'guide',itemType:'page',itemId:''}]};
d.booths=[];
d.guide.items=[
 {id:'gd1',preset:'traffic',title:'怎么过来',label:'ACCESS',text:'地点：【店名 / 场地名称】（【详细地址】）\n交通：【地铁或公交线路、站点、出口】，步行约【X】分钟。\n到了找不到？联系【联系人】：【联系方式】。'},
 {id:'gd2',preset:'admission',title:'参加须知',label:'NOTICE',text:'请在【HH:MM】前到场，凭报名名字或订单截图入场。\n迟到超过【30】分钟，座位可能会被安排给候补的朋友。\n如需退出，请提前【X】天告知，以便让出名额。'},
 {id:'gd3',preset:'facilities',title:'茶点与饮品',label:'MENU',text:'含饮品一杯：【可选品类】。\n茶点内容：【填写茶点】。\n对【坚果 / 乳制品 / 其他】过敏的朋友，请报名时提前告诉我们。'},
 {id:'gd5',preset:'safety',title:'拍摄与小卡规则',label:'RULES',text:'拍摄他人前请先询问。\n小卡仅限交换和收藏，不可转卖。\n请爱护场地，离场前带走自己的物品。'}
];
