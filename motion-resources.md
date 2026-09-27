# OnlyEvent Motion / Interaction Resource Registry

原则：实现动画前先搜索成熟资源，优先采用维护活跃、许可证清晰、移动端可靠的现成方案；只有现成资源不适合时才自研。

## Page flip / magazine
- StPageFlip / `page-flip`
  - 用途：杂志、画册、书本翻页
  - 特点：HTML 页面、软/硬页、真实折页、阴影、鼠标/触摸、横竖屏
  - 依赖：无
  - License：MIT
  - 当前用途：Template 04
  - Version pinned：2.0.7

- GulLabs Flipbook
  - 用途：StPageFlip 的维护型替代方案
  - 适合：如果后续移动端回翻、React 集成需要更积极维护时评估

- Turn.js
  - 不采用为默认方案
  - 原因：依赖 jQuery，公开版本许可证限制商业用途

## Carousel / horizontal rail
- Swiper
  - 用途：嘉宾横滑、Gallery、Featured rail、移动端卡片
  - License：MIT
  - 特点：touch、keyboard、breakpoints、A11y、loop
  - 使用原则：只有真正需要可滑动/轮播时使用，不为装饰自动轮播

## General motion
- Motion
  - 用途：reveal、mask、stagger、scroll-linked、轻量 parallax
  - 特点：Vanilla JS 可用；支持 HTML/SVG/WebGL；可使用原生 ScrollTimeline
  - 使用原则：优先替代手写复杂 transform timeline

- GSAP / ScrollTrigger
  - 用途：复杂 sticky storytelling、pin/scrub/snap、复杂时间线
  - 使用原则：只有 Motion/CSS 无法可靠实现时再引入；引入前再次核对当前许可和包体积

## Smooth scroll
- Lenis
  - License：MIT
  - 用途：确有必要的沉浸式滚动
  - 默认：不启用
  - 原因：普通活动站优先保留浏览器原生滚动和可访问性

## Selection rules
1. 先定义交互目的，再选库；不因为“动画好看”而引入。
2. 生产环境锁定具体版本，不引用 `latest`。
3. 优先 MIT / 明确允许商业使用的许可证。
4. 核心导航不能依赖动画库才能工作。
5. 必须提供 reduced-motion 降级。
6. 移动端必须实测触摸、滚动冲突和性能。
7. 第三方 CDN 仅用于 Preview/验证；正式 CMS 打包阶段优先自托管或作为构建依赖锁版本。
8. 若库加载失败，页面内容与基础导航必须仍可访问。
