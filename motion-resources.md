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
- Embla Carousel 8.6.0
  - 用途：Featured rail、艺人阵容横滑、创作者横滑、嘉宾横滑
  - 特点：轻量、无依赖、拖拽精度高、支持 breakpoints / dragFree / reduced-motion
  - License：MIT
  - 当前用途：Template 01 / 05 / 08 / 12
  - 选择理由：这些区域需要“内容保持原样 + 真正鼠标/触摸拖动”，不需要 Swiper 更重的特效体系

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


## Current template audit

| Template | 现有交互/动画 | 处理决定 |
|---|---|---|
| 01 | Featured 横向内容轨道 | 已换 Embla 8.6.0 |
| 02 | 整屏章节 / 锚点滚动 | 暂保留原生；若加入 scroll reveal/parallax，优先 Motion；若需要 pin/scrub 再评估 ScrollTrigger |
| 03 | 社团检索 | 保留原生 JS，逻辑简单，不引入动画库 |
| 04 | 杂志翻页 | 已换 StPageFlip 2.0.7 |
| 05 | Artist 横向阵容 | 已换 Embla 8.6.0；DAY tabs 保留原生 |
| 06 | DAY 时间表切换 | 保留原生 JS，状态切换比引入库更合理 |
| 07 | 静态 Poster 特设页 | 暂不引库；未来如做进入动效优先 Motion |
| 08 | Creator 横向轨道 | 已换 Embla 8.6.0；ticker 保留 CSS，因为是单纯装饰且已有 reduced-motion |
| 09 | 中文信息门户 | 暂不需要动画库 |
| 10 | 展商筛选/搜索 | 保留原生数据过滤；若以后做模糊搜索可单独评估 Fuse.js，不属于 Motion 层 |
| 11 | Hero selector + DAY tabs | 保留原生 JS；如增加 HUD reveal 再用 Motion |
| 12 | Guest 横向轨道 | 已换 Embla 8.6.0；装饰浮动如后续增加，优先 Motion |

### Library boundary
- 不把“成熟库”理解成“所有交互都必须依赖库”。
- 简单 tab / filter / show-hide 使用原生 JS 更稳定、更轻。
- 只有手势、物理拖动、真实翻页、复杂 scroll timeline 等浏览器边界问题，优先使用成熟库。
