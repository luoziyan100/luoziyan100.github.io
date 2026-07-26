# public/field-lab/
> L2 | 父级: /CLAUDE.md

## 成员清单

**lab.html**: Field Lab 入口页（故意不用 index.html，避免 Vite SPA 回落吞掉），提供七个生成式背景方案切换、模拟主题书叠加与暂停控件

**field-lab.js**: Canvas2D 实验引擎；`shoal`（雪花七鱼）为当前主视觉候选：中央六重雪花 + 七主题游鱼环绕

**field-lab.css**: 实验页顶栏与舞台样式，深色预览壳，不进入正式 BrainBytesOSPage

## 架构边界

本目录是并行选型实验，不替换 `/brain-bytes-os` 的视频背景。预览路径：`/field-lab/lab.html`。选定方案后再接入 `BrainBytesOSPage` 的 `WORLD_VARIANT`。

法则: 实验隔离·先选型后接入

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
