# OnlyEvent Template Contract V2（内部）

目标：让 OnlyEvent 可以扩展到几十套模板，同时保证内容不丢失、视觉真正不同、移动端不崩、空数据不崩、性能和可访问性可控。

核心原则：

> 内容数据共用，视觉呈现独立。

模板不是一份 HTML，而是由以下 7 层组成：

1. Content Model
2. Information Architecture
3. Art Direction
4. Design Tokens
5. Component Renderers
6. Motion + Responsive Rules
7. States + Guardrails + QA

---

## 1. Content Model

所有模板读取同一份 CMS 数据，不允许模板自建业务字段。

### Hero / Banner
- desktopImage
- mobileImage
- title
- subtitle
- dateText
- venueText
- primaryAction { label, url }
- secondaryAction { label, url }
- focalPointDesktop { x, y }
- focalPointMobile { x, y }
- overlayStrength
- textTone

规则：
- 继续复用现有 OnlyEvent 统一 Banner 编辑器。
- 禁止每个模板分别做 Banner 编辑器。
- 缺图时使用该模板自己的抽象 fallback。
- 正式发布时不允许出现“00.00 / 会场名称 / 活动名称”等预览占位文案。

### Guests
- id
- name
- avatar
- role
- introShort
- introFull
- works[]
- platformLinks[]
- scheduleRefs[]

### Booths / Exhibitors
- id
- name
- logo
- category
- introShort
- introFull
- boothCode
- cover
- works[]
- links[]
- mapPoint

### Programs / Activities
- id
- title
- type
- descriptionShort
- descriptionFull
- cover
- startAt
- endAt
- venue
- stage
- guestRefs[]
- externalUrl

### News
- id
- category
- title
- date
- summary
- cover
- body
- externalUrl

### Sponsors / Partners
- id
- name
- logo
- tier
- url

### External Links / Community
- label
- type
- url
- qrImage
- icon

OnlyEvent 只展示票务、报名、社群等外部入口，不处理订单、支付、票务、退款或第三方报名数据。

---

## 2. Information Architecture

模板必须声明 structureProfile，例如：

- portal
- immersive
- catalogue
- editorial
- lineup
- timetable
- poster
- split
- search
- pickup
- character-led

structureProfile 决定页面内容组织方式，而不是主题色。

示例：
- portal：Hero → quick access → highlights → news
- catalogue：Hero → category index → catalogue/search → notices
- timetable：Hero → day filters → schedule → venues
- search：Hero → stats → filters → results → map
- immersive：full-screen chapters → feature → guest → stage

相同结构允许有不同 Art Direction，但禁止直接复制 DOM + 换颜色当新模板。

---

## 3. Art Direction

每个模板必须声明 artDirection，不允许只写“蓝色 / 粉色 / 黑色”。

示例：
- international-festival
- experimental-game
- minimal-japanese-print
- art-school-editorial
- live-poster
- timetable-modernist
- poster-special-site
- creative-festival
- chinese-event-editorial
- b2b-exhibition
- game-show-special
- soft-romantic-acg
- brutalist
- retro-web
- luxury
- y2k
- industrial

Art Direction 必须明确：

### 3.1 Composition
- centered / asymmetric / split / editorial / layered / poster
- 是否允许元素溢出
- 是否允许文字与图片重叠
- section 是否采用规则网格或自由构图

### 3.2 Image Treatment
- full-bleed
- cutout
- masked
- collage
- monochrome
- duotone
- soft-gradient-overlay
- paper-texture
- silhouette

### 3.3 Typography
- display scale
- body scale
- condensed / geometric / editorial / japanese-minimal / handwritten accent
- title max lines
- mobile title scale

### 3.4 Decorative Language
- sticker
- line-art
- geometric
- grain
- paper
- glass
- neon
- outline
- none

模板视觉差异必须至少同时体现在：构图、字体层级、图片处理、装饰语言四项中的三项。

---

## 4. Design Tokens

所有模板必须使用语义 Token，不把颜色、间距、圆角到处硬编码。

推荐：

### Color
- --color-bg
- --color-surface
- --color-surface-alt
- --color-text
- --color-text-muted
- --color-accent
- --color-accent-2
- --color-border
- --color-overlay

### Typography
- --font-display
- --font-body
- --font-accent
- --text-display-xl
- --text-display-lg
- --text-heading
- --text-body
- --text-caption

### Spacing
- --space-page
- --space-section
- --space-block
- --space-card
- --space-inline

### Shape
- --radius-sm
- --radius-md
- --radius-lg
- --radius-pill

### Surface
- --shadow-soft
- --shadow-raised
- --blur-glass
- --border-weight

模板可以覆盖 Token，但组件只能读取语义 Token。

---

## 5. Component Renderers

同一份内容允许模板用不同 renderer 展示。

### Hero Renderer
示例：
- hero.portal
- hero.immersive
- hero.catalogue
- hero.poster
- hero.split
- hero.pickup
- hero.character

### Guest Renderer
- guest.grid
- guest.horizontal
- guest.fullscreen
- guest.editorial-index
- guest.cutout
- guest.list

### Booth Renderer
- booth.directory
- booth.cards
- booth.search-results
- booth.map-linked
- booth.magazine-index

### Program Renderer
- program.timeline
- program.feature-cards
- program.chapter
- program.compact-list
- program.stage-board

### News Renderer
- news.list
- news.ticker
- news.editorial
- news.cards

### Sponsor Renderer
- sponsor.logo-wall
- sponsor.tiered
- sponsor.marquee
- sponsor.footer-strip

规则：
- renderer 只决定展示。
- 不得改变业务数据语义。
- 切换模板后内容必须保留。

---

## 6. Content Guardrails

模板必须防止用户内容把设计撑坏。

### 标题
建议范围：
- event title：4–30 个中文字符
- section title：2–16 个中文字符
- guest name：1–24 字符
- booth name：1–32 字符
- news title：4–60 字符

### 简介
- introShort：建议 20–120 字
- descriptionShort：建议 20–160 字
- summary：建议 20–120 字

### 超限处理
优先顺序：
1. 自适应字号
2. 换行
3. 限制最大行数
4. 显示“查看更多”

禁止：
- 直接让文字溢出容器
- 用极小字号强塞
- 无提示裁掉关键信息

---

## 7. Content Quantity States

每个 renderer 必须定义：

### Zero
- 0 嘉宾：整个 Guest section 隐藏
- 0 摊位：摊位入口隐藏
- 0 活动：日程 section 隐藏
- 0 赞助商：Sponsor section 隐藏

### One
- 1 嘉宾：改成 feature layout，不保留空三列
- 1 摊位：不展示“搜索 1 个结果”的大型检索 UI

### Many
建议阈值：
- Guest > 8：增加“查看更多”或横滑
- Booth > 24：分页 / 搜索 / 分类
- News > 10：分页 / more
- Program > 20：日期和舞台筛选

模板必须同时通过 zero / one / normal / many 四种状态。

---

## 8. Image Rules

图片不是简单上传后塞入矩形。

每个图片槽位必须声明：
- aspectRatio
- desktopCrop
- mobileCrop
- focalPoint support
- safeTextArea
- objectFit
- fallbackMode

Banner 必须支持：
- desktopImage
- mobileImage
- desktop focal point
- mobile focal point

人物图可支持：
- transparent PNG
- cutout mode
- background image mode

缺图 fallback：
- 模板自己的抽象图形
- 不使用第三方 IP
- 不使用虚构人物
- 不自动生成未经用户确认的人物素材

---

## 9. Motion System

模板必须选择 motionProfile：

### calm
- opacity
- small translate
- duration 180–320ms

### editorial
- clip reveal
- image mask
- typography stagger
- duration 300–600ms

### energetic
- scale
- marquee
- horizontal motion
- duration 180–450ms

### immersive
- section reveal
- parallax-lite
- controlled background movement
- duration 450–900ms

规则：
- 禁止所有模板统一 fade-up。
- hover 动效与 scroll 动效必须属于同一视觉语言。
- 必须支持 prefers-reduced-motion。
- reduced motion 下禁止 parallax / auto marquee / large movement。

---

## 10. Responsive Rules

响应式不是桌面缩小。

模板必须定义：

### Desktop
>= 1024px

### Tablet
768–1023px

### Mobile
< 768px

必须允许结构改变：

例：
- split hero → mobile 改为 image above + content below
- search sidebar → mobile 改为 filter drawer
- timetable → mobile 改为 day accordion
- 4-column guests → 2-column / horizontal
- character composition → mobile 重新安排人物图 focal point

禁止仅依靠 transform: scale() 缩小桌面页面。

---

## 11. Accessibility

最低要求：
- 语义 heading 层级
- 所有图片支持 alt
- 所有按钮和链接键盘可操作
- 明确 focus-visible 状态
- 文本对比度满足基本可读性
- 表单必须有 label
- tab / accordion 提供对应 ARIA
- 不用颜色作为唯一状态提示
- 动画兼容 prefers-reduced-motion

---

## 12. Performance Budget

建议首屏预算：

### Images
- Hero desktop：优先 AVIF / WebP
- mobile hero：独立输出
- 非首屏 lazy load
- gallery thumbnail 使用响应式尺寸

### Fonts
- 每模板尽量 <= 2 个主要字体族
- display font 仅加载所需字重
- 避免大量远程字体阻塞

### Motion
- 优先 transform / opacity
- 避免大面积 filter blur 连续动画
- WebGL / video 仅在模板明确需要时使用

目标：
- 不因为追求 Art Direction 导致手机首屏明显卡顿。

---

## 13. Page States

每套模板至少需要：

- loading
- empty
- error
- image-failed
- offline / network-retry（CMS 编辑预览可选）
- event-upcoming
- event-live
- event-ended

### Event lifecycle
upcoming：
- 报名 / 购票 / 嘉宾 / 日程优先

live：
- 今日节目 / 地图 / 现场公告优先

ended：
- Gallery / 回顾 / 资讯 / 社群优先
- 隐藏无效购票 CTA

---

## 14. Template Guardrails

用户可以改：
- 内容
- 图片
- 模块开关
- 允许的主题色
- CTA
- 模块顺序（模板允许时）

用户默认不直接改：
- 任意 font-size
- 任意 margin/padding
- DOM
- breakpoint
- component internals
- animation timing

目标：给用户自由，但不能轻易把模板设计破坏。

---

## 15. SEO / Share

模板必须读取统一：
- pageTitle
- metaDescription
- canonical
- ogTitle
- ogDescription
- ogImage
- social share image focal point

Event 页面应保留后续支持结构化 Event 数据的能力。

---

## 16. Template Metadata

每套模板必须声明：

- id
- name
- structureProfile
- artDirection
- motionProfile
- supportedModules[]
- recommendedFor[]
- notRecommendedFor[]
- heroRenderer
- guestRenderer
- boothRenderer
- programRenderer
- newsRenderer
- sponsorRenderer

模板选择页未来可展示：
- 适合：大型综合漫展 / ONLY / Live / 商展
- 推荐规模：小型 / 中型 / 大型
- 是否适合大量摊位
- 是否适合舞台为主
- 是否适合强主视觉
- 是否偏信息型 / 视觉型

---

## 17. Template Stress Test

新模板进入模板库前必须测试：

1. normal data
2. long event title
3. no hero image
4. mobile hero image
5. 0 guests
6. 1 guest
7. 12 guests
8. 0 booths
9. 1 booth
10. 100+ booths
11. 1-day event
12. 2-day event
13. no stage
14. 30+ programs
15. 0 news
16. long news title
17. no sponsors
18. desktop
19. tablet
20. mobile
21. reduced motion
22. broken image fallback

任何关键布局溢出、按钮不可点击、文本遮挡或模块空壳，都视为不通过。

---

## 18. Template QA Gate

进入正式模板库前至少通过：

### Visual
- 不像后台
- 不像 wireframe
- 不依赖灰色占位块
- 与已有模板 Art Direction 明显不同
- Banner 替换后仍然成立

### Functional
- nav
- CTA
- filter
- tabs
- external links
- map entry
- responsive interactions

### Content
- zero / one / many
- long title
- missing image
- bilingual content（模板支持时）

### Technical
- no console-breaking JS error
- no horizontal overflow
- valid mobile viewport
- reduced-motion fallback
- reasonable image loading strategy

---

## 19. Current 12-template mapping

| ID | Structure | Art Direction | Motion |
|---|---|---|---|
| 01 | portal | international-festival | energetic |
| 02 | immersive | experimental-game | immersive |
| 03 | catalogue | minimal-japanese-print | calm |
| 04 | editorial | art-school-editorial | editorial |
| 05 | lineup | live-poster | energetic |
| 06 | timetable | timetable-modernist | calm |
| 07 | poster | poster-special-site | editorial |
| 08 | split | creative-festival | energetic |
| 09 | portal | chinese-event-editorial | energetic |
| 10 | search | b2b-exhibition | calm |
| 11 | pickup | game-show-special | immersive |
| 12 | character-led | soft-romantic-acg | editorial |

---

## 20. Final Rule

OnlyEvent 模板系统统一遵循：

> Content is portable.
> Structure is selectable.
> Art direction is distinctive.
> Rendering is template-owned.
> Data is CMS-owned.

切换模板：内容不变。
新增模板：不新增业务字段。
修改 CMS 字段：所有模板通过 renderer 适配。
设计差异：来自结构 + 美术方向 + Token + Motion，而不是只换配色。
