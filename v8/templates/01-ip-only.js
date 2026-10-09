export const template01 = {
  id:'01-ip-only',
  name:'01 · IP ONLY',
  defaults:{
    eventName:'STARDUST ONLY 2026',
    date:'2026.11.08',
    location:'杭州',
    edition:'杭州国际博览中心',
    navigationUrl:'https://uri.amap.com/search?keyword=%E6%9D%AD%E5%B7%9E%E5%9B%BD%E9%99%85%E5%8D%9A%E8%A7%88%E4%B8%AD%E5%BF%83',
    heroTitle1:'STAR',
    heroTitle2:'BEAT',
    heroTitle3:'ONLY',
    heroTitleSize:126,
    heroTitleColor:'#17151b',
    heroTitleAccentColor:'#ff5f91',
    tagline:'围绕单一作品 IP 的粉丝综合活动。主办方负责 KV、活动信息和内容；网站负责把摊位、嘉宾、舞台与地图组织成完整官网。',
    theme:'#ff5f91',
    sticker1:'主题活动 ✦',
    sticker2:'40+ 社团',
    sticker3:'COS OK!',
    ribbonItems:[
      {id:'rb1',text:'摊位公开中'},
      {id:'rb2',text:'特典票限量'},
      {id:'rb3',text:'COS 自由行开放'},
      {id:'rb4',text:'舞台企划更新'}
    ],
    ticketUrl:'',
    ticketLinkLabel:'前往官方售票平台',
    tickets:[
      {id:'t1',name:'普通票',price:'¥68',gift:'入场资格',note:'实际购买与退款规则以售票平台为准',image:''},
      {id:'t2',name:'特典票',price:'¥128',gift:'入场资格\n限定徽章\n纪念票根',note:'限量发售',image:''},
      {id:'t3',name:'VIP 票',price:'¥198',gift:'优先入场\n限定礼包\n舞台优先区',note:'赠品内容由主办方填写',image:''}
    ],
    modules:{ribbon:true,booths:true,activities:true,guide:true,guests:true,freewalk:false,itasha:false,community:true,sponsors:false},
    participation:[
      {id:'pa1',preset:'stage',activityType:'general',title:'舞台活动',meta:'主舞台 · 时间待定',text:'主舞台节目、Talk、表演或特别企划。',detail:'这里填写舞台活动的完整介绍，例如节目内容、出演阵容、流程亮点和观众可以参与的环节。',participationMode:'现场自由观看',requirements:'如有座位区、排队、年龄或入场限制，请在这里填写。',rules:'请听从现场工作人员引导；具体开始时间以当天现场为准。',target:'activities',url:'',guestIds:[]},
      {id:'pa2',preset:'guest',activityType:'guest',title:'嘉宾见面会',meta:'主舞台 · 时间待定',text:'嘉宾见面、访谈、Q&A 与现场互动。',detail:'这里填写嘉宾互动的主题、访谈内容、现场问答或特别环节。',participationMode:'按现场规则入场',requirements:'如设置内场席位、号码牌或提问征集，可在这里说明。',rules:'请尊重嘉宾与现场秩序；拍照、录像及互动方式以主办方现场规则为准。',target:'activities',url:'',guestIds:[]}
    ],
    featuredActivities:[
      {id:'fa1',participationId:'pa1',image:''},
      {id:'fa2',participationId:'pa2',image:''},
      {id:'fa3',participationId:'',image:''}
    ],
    venueMap:{
      image:'',
      links:[
        {id:'ml1',label:'主舞台',target:'activities',itemType:'page',itemId:''},
        {id:'ml2',label:'摊位区',target:'booths',itemType:'page',itemId:''}
      ]
    },
    booths:[
      {id:'b1',no:'A01',name:'星屑工房',logo:'',type:'同人本 · 亚克力',intro:'原创插画与角色主题制品。',products:[
        {id:'p1',name:'新刊',tag:'同人本 新刊',price:'¥45',note:'现场首发',image:''},
        {id:'p2',name:'亚克力立牌',tag:'亚克力 立牌',price:'¥60',note:'数量有限',image:''}
      ]},
      {id:'b2',no:'A12',name:'薄荷书室',logo:'',type:'插画 · 明信片',intro:'插画本、明信片与纸制品。',products:[
        {id:'p3',name:'插画本',tag:'插画本 画集',price:'¥50',note:'',image:''}
      ]},
      {id:'b3',no:'B07',name:'白昼制品',logo:'',type:'徽章 · 色纸',intro:'徽章、色纸与随机小物。',products:[
        {id:'p4',name:'徽章套组',tag:'徽章 套组',price:'¥35',note:'',image:''}
      ]}
    ],
    schedule:[
      {id:'s1',day:'DAY 1',time:'11:00',endTime:'11:30',title:'开场 & 社群合影',stage:'MAIN STAGE',category:'舞台',detail:'活动开场与全体社群合影。',guestIds:[],registrationUrl:''},
      {id:'s2',day:'DAY 1',time:'13:30',endTime:'14:10',title:'主题问答 / 互动游戏',stage:'TALK AREA',category:'互动',detail:'主题问答、观众互动与现场小游戏。',guestIds:[],registrationUrl:''},
      {id:'s3',day:'DAY 1',time:'15:00',endTime:'15:40',title:'COS 特别舞台',stage:'MAIN STAGE',category:'COS',detail:'COS 舞台展示与主题合影活动。',guestIds:[],registrationUrl:''},
      {id:'s4',day:'DAY 1',time:'17:30',endTime:'18:00',title:'幸运抽选 & 闭幕',stage:'MAIN STAGE',category:'舞台',detail:'幸运抽选、闭幕致谢与活动结束提醒。',guestIds:[],registrationUrl:''}
    ],
    guests:[
      {id:'g1',guestType:'person',name:'星野 澪',role:'VOICE ACTOR',members:'',attendanceNote:'',works:'《星轨回响》角色配音 / 舞台出演',intro:'本次作为特别嘉宾出席，与观众分享角色幕后故事并参与现场互动。',image:'',socialLabel:'Bilibili',socialUrl:'',appearance:'11:30 嘉宾见面会 · 主舞台'},
      {id:'g2',guestType:'duo',name:'MOMO & RIN',role:'COSPLAY DUO',members:'MOMO / RIN',attendanceNote:'双人共同出席',works:'官方主题 COS / 角色舞台',intro:'双人主题造型展示，并参与现场合影与互动环节。',image:'',socialLabel:'小红书',socialUrl:'',appearance:'13:00 COS 舞台 · 14:30 合影区'},
      {id:'g3',guestType:'band',name:'NEON SIGNAL',role:'SPECIAL BAND',members:'Aki / Ren / Yuu / Mio',attendanceNote:'全员出席',works:'主题曲演出 / SPECIAL LIVE',intro:'四人乐队特别舞台，带来作品主题曲及现场互动。',image:'',socialLabel:'Bilibili',socialUrl:'',appearance:'16:00 SPECIAL LIVE · 主舞台'},
      {id:'g4',guestType:'official',name:'STARDUST PROJECT',role:'OFFICIAL TEAM',members:'制作人 / 角色设计 / 宣传负责人',attendanceNote:'部分成员出席',works:'官方制作团队 / 幕后分享',intro:'围绕企划制作、视觉设计与活动幕后进行主题分享。',image:'',socialLabel:'官方网站',socialUrl:'',appearance:'14:30 制作团队 Talk · 主舞台'}
    ],
    updates:[
      {id:'u1',date:'10/01',title:'场地图已公开',target:'map-home'},
      {id:'u2',date:'09/28',title:'当天日程已更新',target:'schedule-home'}
    ],
    socialLinks:[
      {id:'sl1',label:'游客群',note:'游客交流、现场问答与活动信息',url:'',image:''},
      {id:'sl2',label:'摊主群',note:'摊主沟通与布撤展信息',url:'',image:''},
      {id:'sl3',label:'COS自由行群',note:'自由行、COS 集合与摄影交流',url:'',image:''},
      {id:'sl4',label:'节目 / 活动报名',note:'节目、舞台或互动活动报名入口',url:'',image:''},
      {id:'sl5',label:'B站',note:'PV、嘉宾公开与节目预告',url:'',image:''},
      {id:'sl6',label:'小红书',note:'宣发、返图与观展攻略',url:'',image:''}
    ],
    sponsors:[],
    customPages:[],
    guide:{
      homeCount:2,
      items:[
        {id:'gd1',preset:'traffic',title:'交通到达',label:'ACCESS',text:'活动地点：【场馆名称】（【详细地址】）\n地铁：乘坐【线路】至【站名】【出口】出站，步行约【X】分钟到达【入口】。\n公交：可乘【线路】至【站点】，下车后按现场指引前往。\n网约车 / 出租车：建议在【推荐下客点】下车。\n自驾：导航至【停车场 / 车辆入口】，停车位及开放入口以场馆当日安排为准。\n请以主办方最终发布的路线图、入口示意图及现场工作人员指引为准。',image:''},
        {id:'gd2',preset:'admission',title:'入场须知',label:'ENTRY',text:'开放时间：【HH:MM–HH:MM】，建议至少提前【30】分钟到场并预留排队、安检时间。\n入场时请提前准备电子票 / 核验二维码及售票规则要求的有效证件，并按对应票种、日期和时段排队入场。\n现场购票：【开放 / 不开放，请按实际修改】。\n二次入场：【允许 / 不允许；如允许请填写核验方式】。\n最早排队时间以主办方通知为准，请勿堵塞场馆出入口和消防通道。'},
        {id:'gd3',preset:'facilities',title:'场馆设施',label:'FACILITY',text:'卫生间：【填写楼层 / 区域】。\n更衣区：【填写位置、开放时间及使用要求】。\n寄存 / 行李：【填写是否提供寄存及位置】。\n餐饮 / 饮水：【填写场内餐饮、自动售货机或饮水点位置】。\n医疗 / 失物招领：【填写服务台、医疗点或 Staff 联系位置】。\n充电 / 无障碍设施：【填写充电点、电梯、无障碍通道或其他设施】。'},
        {id:'gd4',preset:'cosplay',title:'COS / 道具规则',label:'COSPLAY',text:'请在主办方或场馆指定的更衣区域完成换装，不要占用卫生间、消防通道、出入口或摊位通道长时间整理服装。\n拍摄他人、Coser、摊位或作品前请先征得同意，请勿偷拍、强行合影或因拍摄阻碍正常通行。\n道具尺寸上限：【填写】；允许材质 / 特殊限制：【填写】。\n大型道具、灯架、背景架等设备如需报备，请按主办方公布的尺寸和流程提前申请。\n现场如有争议，以安检、场馆规定及工作人员现场判断为准。'},
        {id:'gd5',preset:'safety',title:'安全与禁止事项',label:'SAFETY',text:'禁止携带枪支、管制刀具、易燃易爆品、有毒危险品及场馆明确禁止的其他物品入场。\n请勿堵塞消防通道、紧急出口和主要通行区域，不攀爬场馆设施，不进行可能影响他人安全的危险动作。\n请妥善保管手机、钱包、证件、相机等个人物品。\n如发生身体不适、人员走失、物品遗失或其他紧急情况，请及时联系附近 Staff 或前往【医疗点 / 服务台】。\n紧急联系电话 / Staff 联系方式：【填写】。'}
      ]
    },
    freewalk:{
      title:'COS自由行',
      text:'自由行报名、集合方式与参与规则由主办方填写。',
      image:''
    },
    itasha:{
      title:'痛车展示',
      text:'痛车报名、展示区域与现场规则由主办方填写。',
      image:''
    }
  }
};