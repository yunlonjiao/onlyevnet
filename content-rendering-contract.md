# OnlyEvent 内容数据 / 模板渲染契约（内部）

目标：内容数据共用，视觉呈现独立。模板不得自建一套业务数据模型。

## 1. Hero / Banner
CMS 继续使用现有统一 Banner 编辑器，不为每个模板重复开发字段。

统一数据：
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

模板只负责渲染方式，例如：
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

heroVariant 是模板内部配置，不要求普通主办方选择。

## 2. Guests
统一数据：
- id
- name
- avatar
- role
- intro
- works[]
- platformLinks[]
- scheduleRefs[]

不同模板可渲染成：网格、横滑、整屏切换、杂志索引、列表等。

## 3. Booths / Exhibitors
统一数据：
- id
- name
- logo
- category
- intro
- boothCode
- cover
- works[]
- links[]
- mapPoint

不同模板可渲染成：目录、检索结果、地图点位、卡片、杂志索引。

## 4. Programs / Activities
统一数据：
- id
- title
- type
- description
- cover
- startAt
- endAt
- venue/stage
- guests[]
- externalUrl

不同模板可渲染成：时间表、专题卡、整屏章节、节目列表。

## 5. News
统一数据：
- id
- category
- title
- date
- summary
- cover
- body/url

不同模板可渲染成：新闻列表、公告栏、编辑专题、ticker。

## 6. Sponsors / Partners
统一数据：
- id
- name
- logo
- tier
- url

不同模板可渲染成：Logo wall、分级赞助、横向滚动、页尾合作区。

## 7. External links / Community
统一数据：
- label
- type
- url
- qrImage
- icon

OnlyEvent 只展示外部票务、报名、社群等链接，不处理订单、支付或第三方报名数据。

## 8. Template rule
每个模板 = layout + visual tokens + component renderers。
模板不可复制内容；切换模板时业务数据必须保持不变。

## 9. Banner rule
每个模板必须读取同一份 Hero/Banner 数据，但允许完全不同 DOM / CSS。
禁止做 12 套独立 Banner 编辑器。

## 10. Fallback
缺图时使用该模板自己的抽象视觉 fallback，不注入虚构人物/IP/品牌素材。
缺字段时隐藏对应元素，不显示“00.00 / 会场名称”到正式发布页。
