# 开发约定

## 新功能放哪里

- 项目数据、保存、撤销、成本、发布：共享业务层
- 桌面界面：桌面 UI，根节点 `.studio-desktop`
- 手机界面：手机 UI，根节点 `#mNativeApp`
- 模板美术：`v8/templates/`，只提供展示
- 渲染逻辑：`v8/renderer/`，不反向操作编辑器

## 修改功能前

先判断它属于哪一层：

- 只影响展示 → 模板 / 渲染器
- 影响项目数据 → 共享业务层
- 只影响桌面布局 → 桌面 UI
- 只影响手机布局 → 手机 UI

禁止为了修一个端，直接移动另一个端的 DOM。

## CSS 规则

允许：

```css
.studio-desktop .oe-inspector-row { ... }
#mNativeApp .oe-inspector-row { ... }
```

禁止：

```css
.inspector-body button { ... }
#mNativeApp div { ... }
```

新增控件必须带语义类。  
特殊控件单独处理，不套通用高度/圆角。

不新增 `!important`。  
如果必须覆盖旧 `!important`，先删除或迁移旧规则，不要继续加权重。

## 模板规则

模板只能做展示：

- 默认数据
- previewBody
- previewStyle
- 渲染契约

模板禁止：

- 导入 `v8/editor/`
- 导入 `v8/app.js`
- 直接读写 localStorage
- 调用发布接口
- 操作编辑器 DOM

## 测试

每次改动至少运行：

```bash
node tools/check-architecture.mjs
node quality/tests/regression-audit.mjs
```

涉及界面时还必须：

- 桌面 1440 截图
- 手机 393 截图
- 关键控件 `getComputedStyle()` 对比

涉及项目数据时还必须：

- 复制
- 移入回收站
- 恢复
- 永久删除

## 提交前检查

- 没有新增 `!important`
- 没有新增泛化 CSS 选择器
- 没有跨端 DOM 查询
- 没有模板引用编辑器
- 回归通过
- 样式迁移时删除了已确认被替代的旧规则
