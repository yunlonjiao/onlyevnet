# OnlyEvent 架构规范

目标：共享业务核心，隔离桌面/手机/模板 UI，避免修改一个模块时破坏其他模块。

这份文档是约束，不是重构计划。现有代码逐步迁移，不要求一次改完。

## 分层

```text
应用入口
  后台 / 桌面编辑器 / 手机编辑器 / 游客网站

共享业务层
  项目状态 · 保存 · 撤销 · 复制/删除/恢复 · 成本 · 发布

模板展示层
  01–08 模板默认数据 · previewBody · previewStyle · 渲染接口

数据与服务层
  localStorage · Worker API · D1 · R2
```

## 依赖方向

```text
模板 → 渲染器契约
渲染器 → 只读项目状态

桌面 UI ┐
手机 UI  ├→ 项目命令 → 项目状态 → 持久化
```

禁止：

```text
core → UI
template → editor
renderer → 编辑器 DOM
mobile → desktop DOM
desktop → mobile DOM
```

## 单一数据流

```text
UI 操作
  → projectActions
  → projectState
  → undo history
  → save
  → renderer 更新
```

桌面和手机共享同一份项目状态；不允许各自维护一套数据，也不允许靠 MutationObserver 把两端 DOM 强行对齐。

## 模块职责

### 数据与业务

- 只有项目状态模块可以修改项目状态。
- 只有持久化模块可以读写 localStorage。
- 只有发布模块可以调用 Worker 发布接口。
- UI 不直接读 localStorage，不直接拼云端请求。

### 桌面 UI

- 根节点：`.studio-desktop`
- 只操作自己的根节点。
- 不查询、不移动手机壳 DOM。

### 手机 UI

- 根节点：`#mNativeApp`
- 只操作自己的根节点。
- 不依赖桌面 DOM 的运行时修补。
- 移动节点时必须有明确的恢复路径，禁止丢失事件和数据。

### 渲染器

- 只接收 state / patch。
- 不导入编辑器模块。
- 不全局删除 footer、文本或模板内容。
- 清理逻辑必须限定到明确节点。

### 模板

模板只负责展示：

- 默认数据
- previewBody
- previewStyle
- 渲染接口

模板不允许实现：

- 保存 / 发布
- 撤销重做
- 项目复制 / 删除 / 恢复
- 编辑器 DOM 操作
- 直接访问 localStorage 或 Worker API

## CSS 命名空间

```css
/* 桌面 */
.studio-desktop .oe-inspector-action { ... }

/* 手机 */
#mNativeApp .oe-inspector-action { ... }
```

硬规则：

- 禁止新增 `.inspector-body button` 这类泛化选择器。
- 新控件必须有语义类，例如 `oe-inspector-action`、`oe-inspector-row`、`oe-inspector-control`。
- 特殊控件保留自己的尺寸和圆角，不吃通用按钮尺寸。
- 不新增 `!important`。
- 旧规则逐批删除，不长期保留“新选择器 + 旧选择器”双份。
- `@layer` 在旧 CSS 分层后再引入；未分层旧规则会压过新层。

## 模板契约

新增模板只能扩展展示层：

- 必须提供默认数据
- 必须提供 preview body / style
- 必须能被渲染器按统一接口加载
- 不允许复制编辑器业务逻辑

## 完成标准

每次改动至少满足：

- 桌面 1440 与手机 393 实际截图检查
- 关键控件 `getComputedStyle()` 前后一致
- 架构检查脚本通过
- 现有回归通过
- 没有新增 `!important`
- 没有引入新的跨模块 DOM 依赖
