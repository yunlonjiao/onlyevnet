# OnlyEvent UI 边界改造与修复 SOP

适用于桌面编辑器、手机编辑器、渲染器、模板和后台 UI 的任何样式/布局修复。

## 核心原则

- 渐进式改造，每一步可测试、可回滚
- 不换 React / Vue / Next.js
- 不一次性重写 CSS、模板或编辑器
- 不改变业务功能
- 不引入新依赖，除非明确同意
- 先诊断，后修改
- 一次只处理一个可验证问题
- 最小 diff，不整文件重写

## 第一阶段：CSS 作用域

目标：变量层 → 组件层 → 端级覆盖层。

目标结构（渐进迁移，不一次拆完）：

```text
v8/styles/
  tokens.css
  base.css
  layout.css
  desktop.css
  mobile.css
  components/
    button.css
    field.css
    panel.css
    dialog.css
  templates/
    ip-only.css
    scrapbook.css
    creator-market.css
```

规则：

- 颜色、间距、圆角、阴影、字号优先使用 CSS 变量
- 组件样式只作用于自身语义 class
- 桌面样式必须带 `.studio-desktop` 前缀
- 手机样式必须带 `#mNativeApp` 前缀
- 禁止 `.inspector-body button` 这类泛化选择器
- 禁止 `#mNativeApp div` 这类宽泛选择器
- 禁止新增 `!important`
- 旧 `!important` 分批迁移，不一次性删除
- 修改时删除被替代的旧规则，不保留新旧双份

## 第二阶段：手机布局契约

手机底部固定元素统一使用：

```css
#mNativeApp {
  --oe-mobile-toolbar-height: 56px;
  --oe-mobile-safe-area-bottom: env(safe-area-inset-bottom, 0px);
  --oe-mobile-bottom-inset: calc(
    var(--oe-mobile-toolbar-height) +
    var(--oe-mobile-safe-area-bottom)
  );
}

#mNativeApp .oe-fixed-bottom {
  bottom: var(--oe-mobile-bottom-inset);
}
```

禁止：

- 组件自行硬编码 `bottom: 16px`
- 组件自行计算 safe-area
- 工具栏高度散落多文件
- 键盘逻辑分散多模块
- 手机组件依赖桌面 DOM

必测：

- 普通状态
- 滚动到底
- 键盘弹出
- iPhone safe-area
- 393 × 852
- 至少两个受影响模板

## 第三阶段：模板边界

| 层 | 允许 | 禁止 |
|---|---|---|
| 模板 | 默认数据、previewBody、previewStyle、展示结构 | 改编辑器、保存、发布、撤销、全局 DOM |
| 渲染器 | 接收 state / patch、渲染模板 | 导入编辑器、删除编辑器内容、全局清理 |
| 编辑器 | 发命令、管理 UI | 直接改模板内部结构 |
| CSS | 组件级、命名空间级 | 泛化选择器、跨模板覆盖、新增 `!important` |

模板命名空间：

```css
.oe-template-ip-only .oe-section-title { ... }
.oe-template-scrapbook .oe-section-title { ... }
.oe-template-creator-market .oe-section-title { ... }
```

禁止模板覆盖 `.oe-inspector-action`、`.oe-button` 等共享组件。

## 对话协议

### 第一轮：诊断

必须先输出：

1. 根因假设，按可能性排序
2. 证据缺口
3. 需要用户提供的截图 / DOM / Computed Styles / Console / Network
4. 涉及文件和选择器
5. 修改计划
6. 可能影响的端：桌面 / 手机 / 模板 / 渲染器
7. 回归风险
8. 验收标准

第一轮禁止输出完整代码修改。

### 第二轮：最小 Patch

- unified diff 或精确 before/after
- 每个修改对应一个根因
- 不顺带重构
- 不改无关文件
- 不新增 `!important`
- 不新增泛化选择器

### 第三轮：验收

- 桌面 1440
- 手机 393
- 目标控件 `getComputedStyle()` 前后对比
- 受影响模板截图
- 架构检查
- 渲染器契约检查
- Playwright smoke
- 无新增 `!important`
- 无新增泛化选择器
- 无跨端 DOM 查询

## 禁止事项

- 不推翻 Cloudflare Workers + D1 + R2
- 不立刻迁移 React / Vue / Next.js
- 不一次重写 `v8/app.js`
- 不一次重写 `v8/styles.css`
- 不一次删除所有 `!important`
- 不把 `cloud/web/` 当源码
- 不跨端查询或修改 DOM
- 不让模板反向依赖编辑器
- 不让渲染器反向操作编辑器
- 不为了修一个端破坏另一个端

## 当前基线

```text
!important: 1353
generic Inspector selectors: 24
architecture check: tools/check-architecture.mjs
regression: quality/tests/regression-audit.mjs
```
