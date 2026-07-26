# public/brain-bytes-os/
> L2 | 父级: /CLAUDE.md

## 成员清单

**assets/books/computation.png**: 计算之书，像素书前景 PNG，被 BrainBytesOSPage 渲染为主题书素材

**assets/books/perception.png**: 感知之书，像素书前景 PNG，被 BrainBytesOSPage 渲染为主题书素材

**assets/books/prediction.png**: 预测之书，像素书前景 PNG，被 BrainBytesOSPage 渲染为主题书素材

**assets/books/memory.png**: 记忆之书，像素书前景 PNG，被 BrainBytesOSPage 渲染为主题书素材

**assets/books/decision.png**: 决策之书，用户重点选择的绿色像素书 PNG，被 BrainBytesOSPage 作为默认选中主题

**assets/books/consciousness.png**: 意识之书，像素书前景 PNG，被 BrainBytesOSPage 渲染为主题书素材

**assets/books/electrophysiology.png**: 电生理之书，像素书前景 PNG，被 BrainBytesOSPage 渲染为主题书素材

**assets/worlds/island-world.jpg**: 旧浮岛书域背景 JPG，互动地球版本不主动渲染，保留为后续参考/备用素材

**assets/worlds/tower-world.jpg**: 旧像素 OS 桌面背景 JPG，互动地球版本不主动渲染，保留为后续参考/备用素材

**assets/worlds/forest-tower.jpg**: 森林塔备用背景，保留为后续更柔和的浮岛远景素材

**assets/worlds/door-sky.jpg**: 入口门备用背景，保留为后续终端启动或门形过渡素材

**assets/worlds/orbital-archive-wide-cover.mp4**: 主背景视频，横版裁切的宇宙地球循环动画，被 BrainBytesOSPage 的视频世界直接消费

**assets/worlds/orbital-archive-wide-cover-poster.jpg**: 主背景视频首帧 poster，视频元数据加载前兜底显示

**assets/worlds/orbital-archive-wide.mp4**: 保留版横向拼接视频，作为非裁切比例参考素材

**assets/worlds/orbital-archive-wide-poster.jpg**: 保留版横向拼接视频 poster，作为备用预览素材

**assets/transitions/orbital-light-burst.mp4**: 终端进入世界的横版光束载入视频，从 Eagle 竖版素材裁切为 1280x720 短转场，被 BrainBytesOSPage 的 booting 阶段消费

**assets/transitions/orbital-light-burst-poster.jpg**: 光束载入视频 poster，转场视频元数据加载前兜底显示

## 架构边界

该目录只保存 `/brain-bytes-os` 的静态视觉资产。React 组件消费 `/brain-bytes-os/assets/books/...` 主题书、`assets/worlds/orbital-archive-wide-cover.mp4` 主背景视频与 `assets/transitions/orbital-light-burst.mp4` 终端转场；Three.js 自绘行星保留在源码中作为回退，不直接依赖 Eagle 原库路径，也不复制第三方 WebGL 地球源码。生成式背景选型实验页在 `/field-lab/`（`public/field-lab/`），不放在本目录，避免与 `/brain-bytes-os` SPA 路由冲突。

法则: 资产内聚·路径稳定·组件只消费项目内静态资源

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
