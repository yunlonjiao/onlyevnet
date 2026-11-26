# 模块依赖约定

## 允许

| 模块 | 可以依赖 |
|---|---|
| `v8/templates/*` | `v8/templates/shared-sections.js`、`v8/templates/registry.js` |
| `v8/renderer/*` | `v8/renderer/*`、模板契约、状态快照 |
| `v8/mobile/*` | 共享业务层、手机 UI 自身 |
| `v8/editor/*`（桌面） | 共享业务层、桌面 UI 自身 |
| `v8/app.js` | 各 UI 入口与共享业务层 |

## 禁止

| 模块 | 禁止依赖 |
|---|---|
| `v8/templates/*` | `v8/editor/*`、`v8/app.js`、`v8/mobile/*`、localStorage 写操作 |
| `v8/renderer/*` | `v8/editor/*`、`v8/app.js`、编辑器 DOM |
| `v8/mobile/*` | `v8/editor/desktop/*`、桌面 DOM |
| `v8/editor/desktop/*` | `v8/mobile/*`、手机壳 DOM |
| 桌面 UI | 直接修改手机壳节点 |
| 手机 UI | 直接修改桌面根节点 |
| 渲染器 | 删除编辑器内容、全局 MutationObserver 清理 |
| 模板 | 保存、发布、撤销、复制、删除、恢复 |

## 数据边界

- 项目状态只能由共享业务层修改。
- UI 只发命令，不直接写 storage。
- 成本、发布记录、项目状态都通过同一项目生命周期管理。
- 复制、删除、恢复、永久删除必须同时处理这些数据。

## 样式边界

- 桌面样式前缀：`.studio-desktop`
- 手机样式前缀：`#mNativeApp`
- 共享组件只在基础层定义结构和变量。
- 两端尺寸不再用未命名空间选择器覆盖。

## 违规处理

出现以下情况必须阻止合并：

- 模板引用编辑器
- 渲染器反向操作编辑器
- 桌面/手机跨根节点查询
- 新增泛化 CSS 选择器
- 新增 `!important`
- 数据生命周期遗漏成本或发布记录

自动化检查：`node tools/check-architecture.mjs`
