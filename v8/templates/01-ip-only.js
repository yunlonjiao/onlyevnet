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
      {id:'sl3',label:'COS / 自由行群',note:'自由行、COS 集合与摄影交流',url:'',image:''},
      {id:'sl4',label:'节目 / 活动报名',note:'节目、舞台或互动活动报名入口',url:'',image:''},
      {id:'sl5',label:'B站',note:'PV、嘉宾公开与节目预告',url:'',image:''},
      {id:'sl6',label:'小红书',note:'宣发、返图与观展攻略',url:'',image:''}
    ],
    sponsors:[],
    guide:{
      homeCount:2,
      items:[
        {id:'gd1',preset:'traffic',title:'交通到达',text:'填写场馆地址、地铁 / 公交、自驾 / 网约车、入口位置。可以上传主办自己画的路线图或入口示意图。',image:''},
        {id:'gd2',preset:'admission',title:'入场须知',text:'填写入场时间、检票方式、排队、现场购票、二次入场、禁止夜排等说明。',image:''},
        {id:'gd3',preset:'facilities',title:'场馆设施',text:'填写卫生间、更衣室、寄存、餐饮、医疗点、休息区、充电或无障碍信息。',image:''},
        {id:'gd4',preset:'cosplay',title:'COS / 道具规则',text:'填写更衣、摄影、道具尺寸、仿真武器、妆造和现场拍摄规则。',image:''},
        {id:'gd5',preset:'safety',title:'安全与禁止事项',text:'填写禁止携带物品、禁止行为、紧急情况处理和 Staff 联系方式。',image:''}
      ]
    },
    freewalk:{
      title:'COS / 自由行',
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