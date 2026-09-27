# OnlyEvent Template QA Checklist

每套模板上线前逐项打勾。

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
