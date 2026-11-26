export const GUIDE_PRESETS={
 traffic:{preset:'traffic',title:'交通到达',label:'ACCESS',text:'',image:''},
 admission:{preset:'admission',title:'入场须知',label:'ENTRY',text:''},
 facilities:{preset:'facilities',title:'场馆设施',label:'FACILITY',text:''},
 cosplay:{preset:'cosplay',title:'COS / 道具规则',label:'COSPLAY',text:''},
 safety:{preset:'safety',title:'安全与禁止事项',label:'SAFETY',text:''}
};
export const PARTICIPATION_PRESETS={
 stage:{preset:'stage',activityType:'general',title:'舞台活动',meta:'主舞台 · 时间待定',text:'主舞台节目、Talk、表演或特别企划。',detail:'这里填写舞台活动的完整介绍，例如节目内容、出演阵容、流程亮点和观众可以参与的环节。',participationMode:'现场自由观看',requirements:'如有座位区、排队、年龄或入场限制，请在这里填写。',rules:'请听从现场工作人员引导；具体开始时间以当天现场为准。',target:'activities',url:'',guestIds:[]},
 guest:{preset:'guest',activityType:'guest',title:'嘉宾见面会',meta:'主舞台 · 时间待定',text:'嘉宾见面、访谈、Q&A 与现场互动。',detail:'这里填写嘉宾互动的主题、访谈内容、现场问答或特别环节。',participationMode:'按现场规则入场',requirements:'如设置内场席位、号码牌或提问征集，可在这里说明。',rules:'请尊重嘉宾与现场秩序；拍照、录像及互动方式以主办方现场规则为准。',target:'activities',url:'',guestIds:[]},
 signing:{preset:'signing',activityType:'signing',title:'嘉宾签售',meta:'签售区 · 时间待定',text:'嘉宾签名、签绘、交流或合影活动。',detail:'这里填写签售对象、参与资格、可签物品、互动时长以及现场流程。',participationMode:'凭签售资格按号码牌顺序参加',requirements:'请提前准备需要签名的官方周边或指定物品；如需购买资格商品请写明。',rules:'请按工作人员叫号排队，禁止插队；拍照、录像、握手、合影和礼物接收规则以现场公告为准。',signingRules:'示例：每人限签 2 件；To 签内容请提前准备；不签私物；签售过程中不安排合影。',target:'activities',url:'',guestIds:[]},
 live:{preset:'live',activityType:'live',title:'乐队Live',meta:'主舞台 · 时间待定',text:'ACG 乐队、主题 Live 或特别音乐舞台。',detail:'这里填写乐队Live的出演介绍、演出主题和现场亮点。',participationMode:'现场自由观看',requirements:'如有前排区、站席、应援棒或禁止携带物品要求，请在这里填写。',rules:'请勿冲撞舞台或影响周围观众；摄影、录像及应援方式以现场规则为准。',setlist:'Opening Theme\nCharacter Song\nSpecial Medley',target:'activities',url:'',guestIds:[]},
 randomDance:{preset:'randomDance',activityType:'interactive',title:'随机舞蹈',meta:'随机舞蹈区 · 时间待定',text:'随机舞蹈、宅舞自由舞台或主题舞蹈活动。',detail:'这里填写活动形式、歌曲范围、领舞安排和每轮流程。',participationMode:'现场自由参加',requirements:'建议提前查看公开歌单；请在指定区域内参与，注意与其他参与者保持安全距离。',rules:'禁止危险动作、推搡和占用通道；歌曲与活动轮次以现场实际播放为准。',target:'activities',url:'',guestIds:[]},
 stamp:{preset:'stamp',activityType:'venue',title:'集章打卡',meta:'活动区域 · 全天',text:'场内集章、打卡点或完成任务兑换奖励。',detail:'这里填写需要前往的打卡点、任务内容、集章数量以及完成后的兑换方式。',participationMode:'领取集章卡后自由参加',requirements:'请保管好集章卡；部分点位可能需要完成指定互动后才能盖章。',rules:'每人每个点位通常限盖一次；奖品数量有限，兑完即止。',activityLocation:'场内各打卡点',availabilityNote:'开展期间开放',target:'activities',url:'',guestIds:[]},
 game:{preset:'game',activityType:'interactive',title:'互动游戏',meta:'互动区 · 时间待定',text:'现场小游戏、问答、抽选或观众挑战。',detail:'这里填写游戏玩法、参与人数、每轮时间、奖励内容和主持流程。',participationMode:'现场报名后排队参加',requirements:'如有年龄、人数、组队、道具或答题要求，请在这里填写。',rules:'请按照工作人员安排依次参与；同一项目重复参与次数可由主办方自行限制。',target:'activities',url:'',guestIds:[]},
 photo:{preset:'photo',activityType:'interactive',title:'主题合影',meta:'集合区域 · 时间待定',text:'角色、嘉宾或同好主题集合拍摄。',detail:'这里填写集合主题、参与角色范围、拍摄流程以及摄影安排。',participationMode:'在指定时间到集合点自由参加',requirements:'请提前到达集合点并听从站位安排；大型道具需确保安全。',rules:'请勿遮挡通道；拍摄结束后及时疏散，返图与公开发布规则由主办方自行说明。',target:'activities',url:'',guestIds:[]},
 cosplay:{preset:'cosplay',activityType:'venue',title:'COS活动',meta:'COS 区 · 全天',text:'COS 自由舞台、摄影区或角色集合活动。',detail:'这里填写区域用途、自由舞台报名方式、摄影规则或角色集合安排。',participationMode:'开放区域自由参与',requirements:'大型道具、摄影灯具和三脚架请遵守场馆及主办方尺寸与安全要求。',rules:'尊重 Coser 拍摄意愿；未经同意请勿近距离拍摄或触碰服装道具。',activityLocation:'COS摄影区',availabilityNote:'开展期间开放',target:'activities',url:'',guestIds:[]},
 itasha:{preset:'itasha',activityType:'venue',title:'痛车展示',meta:'展示区 · 全天',text:'痛车、模型、应援物或大型主题展示。',detail:'这里填写展示主题、参展阵容、车辆与展品介绍和推荐打卡内容。',participationMode:'开放区域自由参观',requirements:'请在围栏或划定区域外观看；如开放合影请按现场指引进行。',rules:'禁止触碰、倚靠车辆或展品；请勿阻塞展示区通道。',activityLocation:'主题展示区',availabilityNote:'开展期间开放',target:'activities',url:'',guestIds:[]},
 support:{preset:'support',activityType:'venue',title:'应援专区',meta:'主题专区 · 全天',text:'角色应援、纪念墙、留言区或主题互动专区。',detail:'这里填写应援主题、现场布置、留言、打卡方式与展示内容。',participationMode:'开放区域自由参与',requirements:'如需自带应援物、填写留言卡或完成指定任务，请在这里说明。',rules:'请爱护现场布置与公共物料；禁止张贴未经主办允许的内容。',activityLocation:'主题专区',availabilityNote:'开展期间开放',target:'activities',url:'',guestIds:[]}
};

export const CUSTOM_PAGE_PRESETS={
 custom:{title:'自定义展示页',eyebrow:'SPECIAL',intro:'用于其他信息量较大、需要独立浏览的专题内容。',itemTitle:'内容',titleLabel:'标题',metaLabel:'副标题或位置',textLabel:'介绍',ratio:1.333333},

 cosplay:{title:'COS自由行',eyebrow:'COSPLAY',intro:'展示参加自由行的 Coser 阵容、角色、作品和出席信息。',itemTitle:'Coser',titleLabel:'CN或昵称',metaLabel:'角色与作品',textLabel:'简介与出席信息',ratio:.8},
 photographer:{title:'摄影师阵容',eyebrow:'PHOTOGRAPHER',intro:'展示摄影师阵容、拍摄风格、约拍说明和出席时段。',itemTitle:'摄影师',titleLabel:'CN或昵称',metaLabel:'拍摄风格',textLabel:'简介与约拍信息',ratio:.8},
 itasha:{title:'痛车展示',eyebrow:'ITASHA',intro:'集中展示参加活动的痛车、车主、主题和车辆信息。',itemTitle:'车辆',titleLabel:'车主或展示名',metaLabel:'IP与角色主题',textLabel:'车辆介绍与展示信息',ratio:1.5},

 food:{title:'餐饮指南',eyebrow:'FOOD & DRINK',intro:'展示场内或合作餐饮、菜单、价格、位置和推荐内容。',itemTitle:'餐饮',titleLabel:'店铺或餐饮名',metaLabel:'位置与价格',textLabel:'介绍与推荐内容',ratio:1.333333},
 officialShop:{title:'官方物贩',eyebrow:'OFFICIAL SHOP',intro:'展示官方周边、限定商品、售价、销售位置和购买限制。',itemTitle:'商品',titleLabel:'商品名称',metaLabel:'价格与销售位置',textLabel:'商品说明与购买限制',ratio:1},
 brand:{title:'品牌展商',eyebrow:'BRAND',intro:'集中展示合作品牌、企业展商、展位信息和现场展示内容。',itemTitle:'展商',titleLabel:'品牌或展商名',metaLabel:'展位与合作内容',textLabel:'品牌介绍与现场展示',ratio:1.333333},

 oc:{title:'原创OC展',eyebrow:'ORIGINAL CHARACTER',intro:'集中展示原创角色设定、世界观、立绘、设定图和创作者信息。',itemTitle:'OC',titleLabel:'角色或作品名',metaLabel:'作者与作品类型',textLabel:'角色设定与作品介绍',ratio:.8},
 illustration:{title:'插画作品展',eyebrow:'ILLUSTRATION',intro:'展示插画、原画、视觉设计等平面作品与作者信息。',itemTitle:'作品',titleLabel:'作品名称',metaLabel:'作者与类型',textLabel:'作品介绍与创作说明',ratio:1.333333},
 comic:{title:'漫画作品展',eyebrow:'COMIC',intro:'展示漫画、短篇、四格、连载作品和作者信息。',itemTitle:'作品',titleLabel:'漫画名称',metaLabel:'作者与类型',textLabel:'作品简介与阅读说明',ratio:.75},
 novel:{title:'小说作品展',eyebrow:'NOVEL',intro:'展示同人小说、原创小说、短篇文本和作者信息。',itemTitle:'作品',titleLabel:'作品名称',metaLabel:'作者与题材',textLabel:'作品简介与阅读说明',ratio:.75},
 craft:{title:'手作展示',eyebrow:'HANDCRAFT',intro:'展示饰品、布艺、黏土、手工制品等实体创作。',itemTitle:'作品',titleLabel:'作品名称',metaLabel:'作者与材料',textLabel:'制作介绍与展示信息',ratio:1},
 model:{title:'模型展示',eyebrow:'MODEL',intro:'展示模型、GK、手办改造、场景模型等实体作品。',itemTitle:'模型',titleLabel:'作品名称',metaLabel:'作者与类型',textLabel:'制作介绍与展示信息',ratio:1.333333},
 prop:{title:'道具展示',eyebrow:'PROP',intro:'展示武器道具、盔甲、服装道具和大型制作物。',itemTitle:'道具',titleLabel:'作品名称',metaLabel:'作者与作品来源',textLabel:'制作介绍与展示说明',ratio:1.5},

 gameDemo:{title:'游戏试玩',eyebrow:'GAME DEMO',intro:'展示电子游戏、独立游戏和现场试玩项目。',itemTitle:'游戏',titleLabel:'游戏名称',metaLabel:'类型与试玩位置',textLabel:'玩法介绍与试玩说明',ratio:1.777778},
 tabletop:{title:'桌游专区',eyebrow:'TABLETOP',intro:'展示桌游项目、桌台安排、参与人数和预约信息。',itemTitle:'桌游',titleLabel:'游戏名称',metaLabel:'位置与人数',textLabel:'规则与参与说明',ratio:1.333333},
 cardGame:{title:'卡牌专区',eyebrow:'CARD GAME',intro:'展示集换式卡牌、牌桌活动、赛制和参与说明。',itemTitle:'卡牌项目',titleLabel:'项目名称',metaLabel:'位置与赛制',textLabel:'规则与参与说明',ratio:1.333333},

 freebie:{title:'无料交换',eyebrow:'FREEBIE',intro:'展示无料、交换物、领取条件、交换规则和作者信息。',itemTitle:'无料或交换物',titleLabel:'名称',metaLabel:'作者与领取位置',textLabel:'领取条件与交换说明',ratio:1},
 support:{title:'应援企划',eyebrow:'FAN PROJECT',intro:'用于生日应援、角色纪念、痛楼、留言墙等内容量较大的同好企划。',itemTitle:'企划',titleLabel:'企划名称',metaLabel:'角色与展示位置',textLabel:'企划介绍与参与方式',ratio:.8},
 exhibition:{title:'主题展览',eyebrow:'EXHIBITION',intro:'用于原画展、设定展、历史回顾、纪念展等独立主题内容。',itemTitle:'展项',titleLabel:'展项名称',metaLabel:'主题与位置',textLabel:'展项介绍与展示说明',ratio:1.333333}
};

export const CUSTOM_PAGE_STARTERS={
 custom:[
  ['专题内容 01','时间 · 地点','核心介绍 · 参与方式 · 注意事项'],
  ['专题内容 02','区域 · 时段','补充内容 · 现场信息 · 关联说明'],
  ['专题内容 03','状态 · 标签','扩展介绍 · 外部链接 · 更新信息']
 ],
 cosplay:[
  ['参展 Coser 01','角色名 · 作品名','出席时段 · 集合信息 · 社交平台说明'],
  ['参展 Coser 02','角色名 · 作品名','出席时段 · 集合信息 · 摄影说明'],
  ['参展 Coser 03','角色名 · 作品名','出席时段 · 互动信息 · 注意事项']
 ],
 photographer:[
  ['摄影师 01','人像 · 场照','出席时段 · 约拍方式 · 返图说明'],
  ['摄影师 02','舞台 · 抓拍','活动区域 · 拍摄偏好 · 联系方式'],
  ['摄影师 03','胶片 · 氛围','出席时间 · 预约方式 · 作品平台']
 ],
 itasha:[
  ['痛车 01','作品名 · 角色名','车型 · 车主 · 展示时段 · 展示区域'],
  ['痛车 02','作品名 · 角色名','车型 · 改装主题 · 展示信息'],
  ['痛车 03','作品名 · 角色名','车辆亮点 · 拍摄说明 · 现场位置']
 ],
 food:[
  ['推荐餐饮 01','场馆内 · ¥--','主打餐品 · 营业时间 · 位置说明'],
  ['推荐餐饮 02','场馆周边 · ¥--','推荐菜单 · 距离 · 营业时段'],
  ['补给点 03','饮品 · 轻食','价格区间 · 排队提示 · 位置说明']
 ],
 officialShop:[
  ['限定商品 01','¥-- · 官方物贩区','规格 · 限购数量 · 销售时段'],
  ['限定商品 02','¥-- · 官方物贩区','商品内容 · 购买限制 · 库存提示'],
  ['会场特典 03','消费条件 · 领取处','领取条件 · 数量限制 · 发放时间']
 ],
 brand:[
  ['品牌展商 01','展位号待填 · 合作内容','品牌简介 · 现场展示 · 互动内容'],
  ['品牌展商 02','展位号待填 · 展示主题','产品体验 · 领取活动 · 现场说明'],
  ['品牌展商 03','展位号待填 · 联动企划','合作信息 · 展示内容 · 外部平台']
 ],
 oc:[
  ['原创角色 01','创作者 · 世界观','角色设定 · 性格 · 背景故事'],
  ['原创角色 02','创作者 · 世界观','角色关系 · 设定亮点 · 展示内容'],
  ['原创角色 03','创作者 · 企划名','视觉设定 · 创作说明 · 作者信息']
 ],
 illustration:[
  ['插画作品 01','作者 · 原创 / 同人','作品主题 · 创作说明 · 展示信息'],
  ['插画作品 02','作者 · 系列名','画面主题 · 创作时间 · 作者平台'],
  ['插画作品 03','作者 · 作品类型','作品简介 · 使用媒介 · 展示说明']
 ],
 comic:[
  ['漫画作品 01','作者 · 短篇 / 连载','作品简介 · 话数 · 阅读说明'],
  ['漫画作品 02','作者 · 四格 / 故事','题材 · 角色 · 展示范围'],
  ['漫画作品 03','作者 · 系列名','故事梗概 · 更新状态 · 阅读入口']
 ],
 novel:[
  ['小说作品 01','作者 · 题材','作品简介 · 篇幅 · 阅读说明'],
  ['小说作品 02','作者 · 短篇 / 连载','题材标签 · 角色 · 更新状态'],
  ['小说作品 03','作者 · 系列名','故事梗概 · 篇幅 · 阅读入口']
 ],
 craft:[
  ['手作作品 01','作者 · 材料','制作工艺 · 尺寸 · 展示说明'],
  ['手作作品 02','作者 · 材料','制作时间 · 作品亮点 · 现场信息'],
  ['手作作品 03','作者 · 系列名','材质 · 工艺 · 创作说明']
 ],
 model:[
  ['模型作品 01','作者 · GK / 改造','比例 · 材料 · 制作说明'],
  ['模型作品 02','作者 · 场景模型','比例 · 制作周期 · 展示亮点'],
  ['模型作品 03','作者 · 手办改造','原型 · 涂装 · 制作说明']
 ],
 prop:[
  ['道具作品 01','作者 · 作品来源','尺寸 · 材料 · 制作说明'],
  ['道具作品 02','作者 · 角色来源','结构 · 工艺 · 展示注意事项'],
  ['道具作品 03','作者 · 大型制作','材料 · 制作周期 · 展示方式']
 ],
 gameDemo:[
  ['试玩项目 01','独立游戏 · 试玩区','平台 · 核心玩法 · 单次试玩时长'],
  ['试玩项目 02','动作 / 解谜 · 试玩区','操作方式 · 排队提示 · 试玩内容'],
  ['试玩项目 03','多人游戏 · 试玩区','支持人数 · 试玩规则 · 开放时段']
 ],
 tabletop:[
  ['桌游项目 01','4 人 · 60 分钟','适合人数 · 单局时长 · 报名方式'],
  ['桌游项目 02','2–6 人 · 桌游区','规则难度 · 开桌时间 · 参与说明'],
  ['桌游项目 03','组队体验 · 桌游区','推荐人数 · 游戏时长 · 预约信息']
 ],
 cardGame:[
  ['卡牌活动 01','对战区 · 赛制待填','报名方式 · 轮次 · 奖励说明'],
  ['卡牌活动 02','自由对战 · 卡牌区','开放时段 · 卡组要求 · 参与规则'],
  ['卡牌活动 03','教学体验 · 卡牌区','参与对象 · 教学时段 · 现场规则']
 ],
 freebie:[
  ['无料 01','作者 · 领取点','数量 · 领取条件 · 发放时段'],
  ['交换物 02','作者 · 交换区','交换条件 · 数量 · 注意事项'],
  ['无料 03','作者 · 展位 / 区域','领取规则 · 限量说明 · 补充信息']
 ],
 support:[
  ['应援企划 01','角色名 · 展示区','企划主题 · 参与方式 · 开放时段'],
  ['留言企划 02','角色名 · 留言区','参与规则 · 留言方式 · 展示说明'],
  ['纪念企划 03','纪念主题 · 展示区','企划内容 · 互动方式 · 注意事项']
 ],
 exhibition:[
  ['展项 01','主题 · 展区','展项介绍 · 展示内容 · 观看说明'],
  ['展项 02','主题 · 展区','历史背景 · 作品信息 · 展示重点'],
  ['展项 03','主题 · 展区','关联内容 · 展示方式 · 观看提示']
 ]
};
