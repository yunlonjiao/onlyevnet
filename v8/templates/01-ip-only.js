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
      {id:'pa1',preset:'stage',title:'舞台活动',meta:'主舞台 · 时间待定',text:'填写节目、Talk、表演或舞台互动内容。',target:'activities',url:'',guestIds:[]},
      {id:'pa2',preset:'stamp',title:'集章 / 打卡',meta:'活动区域 · 全天',text:'填写集章点、打卡规则、兑换方式或完成奖励。',target:'activities',url:'',guestIds:[]},
      {id:'pa3',preset:'photo',title:'主题合影',meta:'集合区域 · 时间待定',text:'填写集合时间、地点和参与方式。',target:'activities',url:'',guestIds:[]},
      {id:'pa4',preset:'game',title:'互动游戏 / 抽选',meta:'活动区域 · 时间待定',text:'填写互动游戏、抽选或现场挑战的参与规则。',target:'activities',url:'',guestIds:[]}
    ],
    venueMap:{
      image:'',
      links:[
        {id:'ml1',label:'主舞台',target:'activities',itemType:'page',itemId:''},
        {id:'ml2',label:'摊位区',target:'booths',itemType:'page',itemId:''},
        {id:'ml3',label:'痛车区',target:'activities',itemType:'page',itemId:''},
        {id:'ml4',label:'COS 区',target:'activities',itemType:'page',itemId:''}
      ]
    },
    booths:[
      {id:'b1',no:'A01',name:'星屑工房',logo:'',type:'同人本 · 亚克力',intro:'原创插画与角色主题制品。',products:[
        {id:'p1',name:'新刊',price:'¥45',note:'现场首发',image:''},
        {id:'p2',name:'亚克力立牌',price:'¥60',note:'数量有限',image:''}
      ]},
      {id:'b2',no:'A12',name:'薄荷书室',logo:'',type:'插画 · 明信片',intro:'插画本、明信片与纸制品。',products:[
        {id:'p3',name:'插画本',price:'¥50',note:'',image:''}
      ]},
      {id:'b3',no:'B07',name:'白昼制品',logo:'',type:'徽章 · 色纸',intro:'徽章、色纸与随机小物。',products:[
        {id:'p4',name:'徽章套组',price:'¥35',note:'',image:''}
      ]}
    ],
    schedule:[
      {id:'s1',time:'11:00',title:'开场 & 社群合影',stage:'MAIN STAGE',detail:'活动开场与全体社群合影。',guestIds:[],registrationUrl:''},
      {id:'s2',time:'13:30',title:'主题问答 / 互动游戏',stage:'TALK',detail:'主题问答、观众互动与现场小游戏。',guestIds:[],registrationUrl:''},
      {id:'s3',time:'15:00',title:'COS 特别舞台',stage:'MAIN STAGE',detail:'COS 舞台展示与主题合影活动。',guestIds:[],registrationUrl:''},
      {id:'s4',time:'17:30',title:'幸运抽选 & 闭幕',stage:'MAIN STAGE',detail:'幸运抽选、闭幕致谢与活动结束提醒。',guestIds:[],registrationUrl:''}
    ],
    guests:[],
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
        {id:'gd1',preset:'traffic',title:'交通到达',text:"活动地点：【场馆名称】（【详细地址】）\n地铁：乘坐【线路】至【站名】【出口】出站，步行约【X】分钟到达【入口】。\n公交：可乘【线路】至【站点】，下车后按现场指引前往。\n网约车 / 出租车：建议在【推荐下客点】下车，避免在消防通道或主入口排队区长时间停靠。\n自驾：导航至【停车场 / 车辆入口】，停车位及开放入口以场馆当日安排为准。\n请以主办方最终发布的路线图、入口示意图及现场工作人员指引为准。",image:''},
        {id:'gd2',preset:'admission',title:'入场须知',text:"开放时间：【HH:MM–HH:MM】，建议至少提前【30】分钟到场并预留排队、安检时间。\n入场时请提前准备电子票 / 核验二维码，以及售票规则要求的有效身份证件；请按对应票种、日期和时段排队入场。\n现场将进行检票与安全检查，请配合工作人员指引，不要拥堵入口及消防通道。\n现场购票：【开放 / 不开放，请按实际修改】。\n二次入场：【允许 / 不允许；如允许请填写核验方式】。\n为避免影响场馆秩序，请勿提前一晚夜排；最早排队时间以主办方通知为准。\n票务退改、实名核验等规则以官方售票平台及主办方最终公告为准，请勿购买来源不明的票证。"},
        {id:'gd3',preset:'facilities',title:'场馆设施',text:"卫生间：【填写楼层 / 区域】。\n更衣区：【填写位置、开放时间及使用要求】；请在指定区域更衣，不要长期占用卫生间或公共通道。\n寄存 / 行李：【填写是否提供寄存及位置】；贵重物品请随身保管。\n餐饮 / 饮水：【填写场内餐饮、自动售货机或饮水点位置】。\n医疗 / 失物招领：【填写服务台、医疗点或 Staff 联系位置】。\n充电 / 无障碍设施：【填写充电点、电梯、无障碍通道或其他设施】。\n设施开放情况可能根据场馆当日运营调整，如有疑问请优先咨询现场 Staff。"},
        {id:'gd4',preset:'cosplay',title:'COS / 道具规则',text:"请在主办方或场馆指定的更衣区域完成换装，不要占用卫生间、消防通道、出入口或摊位通道长时间整理服装。\n拍摄他人、Coser、摊位或作品前请先征得同意；请勿偷拍、强行合影、追拍或因拍摄阻碍正常通行。\n禁止携带开刃、尖锐、可发射、易燃易爆或其他可能造成伤害的道具；大型道具、灯架、背景架等设备如需报备，请按主办方公布的尺寸和流程提前申请。\n道具尺寸上限：【填写】；允许材质 / 特殊限制：【填写】。\n使用长柄或大型道具时请注意周围人员和展品，移动时尽量收起或保持安全距离。\n现场如有争议，以安检、场馆规定及工作人员现场判断为准。"},
        {id:'gd5',preset:'safety',title:'安全与禁止事项',text:"禁止携带枪支、管制刀具、易燃易爆品、有毒危险品及其他法律法规或场馆明确禁止的物品入场；其他禁带物请以活动当天安检要求为准。\n请勿堵塞消防通道、紧急出口和主要通行区域，不攀爬场馆设施，不进行可能影响他人安全的追逐、抛掷或危险动作。\n请妥善保管手机、钱包、证件、相机等个人物品；发现遗失物可交至【服务台 / 失物招领处】。\n如发生身体不适、人员走失、物品遗失或其他紧急情况，请及时联系附近 Staff 或前往【医疗点 / 服务台】。\n遇到疏散或临时管控时，请听从工作人员和场馆广播指引有序移动，不要逆行、聚集或围观。\n紧急联系电话 / Staff 联系方式：【填写】。"}
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