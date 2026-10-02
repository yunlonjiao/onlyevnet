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
    tagline:'围绕单一作品 IP 的粉丝综合活动。主办方负责 KV、活动信息和内容；网站负责把摊位、嘉宾、舞台、地图与特别企划组织成完整官网。',
    theme:'#ff5f91',
    sticker1:'限定企划 ✦',
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
    modules:{ribbon:true,highlights:true,guests:false,freewalk:false,itasha:false,community:true,sponsors:false},
    participation:[
      {id:'pa1',title:'舞台互动',meta:'主舞台 · 13:30',text:'参与主题问答、互动游戏与现场抽选。',target:'schedule-home',url:''},
      {id:'pa2',title:'主题合影',meta:'主舞台 · 15:00',text:'到指定区域参加本届主题合影活动。',target:'schedule-home',url:''},
      {id:'pa3',title:'应援留言墙',meta:'企划区 · 全天',text:'留下角色应援与周年留言，现场统一展示。',target:'highlights',url:''},
      {id:'pa4',title:'COS / 自由行',meta:'活动区域 · 指定时段',text:'查看本届自由行参与方式、规则与集合信息。',target:'freewalk',url:''}
    ],
    venueMap:{
      image:'',
      links:[
        {id:'ml1',label:'主舞台',target:'schedule-home'},
        {id:'ml2',label:'摊位',target:'booths'},
        {id:'ml3',label:'痛车区',target:'participation'},
        {id:'ml4',label:'COS 区',target:'participation'}
      ],
      points:[
        {id:'mp-b1',kind:'booth',label:'A01',x:18,y:24,boothId:'b1'},
        {id:'mp-b2',kind:'booth',label:'A12',x:58,y:38,boothId:'b2'},
        {id:'mp-b3',kind:'booth',label:'B07',x:78,y:67,boothId:'b3'},
        {id:'mp-stage',kind:'stage',label:'主舞台',x:48,y:58},
        {id:'mp-service',kind:'service',label:'服务台',x:34,y:72}
      ]
    },
    booths:[
      {id:'b1',no:'A01',name:'星屑工房',logo:'',type:'同人本 · 亚克力',intro:'原创插画与角色主题制品。',pointId:'mp-b1',products:[
        {id:'p1',name:'新刊',price:'¥45',note:'现场首发',image:''},
        {id:'p2',name:'亚克力立牌',price:'¥60',note:'数量有限',image:''}
      ]},
      {id:'b2',no:'A12',name:'薄荷书室',logo:'',type:'插画 · 明信片',intro:'插画本、明信片与纸制品。',pointId:'mp-b2',products:[
        {id:'p3',name:'插画本',price:'¥50',note:'',image:''}
      ]},
      {id:'b3',no:'B07',name:'白昼制品',logo:'',type:'徽章 · 色纸',intro:'徽章、色纸与随机小物。',pointId:'mp-b3',products:[
        {id:'p4',name:'徽章套组',price:'¥35',note:'',image:''}
      ]}
    ],
    schedule:[
      {id:'s1',time:'11:00',title:'开场 & 社群合影',stage:'MAIN STAGE',detail:'活动开场与全体社群合影。',locationId:'mp-stage',guestIds:[],registrationUrl:''},
      {id:'s2',time:'13:30',title:'主题问答 / 互动游戏',stage:'TALK',detail:'主题问答、观众互动与现场小游戏。',locationId:'mp-stage',guestIds:['g1'],registrationUrl:''},
      {id:'s3',time:'15:00',title:'COS 特别舞台',stage:'MAIN STAGE',detail:'COS 舞台展示与主题合影活动。',locationId:'mp-stage',guestIds:['g1'],registrationUrl:''},
      {id:'s4',time:'17:30',title:'幸运抽选 & 闭幕',stage:'MAIN STAGE',detail:'幸运抽选、闭幕致谢与活动结束提醒。',locationId:'mp-stage',guestIds:[],registrationUrl:''}
    ],
    guests:[
      {id:'g1',name:'特邀嘉宾',role:'Guest / Creator',intro:'嘉宾介绍与作品信息由主办方填写。',works:'代表作 / 参与作品',image:'',socialLabel:'B站',socialUrl:'',appearance:'13:30 主题问答 · 15:00 COS 特别舞台'}
    ],
    updates:[
      {id:'u1',date:'10/01',title:'场地图已公开',target:'map-home'},
      {id:'u2',date:'09/28',title:'当天日程已更新',target:'schedule-home'}
    ],
    socialLinks:[
      {id:'sl1',label:'QQ群',note:'游客群与活动通知',url:'',image:''},
      {id:'sl2',label:'微信群',note:'现场交流与临时通知',url:'',image:''},
      {id:'sl3',label:'B站',note:'PV、嘉宾公开、节目预告',url:'',image:''},
      {id:'sl4',label:'小红书',note:'返图、攻略与活动内容',url:'',image:''}
    ],
    sponsors:[
      {id:'sp1',name:'合作伙伴',level:'合作伙伴',url:'',logo:''}
    ],
    guide:{
      homeCount:2,
      items:[
        {id:'gd1',title:'交通与入场',text:'交通方式、入场时间、排队与检票说明。'},
        {id:'gd2',title:'现场规则',text:'摄影、寄存、禁止事项与现场参与注意事项。'},
        {id:'gd3',title:'更衣与摄影',text:'更衣室位置、开放时间与摄影区域说明。'},
        {id:'gd4',title:'场馆服务',text:'寄存、失物、服务台、餐饮与其他现场服务。'}
      ]
    },
    freewalk:{
      title:'自由行',
      text:'自由行报名、集合方式与参与规则由主办方填写。'
    },
    itasha:{
      title:'痛车展示',
      text:'痛车报名、展示区域与现场规则由主办方填写。'
    }
  }
};