/*
 * IP ONLY organizer editing-purpose contract.
 * Template 01 defines WHAT organizers can control; visual templates define HOW
 * that same purpose is presented.
 */

export const IP_ONLY_EDIT_PURPOSES=Object.freeze([
  {id:'eventName',scope:'shared',purpose:'活动品牌名称；用于页头、页脚和活动身份识别',surface:'identity',mode:'inline+inspector'},
  {id:'tagline',scope:'shared',purpose:'一句话活动定位/简介；帮助游客快速理解活动是什么',surface:'hero',mode:'inline+inspector'},
  {id:'heroTitle1',scope:'shared',purpose:'主视觉标题第 1 行；用于活动主标题排版',surface:'hero',mode:'inline+inspector'},
  {id:'heroTitle2',scope:'shared',purpose:'主视觉标题第 2 行；用于活动主标题排版',surface:'hero',mode:'inline+inspector'},
  {id:'heroTitle3',scope:'shared',purpose:'主视觉标题第 3 行；用于活动主标题排版',surface:'hero',mode:'inline+inspector'},
  {id:'date',scope:'shared',purpose:'活动日期；首页、页脚和其他信息面可镜像显示',surface:'event-meta',mode:'inline+inspector'},
  {id:'location',scope:'shared',purpose:'举办城市；帮助游客确认活动所在地',surface:'event-meta',mode:'inline+inspector'},
  {id:'edition',scope:'shared',purpose:'场馆名称/届次信息；与导航链接配合使用',surface:'event-meta',mode:'inline+inspector'},
  {id:'navigationUrl',scope:'shared',purpose:'场馆外部导航地址；游客点击后打开地图服务',surface:'event-meta',mode:'inspector'},
  {id:'heroImage',scope:'shared',purpose:'桌面端主视觉 KV',surface:'hero-media',mode:'image+inspector'},
  {id:'mobileHeroImage',scope:'shared',purpose:'手机端独立主视觉 KV',surface:'hero-media',mode:'inspector'},
  {id:'heroFocalDesktop',scope:'shared',purpose:'桌面 KV 焦点，避免裁掉人物/标题',surface:'hero-media',mode:'inspector'},
  {id:'heroFocalMobile',scope:'shared',purpose:'手机 KV 焦点，避免响应式裁切破坏构图',surface:'hero-media',mode:'inspector'},
  {id:'heroTitleSize',scope:'shared',purpose:'主标题尺寸；适配不同活动名长度',surface:'hero',mode:'inspector'},
  {id:'heroTitleColor',scope:'shared',purpose:'主标题主色；适配活动主视觉',surface:'theme',mode:'inspector'},
  {id:'heroTitleAccentColor',scope:'shared',purpose:'标题强调色；建立活动自身视觉识别',surface:'theme',mode:'inspector'},
  {id:'ticketUrl',scope:'shared',purpose:'官方售票平台外链',surface:'ticket',mode:'inspector'},
  {id:'ticketLinkLabel',scope:'shared',purpose:'购票 CTA 文案',surface:'ticket',mode:'inspector'},
  {id:'tickets',scope:'shared',purpose:'票种、价格、特典、说明与票图',surface:'ticket',mode:'item+inspector'},
  {id:'updates',scope:'shared',purpose:'重要通知、变更与参展资讯',surface:'news',mode:'item+inspector'},
  {id:'featuredActivities',scope:'shared',purpose:'首页重点活动入口；从活动记录中选择展示',surface:'home-feature',mode:'relation+inspector'},
  {id:'venueMap',scope:'shared',purpose:'场地图与区域/内容跳转',surface:'map',mode:'image+relation+inspector'},
  {id:'booths',scope:'shared',purpose:'社团摊位信息、摊位号、分类、简介与 LOGO',surface:'booth',mode:'item+inline+inspector'},
  {id:'products',scope:'shared',purpose:'制品名称、标签、价格、图片与说明',surface:'product',mode:'item+inline+inspector'},
  {id:'participation',scope:'shared',purpose:'舞台活动、嘉宾互动及其他活动详情',surface:'activity',mode:'item+inline+inspector'},
  {id:'schedule',scope:'shared',purpose:'当天日程、时间、场地与活动关联',surface:'schedule',mode:'item+inline+inspector'},
  {id:'guests',scope:'shared',purpose:'嘉宾/团体资料、作品、介绍、图片和社交链接',surface:'guest',mode:'item+inline+inspector'},
  {id:'guide',scope:'shared',purpose:'交通、入场、设施、COS、安全等观展指南',surface:'guide',mode:'item+inline+inspector'},
  {id:'socialLinks',scope:'shared',purpose:'游客群、摊主群、B站、小红书等官方渠道',surface:'community',mode:'item+inline+inspector'},
  {id:'sponsors',scope:'shared',purpose:'合作伙伴名称、LOGO 与外链',surface:'sponsor',mode:'item+inline+inspector'},
  {id:'customPages',scope:'shared',purpose:'主办方自建一级页面及其内容',surface:'navigation',mode:'page+inspector'},

  // Template 01 presentation-only controls: keep only when the reference design needs them.
  {id:'sticker1',scope:'presentation-optional',purpose:'01 主视觉装饰短句，不是业务数据',surface:'hero-decoration',mode:'inline'},
  {id:'sticker2',scope:'presentation-optional',purpose:'01 主视觉装饰短句，不是业务数据',surface:'hero-decoration',mode:'inline'},
  {id:'sticker3',scope:'presentation-optional',purpose:'01 主视觉装饰短句，不是业务数据',surface:'hero-decoration',mode:'inline'},
  {id:'ribbonItems',scope:'presentation-optional',purpose:'滚动公告，仅启用 ribbon 的模板需要',surface:'ribbon',mode:'inline+inspector'}
]);

export const IP_ONLY_REQUIRED_SHARED_EDIT_IDS=Object.freeze(
  IP_ONLY_EDIT_PURPOSES.filter(x=>x.scope==='shared').map(x=>x.id)
);

export function getIpOnlyEditPurpose(id){
  return IP_ONLY_EDIT_PURPOSES.find(x=>x.id===id)||null;
}
