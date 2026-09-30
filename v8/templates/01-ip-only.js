export const template01 = {
  id:'01-ip-only',
  name:'01 · IP ONLY',
  defaults:{
    eventName:'STARDUST ONLY 2026',
    date:'2026.11.08',
    location:'杭州',
    tagline:'围绕单一作品 IP 的粉丝综合活动。主办方负责 KV、活动信息和内容；网站负责把摊位、嘉宾、舞台、地图与特别企划组织成完整官网。',
    theme:'#ff5f91',
    sticker1:'限定企划 ✦',
    sticker2:'40+ 社团',
    sticker3:'COS OK!',
    ribbon1:'摊位公开中',
    ribbon2:'特典票限量',
    ribbon3:'COS 自由行开放',
    ribbon4:'舞台企划更新',
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
      {id:'s1',time:'11:00',title:'开场 & 社群合影',stage:'MAIN STAGE'},
      {id:'s2',time:'13:30',title:'主题问答 / 互动游戏',stage:'TALK'},
      {id:'s3',time:'15:00',title:'COS 特别舞台',stage:'MAIN STAGE'},
      {id:'s4',time:'17:30',title:'幸运抽选 & 闭幕',stage:'MAIN STAGE'}
    ]
  }
};