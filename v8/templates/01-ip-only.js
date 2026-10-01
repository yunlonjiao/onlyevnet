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
    ribbon1:'摊位公开中',
    ribbon2:'特典票限量',
    ribbon3:'COS 自由行开放',
    ribbon4:'舞台企划更新',
    modules:{ribbon:true,highlights:true,guests:false,freewalk:false,itasha:false,community:true,sponsors:false},
    passport:{
      required:3,
      reward:'完成 3 个印章可领取限定纪念物',
      tasks:[
        {id:'a',name:'同人摊位街区',location:'A区',code:'A',target:'booths'},
        {id:'b',name:'主舞台',location:'舞台区',code:'B',target:'activities'},
        {id:'c',name:'COS 合影',location:'COS区',code:'C',target:'freewalk'},
        {id:'d',name:'特别企划',location:'企划区',code:'D',target:'highlights'},
        {id:'e',name:'痛车展示',location:'展示区',code:'E',target:'itasha'}
      ]
    },
    heroImage:'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=84&w=1600',
    ticketUrl:'https://www.bilibili.com/',
    tickets:[
      {id:'t1',name:'普通票',price:'¥68',gift:'入场资格',note:'实际购买与退款规则以售票平台为准',image:''},
      {id:'t2',name:'特典票',price:'¥128',gift:'入场资格\n限定徽章\n纪念票根',note:'限量发售',image:''},
      {id:'t3',name:'VIP 票',price:'¥198',gift:'优先入场\n限定礼包\n舞台优先区',note:'赠品内容由主办方填写',image:''}
    ],
    highlights:[
      {id:'h1',stamp:'STAMP 01',title:'集章挑战',text:'在指定摊位完成互动，集齐印章兑换限定纪念物。',tone:'#ffe45c'},
      {id:'h2',stamp:'STAMP 02',title:'应援留言墙',text:'现场留下角色应援与周年留言，闭幕前公开展示。',tone:'#59d4ff'},
      {id:'h3',stamp:'STAMP 03',title:'主题合影',text:'指定时段进行 COS / 自由行主题大合影。',tone:'#ff9dbb'}
    ],
    booths:[
      {id:'b1',no:'A01',name:'星屑工房',type:'同人本 · 亚克力'},
      {id:'b2',no:'A12',name:'薄荷书室',type:'插画 · 明信片'},
      {id:'b3',no:'B07',name:'白昼制品',type:'徽章 · 色纸'}
    ],
    schedule:[
      {id:'s1',time:'11:00',title:'开场 & 社群合影',stage:'MAIN STAGE',detail:'活动开场与全体社群合影。'},
      {id:'s2',time:'13:30',title:'主题问答 / 互动游戏',stage:'TALK',detail:'主题问答、观众互动与现场小游戏。'},
      {id:'s3',time:'15:00',title:'COS 特别舞台',stage:'MAIN STAGE',detail:'COS 舞台展示与主题合影活动。'},
      {id:'s4',time:'17:30',title:'幸运抽选 & 闭幕',stage:'MAIN STAGE',detail:'幸运抽选、闭幕致谢与活动结束提醒。'}
    ],
    guests:[
      {id:'g1',name:'特邀嘉宾',role:'Guest / Creator',intro:'嘉宾介绍与作品信息由主办方填写。'}
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