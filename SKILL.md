---
name: doudou-remotion-whiteboard
description: Remotion 手绘白板与纸质动态长卷动画技能（Claude Spark 风格）。支持铅笔跟随、素描排线、3D纸雕折叠翻页、半色调网点印刷、深蓝工程蓝图等 9 大经典镜头配方。当用户提及“手绘视频”、“白板动画”、“手绘动画”、“白板视频”、“铅笔手写”、“Claude Spark 风格”、“手绘齿轮”、“纸雕立体书”、“工程蓝图动画”或需要在 Remotion 中实现高质量手绘/白板动效时使用。支持通过 /doudou-image-jasperio 生成高品质实物免抠贴图与纸质背景。
---

# doudou-remotion-whiteboard: Remotion 手绘白板与纸质动态动画引擎

基于 Remotion 4 + React 19 + Canvas 2D + Three.js 构建的**电影级手绘与纸质动效解决方案**。

完整沉淀并复刻了科技圈出圈名作《Spark · Claude 演进史》的全部美学风格与技术范式，将过去难以复用的手绘数学与物理计算封装为开箱即用的**9 大镜头配方卡**与**原子组件库**。

---

## 核心能力与 9 大镜头配方矩阵

| 配方代号 | 风格名称 | 核心视觉特征 | 推荐声音设计 (Foley) |
|---|---|---|---|
| **RECIPE-01** | **`PencilSketch` (铅笔白描)** | 圆规辅助虚线、十瓣花生长、素描排线阴影、铅笔切线跟随 | 铅笔在粗糙纸张上划过的沙沙摩擦声 (Pencil ASMR) |
| **RECIPE-02** | **`PopUpBook` (纸雕立体书)** | 木质桌面俯视镜头、书本翻开、花瓣沿中缝立起 90° 并投射软阴影 | 厚重硬质卡纸翻页脆响、纸片弹起声 |
| **RECIPE-03** | **`HalftonePrint` (网点印刷)** | Riso / Ben-Day dots 半色调波点、微小套印错位、扩散生成山水草地 | 凸版印刷机步进声、清脆墨水滴落声 |
| **RECIPE-04** | **`MechanicalCollage` (怀表齿轮)** | 怀表实物贴图、光标点击上弦、表盘半透明显露手绘咬合自转齿轮 | 怀表秒针滴答声、发条清脆棘轮回弹声 |
| **RECIPE-05** | **`BlueprintBridge` (工程蓝图)** | 深蓝坐标网格图纸、白色粉笔手绘线条、思维气泡、深渊架设桁架拱桥 | 粉笔敲击声、键盘打字测试通过声 |
| **RECIPE-06** | **`StormyInk` (水墨风雨长跑)** | 水墨碳棒厚涂颗粒、暴雨斜丝、逆风疾驰花瓣轮、撕扯流动的噪波黑云 | 暴风雨呼啸、雨滴倾盆敲击声 |
| **RECIPE-07** | **`LeatherEmboss` (皮质烫金)** | 深色牛皮纸/皮革肌理底色、金色中心图钉、单线一笔画圆环绕版本迭代 | 图钉金属按压声、沉稳低音和弦 |
| **RECIPE-08** | **`RetroSunset` (波普落日)** | 鲜艳高饱和暖调对撞、落日放射线、旋转风车、烟花般漫天散落的衍生小花 | 欢快高潮交响和弦、轻盈钟鸣音 |
| **RECIPE-09** | **`MixedCollage` (材质拼贴终章)** | 每瓣花瓣采用完全不同的拼贴材质、铅笔再次入场手写连笔签名收尾 | 铅笔签名轻脆刮擦声、单音钢琴收尾 |

---

## 核心原子组件库使用指南

所有组件均可直接引入并在 Remotion 的 `<Sequence>` 或 `<Series>` 中调用。

### 1. `<PencilFollower />` 真实铅笔/笔刷跟随器
- **特性**：锚点锁死在笔尖 `(0, 0)`，旋转时笔尖永远精准接触落笔点；内置高保真六角木质美术铅笔与柔和落笔阴影，零外部素材即可高清渲染。
- **调用示例**：
```tsx
import { PencilFollower } from 'doudou-remotion-whiteboard/components';

<PencilFollower
  x={currentTipX}
  y={currentTipY}
  angleDeg={tangentAngle + 30}
  scale={1}
  showShadow={true}
  // 可选：使用 jasperio 生成的免抠实物手写笔图片
  customImageUrl={myRealPencilPng}
/>
```

### 2. `<HandDrawnCanvas />` 高清 Canvas 2D 手绘画布
- **特性**：自动处理 Retina 2x/3x 设备像素比 (DPR)，结合 `useCurrentFrame()` 逐帧确定性绘制。
- **调用示例**：
```tsx
import { HandDrawnCanvas } from 'doudou-remotion-whiteboard/components';
import { getHandJitter } from 'doudou-remotion-whiteboard/math';

<HandDrawnCanvas
  backgroundColor="#F6F3EB"
  onDraw={(ctx, width, height) => {
    // 基于当前帧的纯代码手绘逻辑
  }}
/>
```

### 3. `<BlueprintGrid />` & `<BlueprintBox />` 深蓝工程图纸
- **特性**：自适应工程网格与粉笔线框，适合架构演示与思考链（Thinking Process）呈现。

### 4. `<HandDrawnGear />` 啮合手绘齿轮
- **特性**：参数化手绘齿轮，精确按齿数比设定角速度，实现多轮无缝反向啮合转动。

---

## 核心数学与算法支持 (`math/`)

1. **`math/path-tangent.ts`**：
   - `getSampledTangent(points, progress)`：计算折线/点集任意进度处的点位与切线角度。
   - `getCircleTangent(cx, cy, r, angle)`：计算圆弧轨迹切线。
2. **`math/hand-jitter.ts`**：
   - `getHandJitter(t, amp, freq)`：基于平滑噪波的人手微抖算法，消除矢量机械感。
   - `jitterPoints(points)`：对整条路径施加手绘粗糙化。
3. **`math/hachure.ts`**：
   - `generateHachureLines(bounds, options)`：扫描线法计算手绘斜线与交叉排线 (Cross-hatching)。
4. **`math/halftone.ts`**：
   - `generateRadialHalftone(cx, cy, maxDist, progress)`：半色调网点阵列扩散计算。

---

## 与 `/doudou-image-jasperio` 的素材联动机制

当白板动画需要**实物贴图**、**免抠真实手写笔**、**复古纸张纹理底图**或**拟物怀表/工具**时，支持一键调度 `/doudou-image-jasperio` 技能生成：

```bash
# 1. 生成真实美术铅笔免抠图 (保存至 assets/pencil_real.png)
node scripts/generate-assets.mjs pencil

# 2. 生成复古水彩糙纸底图 (保存至 assets/vintage_paper.png)
node scripts/generate-assets.mjs vintagePaper

# 3. 生成复古怀表实物贴图 (保存至 assets/pocket_watch.png)
node scripts/generate-assets.mjs pocketWatch
```

---

## 快速同步到宿主 Remotion 项目

在宿主项目（如 `/Users/jyx/project/undsky`）中，只需运行同步脚本：

```bash
node /Users/jyx/project/doudou-remotion-whiteboard/scripts/copy-to-remotion.mjs
```

组件与配方将自动安装到 `src/components/whiteboard/`，即可直接在 Remotion Studio 中预览与渲染！
