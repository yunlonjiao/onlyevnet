# OnlyEvent Template QA Checklist

每套模板上线前逐项打勾。

## Visitor-facing hard rules
- [ ] 游客页面不得出现设计说明、开发说明、模板说明或自我解释文案，例如“这个模板……”“这里强调……”“不再使用……”“复用统一数据……”
- [ ] 视觉概念必须通过版式、字体、图片、色彩与交互本身成立，不能依赖文字解释“这是某某风格”
- [ ] 凡是视觉上像按钮、Tab、筛选器、搜索框、翻页器、轮播控制、卡片入口的元素，必须真实可交互
- [ ] 暂未接入真实 CMS 链接的入口必须明确反馈当前状态，不允许点击后无反应
- [ ] 装饰性元素不得使用按钮/输入框/Tab 的交互外观误导游客
- [ ] Preview 中的交互必须与未来 CMS 行为一致；不能只改 active 样式却不改变内容

## Visual
- [ ] Banner 替换成真实图后仍然成立
- [ ] 无 Banner 时 fallback 仍然完整
- [ ] 与已有模板在构图、字体、图片处理、装饰语言中至少 3 项明显不同
- [ ] 不像后台管理页
- [ ] 不像 wireframe
- [ ] 不依赖灰色占位块
- [ ] 页面首屏有明确视觉重点
- [ ] section 之间有合理节奏，不是机械卡片堆叠

## Content stress
- [ ] 长活动名
- [ ] 长副标题
- [ ] 0 嘉宾
- [ ] 1 嘉宾
- [ ] 12+ 嘉宾
- [ ] 0 摊位
- [ ] 1 摊位
- [ ] 100+ 摊位
- [ ] 0 活动
- [ ] 30+ 活动
- [ ] 0 资讯
- [ ] 长资讯标题
- [ ] 0 赞助商
- [ ] 图片缺失
- [ ] 图片加载失败

## Responsive
- [ ] 1440px desktop
- [ ] 1024px desktop/tablet
- [ ] 768px tablet
- [ ] 430px mobile
- [ ] 390px mobile
- [ ] 无横向溢出
- [ ] CTA 在手机上可点击
- [ ] sticky/fixed 元素不遮挡内容
- [ ] 手机 Banner 使用 mobileImage / mobile focal point
- [ ] sidebar 在移动端转 drawer / accordion

## Animation sourcing
- [ ] 实现复杂动画前已搜索是否存在成熟现成库 / 组件 / Demo
- [ ] 已记录候选资源、许可证、维护状态和移动端支持
- [ ] 优先复用许可证清晰且维护中的资源，不重复造轮子
- [ ] 生产环境锁定具体版本；禁止依赖 `latest`
- [ ] 第三方动画失效时，核心内容和导航仍可使用
- [ ] 已实现 prefers-reduced-motion 降级

## Interaction
- [ ] nav
- [ ] CTA
- [ ] tabs
- [ ] filters
- [ ] search
- [ ] map entry
- [ ] external links
- [ ] hover
- [ ] keyboard focus
- [ ] prefers-reduced-motion

## Accessibility
- [ ] heading 层级合理
- [ ] img alt
- [ ] form label
- [ ] focus-visible
- [ ] 状态不只依赖颜色
- [ ] reduced motion
- [ ] 文本与背景基本可读

## Technical
- [ ] no console-breaking error
- [ ] no broken assets
- [ ] first viewport images optimized
- [ ] non-critical images lazy load
- [ ] font count reasonable
- [ ] no autoplay heavy video by default
- [ ] no infinite blur/filter animation

## Lifecycle
- [ ] upcoming
- [ ] live
- [ ] ended
- [ ] ended 状态隐藏失效购票 CTA
- [ ] live 状态可突出今日节目 / 地图 / 公告
