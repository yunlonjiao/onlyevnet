# Template 01 完整功能清单 / Capability Checklist

> **定位**
>
> Template 01 是 IP ONLY 系列的**功能基准**，不是视觉母版。
>
> 新模板开发顺序：
>
> **01 能力清单 → 参考网站原生复刻 → 能力映射 → 视觉/功能平衡 → 功能与视觉双验收**
>
> 任何新模板都不应从 01 的 DOM / 卡片 / 配色 / section 结构出发“换皮”。

---

## 0. 能力分级

### A. 必须继承
如果缺少，会直接损失主办方或游客的业务能力。

### B. 条件继承
只有参考网站适合时才展示，但 Shared Core 要能支持。

### C. 仅 01 表现层
只是 Template 01 的美术/交互表达，其他模板不需要照搬。

---

# 1. 活动基础信息

## 1.1 活动身份 — A 必须继承

- [ ] 活动名 `eventName`
  - 用途：活动自己的品牌名称
  - 可能出现：页头、Footer、开场动画、SEO
  - 要求：多处出现时必须镜像同步，不能复制第二份硬编码数据

- [ ] Hero 三行标题
  - `heroTitle1`
  - `heroTitle2`
  - `heroTitle3`
  - 用途：主视觉中的强排版标题
  - 要求：模板可以完全改变排版方式，但必须保留三段独立编辑能力

- [ ] 活动简介 / tagline
  - 用途：游客快速知道“这是什么活动”
  - 禁止：游客页面出现“主办方可替换”“这里填写”等设计说明

- [ ] 活动日期 `date`
- [ ] 举办城市 `location`
- [ ] 场馆 / 届次 `edition`
- [ ] 场馆导航 URL `navigationUrl`
  - 用途：点击场馆后跳外部地图/导航

---

# 2. 主视觉与媒体

## 2.1 KV — A 必须继承

- [ ] 桌面端 KV `heroImage`
- [ ] 手机端独立 KV `mobileHeroImage`
- [ ] 桌面焦点 `heroFocalDesktop`
- [ ] 手机焦点 `heroFocalMobile`
- [ ] 图片加载失败 fallback
- [ ] lazy loading / async decode
- [ ] 编辑模式点击图片进入图片编辑

## 2.2 Hero 视觉控制 — A 必须继承

- [ ] Hero 标题字号 `heroTitleSize`
- [ ] Hero 主色 `heroTitleColor`
- [ ] Hero 强调色 `heroTitleAccentColor`

用途：
- 让不同活动名长度、KV 颜色和视觉风格能适配模板
- 不等于允许主办方自由破坏模板结构

## 2.3 Template 01 Sticker — C 仅 01 表现层

- [ ] Sticker 1
- [ ] Sticker 2
- [ ] Sticker 3

说明：
- 只是 01 的视觉语言
- 新模板不要求存在
- 参考站如果有类似贴纸/角标，可重新映射

---

# 3. 活动生命周期

## 3.1 状态控制 — A 必须继承

- [ ] 自动状态
- [ ] 手动状态
- [ ] 开始时间 `eventStartDateTime`
- [ ] 结束时间 `eventEndDateTime`
- [ ] upcoming
- [ ] live
- [ ] ended

## 3.2 生命周期行为 — A 必须继承

- [ ] 未开始状态提示
- [ ] 进行中状态提示
- [ ] 已结束状态提示
- [ ] 已结束后隐藏购票 CTA
- [ ] 进行中时快捷入口可优先日程/场地图
- [ ] 已结束时快捷入口不再突出购票
- [ ] 修改时间后立即刷新状态

---

# 4. 开场动画 / Entry

## 4.1 Shared Core 能力 — B 条件继承

- [ ] 开关
- [ ] 跳过按钮
- [ ] 标题
- [ ] 副标题
- [ ] 标签
- [ ] 日期
- [ ] 时间
- [ ] 地点
- [ ] KV / 自定义图
- [ ] 强调色
- [ ] 票号
- [ ] 动画时长
- [ ] reduced motion

说明：
- “开场动画能力”属于 Shared Core
- **是否展示、展示成什么样**由参考网站决定
- 参考网站没有 splash，就不要强行加

---

# 5. 首页模块

## 5.1 重要更新 / NEWS — A 必须继承

- [ ] 更新日期
- [ ] 更新标题
- [ ] 跳转目标
- [ ] 直接编辑
- [ ] 右侧完整编辑
- [ ] 可跳首页 section 或一级页面

用途：
- 临时变更
- 场地图更新
- 嘉宾/日程公开
- 入场规则变化

## 5.2 Quick Access — B 条件继承

默认入口能力：
- [ ] 票务
- [ ] 摊位
- [ ] 活动
- [ ] 指南
- [ ] 场地图

要求：
- 根据模块开关自动隐藏
- lifecycle-aware
- 新模板可完全不用“卡片”表现
- 可以变成菜单、目录、索引、侧边导航等

## 5.3 Ribbon — B 条件继承

- [ ] 多段滚动文字
- [ ] 每段文字可编辑
- [ ] 模块可关闭

说明：
- 只在参考站视觉需要时使用

## 5.4 活动精选 — A 必须继承

- [ ] 首页最多 3 个重点活动
- [ ] 从已有活动记录关联
- [ ] 不能创建一套脱离活动页的假数据
- [ ] 点击能到活动详情
- [ ] 活动图片/标题/类型/说明同步

## 5.5 Module Visibility — A 必须继承

至少包含：
- [ ] 摊位
- [ ] 活动
- [ ] 嘉宾
- [ ] 指南
- [ ] 社群
- [ ] 赞助
- [ ] Ribbon
- [ ] 自定义页面

要求：
- 编辑模式仍可进入关闭模块进行设置
- 游客模式隐藏关闭模块
- 导航同步隐藏

---

# 6. 票务

## 6.1 票种集合 — A 必须继承

每个票种：
- [ ] 票名
- [ ] 价格
- [ ] 特典
- [ ] 说明
- [ ] 图片

## 6.2 票务行为 — A 必须继承

- [ ] 外部售票 URL
- [ ] CTA 文案
- [ ] 票图点击放大
- [ ] 已结束自动隐藏购票 CTA
- [ ] 不做站内支付

---

# 7. 摊位 / 社团

## 7.1 摊位字段 — A 必须继承

- [ ] 摊位号
- [ ] 社团名
- [ ] 社团类型
- [ ] 简介
- [ ] Logo

## 7.2 摊位目录功能 — A 必须继承

- [ ] 摊位 / 制品双视图
- [ ] 搜索
- [ ] 搜索范围至少覆盖名称 / Tag
- [ ] 分页
- [ ] 收藏社团
- [ ] 收藏数量
- [ ] 只看收藏
- [ ] 收藏状态 localStorage 持久化
- [ ] 删除无效 ID
- [ ] 从摊位直接进入该摊位制品
- [ ] 空结果提示
- [ ] 清空搜索/筛选

## 7.3 编辑能力 — A 必须继承

- [ ] 卡片空白区域点击 → 右侧完整编辑器
- [ ] 文本直接 inline edit
- [ ] Logo 点击 → 图片编辑
- [ ] 编辑和游客交互互不冲突

---

# 8. 制品

## 8.1 制品字段 — A 必须继承

- [ ] 名称
- [ ] Tag
- [ ] 价格
- [ ] 说明
- [ ] 图片
- [ ] 所属摊位

## 8.2 游客功能 — A 必须继承

- [ ] 制品搜索
- [ ] 心愿单
- [ ] 心愿数量
- [ ] 只看心愿
- [ ] 图片点击放大
- [ ] 由摊位筛选对应制品

## 8.3 编辑能力 — A 必须继承

- [ ] 点击卡片 → 制品完整编辑
- [ ] 点击图片 → 图片编辑
- [ ] 文本可直接改

---

# 9. 活动 / 企划

## 9.1 活动字段 — A 必须继承

- [ ] preset
- [ ] activityType
- [ ] title
- [ ] meta
- [ ] text
- [ ] detail
- [ ] participationMode
- [ ] requirements
- [ ] rules
- [ ] url
- [ ] image

## 9.2 活动能力 — A 必须继承

- [ ] 活动详情页/视图
- [ ] 活动类型
- [ ] 外部报名 / 详情 URL
- [ ] 嘉宾关联
- [ ] 日程关联
- [ ] 首页精选关联
- [ ] 直接编辑
- [ ] 右侧完整编辑

---

# 10. 当天日程

## 10.1 日程字段 — A 必须继承

- [ ] 日期 / day
- [ ] 开始时间
- [ ] 结束时间
- [ ] 标题
- [ ] 场地 / stage
- [ ] 分类
- [ ] 详情
- [ ] guestIds
- [ ] registrationUrl
- [ ] participationId

## 10.2 日程行为 — A 必须继承

- [ ] 多日 Tab
- [ ] Day filtering
- [ ] timeline / programs 切换
- [ ] 关联活动
- [ ] 关联嘉宾
- [ ] 外部报名
- [ ] 点击行进入完整编辑器

---

# 11. 嘉宾

## 11.1 嘉宾类型 — A 必须继承

- [ ] 个人
- [ ] 双人
- [ ] 乐队 / 团体
- [ ] 官方 / 组织

## 11.2 嘉宾字段 — A 必须继承

- [ ] 名字
- [ ] 身份 / role
- [ ] members
- [ ] attendanceNote
- [ ] 代表作 works
- [ ] 介绍 intro
- [ ] 图片
- [ ] 社交平台名称
- [ ] 社交 URL
- [ ] appearance

## 11.3 嘉宾行为 — A 必须继承

- [ ] 图片放大
- [ ] 关联活动
- [ ] 关联日程
- [ ] 社交链接
- [ ] 卡片点击进入完整编辑器
- [ ] inline edit

---

# 12. 观展指南

## 12.1 Preset — A 必须继承

- [ ] 交通到达
- [ ] 入场
- [ ] 场馆设施
- [ ] COS
- [ ] 安全
- [ ] 自定义项

## 12.2 字段 — A 必须继承

- [ ] title
- [ ] label
- [ ] text
- [ ] image

## 12.3 行为 — A 必须继承

- [ ] 交通/入口图片
- [ ] 场馆导航链接
- [ ] 图片放大
- [ ] 独立详情渲染
- [ ] inline edit
- [ ] 右侧完整编辑

---

# 13. 场地图

## 13.1 地图能力 — A 必须继承

- [ ] 上传场地图
- [ ] 图片 fallback
- [ ] 地图链接列表
- [ ] 链接到活动
- [ ] 链接到摊位
- [ ] 链接到嘉宾
- [ ] 链接到 Guide
- [ ] 链接到一级页面 / 自定义内容

## 13.2 明确不要求

- [ ] 不要求地图拖拽点位编辑器
- [ ] 不要求复杂室内 GIS
- [ ] 不要求 01 之外新增“Now/Next”

---

# 14. 社群 / 官方渠道

## 14.1 字段 — A 必须继承

- [ ] 名称
- [ ] 说明
- [ ] URL
- [ ] 图片 / QR

用途示例：
- QQ群
- 微信群
- B站
- 小红书
- 微博
- X
- YouTube

## 14.2 行为 — A 必须继承

- [ ] 外部跳转
- [ ] 二维码 / 图片展示
- [ ] inline edit
- [ ] 右侧完整编辑

---

# 15. 赞助 / 合作伙伴

## 15.1 字段 — A 必须继承

- [ ] 名称
- [ ] Logo
- [ ] URL
- [ ] 级别（如存在）

## 15.2 行为 — A 必须继承

- [ ] 外部链接
- [ ] 空赞助自动隐藏游客模块
- [ ] 编辑模式仍可管理

---

# 16. Footer

## 16.1 Shared Footer 内容 — A 必须继承

- [ ] 活动品牌
- [ ] 活动日期 / 场馆
- [ ] 参展入口
- [ ] 观展入口
- [ ] 社交入口

说明：
- Footer 不要求长得像 01
- 允许参考站完全重新设计
- 但不能丢失主办方已经配置的有效入口

---

# 17. 自定义一级页面

## 17.1 页面管理 — A 必须继承

- [ ] 新建
- [ ] 删除
- [ ] 撤销删除
- [ ] 导航自动加入
- [ ] 游客独立页面
- [ ] 导出保留

## 17.2 支持内容类型 — A 必须继承

至少：
- [ ] gallery
- [ ] people
- [ ] product
- [ ] place
- [ ] showcase
- [ ] reading
- [ ] activity

## 17.3 预设页面

- [ ] 痛车 / Itasha
- [ ] 自由行 / Freewalk

说明：
- 是否默认展示由主办方决定
- 不应自动占据所有模板首页

---

# 18. SEO / 分享

## 18.1 SEO — A 必须继承

- [ ] pageTitle
- [ ] metaDescription
- [ ] canonical

## 18.2 Open Graph — A 必须继承

- [ ] ogTitle
- [ ] ogDescription
- [ ] ogImage
- [ ] ogUrl

## 18.3 分享封面

- [ ] 默认可回退到 Hero KV
- [ ] 可单独设置 OG image

---

# 19. 编辑器交互

## 19.1 双编辑模式 — A 必须继承

- [ ] 黄框 / 页面内直接编辑
- [ ] 右侧完整编辑器

## 19.2 点击规则 — A 必须继承

- [ ] 文字 → inline edit
- [ ] 图片 → 图片编辑
- [ ] 卡片空白 → 完整 item 编辑
- [ ] 外链在编辑模式不误跳
- [ ] 游客模式恢复真实跳转
- [ ] 编辑模式与预览模式隔离

## 19.3 Shared semantic protocol — A 必须继承

- [ ] `data-oe-field`
- [ ] `data-oe-item`
- [ ] `data-oe-index`
- [ ] `data-oe-image`
- [ ] `data-page-link`
- [ ] `data-target-mode`

---

# 20. 导航

## 20.1 一级页面 — A 必须继承

- [ ] 首页
- [ ] 摊位
- [ ] 活动
- [ ] 嘉宾
- [ ] 指南
- [ ] 自定义页面

## 20.2 行为 — A 必须继承

- [ ] Desktop navigation
- [ ] Mobile navigation
- [ ] Back navigation
- [ ] Hash / route state
- [ ] 页面切换
- [ ] 首页 section scroll
- [ ] 模块关闭时导航同步隐藏

说明：
- 具体导航 UI 完全由参考站决定

---

# 21. 游客状态

## 21.1 收藏 / 心愿 — A 必须继承

- [ ] 社团收藏
- [ ] 制品心愿
- [ ] localStorage
- [ ] 刷新后保留
- [ ] 无效 ID 自动清理
- [ ] 收藏筛选

---

# 22. 图片体验

## 22.1 图片能力 — A 必须继承

- [ ] broken image guard
- [ ] lazy loading
- [ ] async decoding
- [ ] lightbox
- [ ] 产品图片放大
- [ ] 嘉宾图片放大
- [ ] Guide 图片放大
- [ ] 票务特典图片放大

---

# 23. 响应式 / 可访问性

## 23.1 响应式 — A 必须继承

必须检查：
- [ ] 1440
- [ ] 1280
- [ ] 1024
- [ ] 768
- [ ] 430
- [ ] 390
- [ ] 320 equivalent reflow

要求：
- [ ] 无横向页面溢出
- [ ] 导航至少一种可用
- [ ] 标题不越界
- [ ] 卡片不被强行压窄
- [ ] 长文案安全换行
- [ ] 图片不破坏布局

## 23.2 Accessibility — A 必须继承

- [ ] 键盘可操作
- [ ] reduced motion
- [ ] aria pressed / selected
- [ ] 可点击元素语义正确
- [ ] 普通文本对比度可读
- [ ] 200% zoom 不丢内容

---

# 24. 发布 / 导出

## 24.1 Standalone HTML — A 必须继承

- [ ] 导出单 HTML
- [ ] 去除编辑器 metadata
- [ ] 保留游客交互
- [ ] 保留收藏/心愿
- [ ] 保留 lightbox
- [ ] 保留导航
- [ ] 保留 lifecycle
- [ ] 清理空编辑占位

## 24.2 Publisher — Studio 统一能力，不属于模板设计

所有模板统一使用同一个 OnlyEvent Publisher：

- [ ] 设置站点地址：`https://[slug].onlyevent.cn`
- [ ] 首次发布游客网站
- [ ] 再次发布更新同一个地址
- [ ] 打开已发布网站
- [ ] 复制网站链接
- [ ] 导出独立 HTML
- [ ] 发布后游客页不依赖 Studio

要求：
- Publisher UI、交互和域名规则在所有模板中保持一致
- 模板不得单独实现自己的发布流程
- 模板负责生成完整游客网站，并能输出为独立游客 HTML
- Cloudflare / GitHub / Vercel 等属于底层实现，不向主办方暴露

---

# 25. Template 01 的纯表现层

以下**不得被理解为所有模板都必须长这样**：

## C 仅 01 表现层

- [ ] 圆角 pill
- [ ] 粗黑描边
- [ ] sticker
- [ ] 彩色 box-shadow
- [ ] Ticket 风格开场的具体造型
- [ ] Passport
- [ ] Scroll progress
- [ ] Floating sticker
- [ ] Section orbit
- [ ] 01 的卡片尺寸
- [ ] 01 的首页 section 顺序
- [ ] 01 的 Quick Card 外观
- [ ] 01 的 Footer 外观

## B 条件继承

- [ ] Ribbon
- [ ] Entry animation
- [ ] Quick Access
- [ ] Mobile dock
- [ ] Scroll progress
- [ ] Passport progress
- [ ] Decorative orbit

---

# 26. 新模板开发时的正确流程

## Phase 1 — 参考网站研究

- [ ] 页面结构
- [ ] 信息密度
- [ ] 色彩系统
- [ ] 字体层级
- [ ] 组件节奏
- [ ] 动画
- [ ] 导航方式
- [ ] 手机端逻辑
- [ ] 开场动画
- [ ] 卡片/列表/大图使用比例
- [ ] 哪些地方是参考站“品牌世界观”，不能直接照搬

## Phase 2 — 先做纯视觉 Shell

要求：
- [ ] 暂时不考虑 01 组件长什么样
- [ ] 只判断“像不像参考站”
- [ ] 看不出 01 结构影子
- [ ] 页面本身已经有完整美感
- [ ] 手机端也成立

## Phase 3 — 能力映射

逐项拿本清单判断：

- [ ] 这个 01 能力在参考站里最自然放哪里？
- [ ] 应该变成卡片、列表、菜单、侧栏还是弹窗？
- [ ] 有没有必要在首页展示？
- [ ] 是不是应该只存在一级页面？
- [ ] 会不会破坏参考站视觉？

原则：
> **保留能力，不保留 01 UI。**

## Phase 4 — 视觉/功能平衡

如果某能力直接塞进去会破坏美感：

1. 不删除能力。
2. 不复制 01 卡片。
3. 用参考站自己的设计语言重新表达。
4. 首页不适合时，移动到独立页面或二级交互。
5. 不让主办方填写无意义信息。

## Phase 5 — 双重验收

### 功能验收
- [ ] 本清单所有 A 项通过

### 视觉验收
- [ ] 不像 01 换皮
- [ ] 参考站视觉语言明显
- [ ] 没有“AI 每块都加装饰”的痕迹
- [ ] 色彩、字体、留白、层级统一
- [ ] 每个 section 都回答得出“主办方为什么要放这个？”
- [ ] 没有游客可见的设计说明文字
- [ ] 不出现没有功能的假按钮
- [ ] 不因为功能堆叠破坏视觉

---

# 27. 最重要的判断规则

> **01 是产品能力说明书，不是设计模板。**

新模板应满足：

**Reference Site Visual System + Template 01 Business Capabilities + Shared Core Behavior**

而不是：

**Template 01 DOM + 换 CSS + 参考站装饰。**


## Template / Publisher responsibility split

### Template responsibilities
- generate the complete visitor website
- define visual structure and responsive presentation
- render organizer content and enabled modules
- render first-level pages and custom pages
- preserve all visitor interactions
- produce complete standalone HTML

### Publisher responsibilities
- manage the public site address
- publish the generated site
- update the same published address
- expose open/copy-link actions
- provide the shared download/publish workflow
- hide deployment infrastructure from organizers

In short:

**Template = Site Generator**

**Publisher = Deployment / Delivery Layer**
