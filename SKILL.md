---
name: doudou-remotion-whiteboard
description: Remotion 通用手绘白板与纸质动态动画引擎（Whiteboard & Hand-Drawn Motion Graphics）。支持白板马克笔/铅笔/粉笔/钢笔真实运笔跟随与抬笔落笔动力学、手绘几何图形与架构图箭头生长、素描排线阴影 (Cross-Hatch)、手写文本逐字显现、手绘齿轮机械联动、3D纸雕立体折叠、工程蓝图与黑板粉笔推导。适用于科技科普、产品解说、架构演进、课程教学、思维导图与商业白板视频。支持通过生图工具自动化生成实物免抠笔刷与特定纸质纹理底图。
---

# doudou-remotion-whiteboard: Remotion 通用白板与手绘动画引擎

`doudou-remotion-whiteboard` 是专为 Remotion 打造的**通用手绘白板、纸质媒介与草图动效（Whiteboard & Hand-Drawn Animation）解决方案**。

它摒弃了传统白板软件机械呆板的静态贴图，通过数学切线导数追踪、Perlin 噪波手绘微颤、扫描线排线填充、Canvas 2D 逐帧光栅化以及 Three.js 纸雕动力学，让代码生成的白板动画具备真实人类手绘的呼吸感、匠心感与艺术感染力。

---

## 一、 核心应用场景与风格矩阵

本技能适用于任何需要“手绘感、推导演进感、匠心质感”的视频创作场景：

| 场景分类 | 核心画面与视觉语言 | 推荐底纸与笔型 |
|---|---|---|
| **技术架构与流程推导** | 手绘服务节点框、带方向的手绘箭头、数据流总线、模块高亮圈选 | 工程蓝图 (Blueprint) / 毫米方格纸 + 白板笔/粉笔 |
| **知识科普与原理解析** | 概念草图勾勒、排线阴影填充、公式手写推导、齿轮联动传动 | 米白素描纸 (Sketchbook) + 美术素描黑铅笔 |
| **产品功能与演进长卷** | 历史版本演进、核心指标柱状/折线图手绘、3D纸雕立体书翻页弹出 | 复古牛皮纸 (Kraft) + 钢笔/铅笔 |
| **商业解说与商业模式** | 人物线稿、痛点场景勾画、金钱/增长图标手绘、大字手写重点划线 | 纯白磁性白板 (Whiteboard) + 粗头白板马克笔 |
| **学术讲座与黑板推演** | 课堂板书风格、手绘坐标轴、波形图绘制、粉笔字与局部板擦擦除 | 深绿/碳灰黑板 (Chalkboard) + 真实白色粉笔 |

---

## 二、 六大通用手绘能力模块

### 1. 物理笔刷跟随系统 (`BrushFollower`)
真实笔刷沿轨迹自动运笔的核心组件，彻底告别笔尖脱节或方向生硬的问题：
- **笔尖原点对齐 (Anchor (0,0))**：组件原点严丝合缝对齐在笔尖物理触点，旋转或缩放时笔尖绝不偏位。
- **自动切线平滑转向**：内置微分插值，根据路径行进方向自动计算最佳倾斜角与握笔切线。
- **抬笔/落笔高度动力学**：支持 `isDrawing` 状态，未画线时笔尖稍稍抬起并缩小投影，落笔时下压并投射柔和环境阴影。
- **多笔型开箱即用**：
  - `pencil`：高精度黑漆木质美术铅笔（纯矢量代码渲染，零资源依赖）
  - `marker`：粗头商务白板马克笔
  - `chalk`：带有颗粒断续感的粉笔头
  - `custom`：支持传入由生图工具生成的实物免抠手写笔或人手免抠图

### 2. 手绘几何图形与架构图连接器 (`HandDrawnShapes`)
参数化手绘几何组件，赋予规整图形手工绘制的微小抖动与粗糙度：
- **基础图形**：手绘矩形、手绘圆形/椭圆、多边形、星形。
- **流程连线**：手绘直线、圆弧曲线、折线连接符（Elbow Connector）、手绘空心/实心箭头。
- **手绘强调标记**：手绘椭圆画圈高亮 (`CircleHighlight`)、手绘下划波浪线 (`WavyUnderline`)、删除涂抹线 (`ScratchOut`)。

### 3. 素描排线与阴影填充算法 (`CrossHatchFill`)
解决手绘图形内部“上色”的机械感，通过几何多边形扫描线算法实现逼真的阴影效果：
- 支持 **单向斜排线 (Hachure)** 与 **双向十字交叉排线 (Cross-Hatch)**。
- 参数化控制：`angleDeg`（排线倾角）、`gap`（疏密间距）、`jitter`（线条粗细微颤）。

### 4. 手写文本与代码打字显现 (`HandwrittenText`)
- 字符流逐笔切片显现，平滑透明度衰减，模拟真实墨水渗透。
- 动态回传当前正在书写的字符末端坐标，供 `BrushFollower` 实时悬停书写。
- 支持手写英文字体、手写中文字体与等宽代码终端字体。

### 5. 机械齿轮与动态联动系统 (`MechanicalGears`)
- 任意大小、齿数的手绘机械齿轮。
- 齿轮间按齿数比 `(N1/N2)` 自动计算啮合角速度反向自转，支持多级齿轮传动链。

### 6. 多材质底纸与画布容器 (`WhiteboardCanvas`)
内置五大经典质感背景，支持自适应 Retina 屏幕 DPR 渲染：
- `sketch`: 暖米白素描糙纸底色 (`#F6F3EB`)
- `blueprint`: 经典深蓝工程坐标网格图纸 (`#0C2340`)
- `chalkboard`: 磨砂墨绿黑板背景 (`#1B3B2B`)
- `kraft`: 复古纤维牛皮纸背景 (`#D8C29D`)
- `pure`: 纯净现代高亮白板 (`#FFFFFF`)

---

## 三、 标准使用范式与代码示例

### 示例 1: 手绘一个微颤矩形并让铅笔沿着边缘画出

```tsx
import React, { useRef } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { HandDrawnCanvas, PencilFollower } from 'doudou-remotion-whiteboard/components';
import { getHandJitter } from 'doudou-remotion-whiteboard/math';

export const DrawBoxScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tipRef = useRef({ x: 0, y: 0, angle: 45 });

  const progress = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{ position: 'relative', width, height }}>
      <HandDrawnCanvas
        backgroundColor="#F6F3EB"
        onDraw={(ctx) => {
          // 在此绘制带 hand-jitter 的矩形线条，并更新 tipRef
        }}
      />
      <PencilFollower
        x={tipRef.current.x}
        y={tipRef.current.y}
        angleDeg={tipRef.current.angle}
        opacity={progress < 1 ? 1 : 0}
      />
    </div>
  );
};
```

### 示例 2: 工程蓝图架构图组件

```tsx
import React from 'react';
import { BlueprintGrid, BlueprintBox } from 'doudou-remotion-whiteboard/components';

export const ArchitectureScene: React.FC = () => {
  return (
    <BlueprintGrid gridSize={60}>
      <BlueprintBox x={200} y={150} width={240} height={120} label="API Gateway" delayFrame={10} />
      <BlueprintBox x={600} y={150} width={240} height={120} label="Microservice Cluster" delayFrame={30} />
    </BlueprintGrid>
  );
};
```

---

## 四、 与生图工具的素材扩展机制

技能全面支持纯代码原生渲染（无外部依赖）。当视频需要**高拟物实物免抠贴图**或**特定定制质感底纹**时，支持调用生图工具（如环境支持的文生图/图生图技能）生成扩展素材：

```bash
# 1. 生成真实手持铅笔免抠素材 (锁死笔尖朝向)
node scripts/generate-assets.mjs pencil

# 2. 生成复古水彩无缝纸张纹理
node scripts/generate-assets.mjs vintagePaper

# 3. 生成拟物机械工具/怀表素材
node scripts/generate-assets.mjs pocketWatch
```

---

## 五、 推荐声音设计 (Foley & Audio Sync)

手绘视频的沉浸感高度依赖精准的音画对位，推荐在 Remotion 中使用 `<Audio>` 标签在以下关键帧对齐音效：
- **运笔阶段**：低音量循环播放铅笔沙沙声（Pencil ASMR）或白板笔滑行微鸣；
- **转折/落笔拐角**：微弱的笔尖轻点顿笔声（Tap）；
- **强调划圈/下划线**：稍快速的书写刮擦声；
- **翻页/立体弹出**：硬卡纸翻动声（Page Flip）；
- **齿轮转动**：轻柔清脆的机械秒针滴答声（Clockwork Ticking）。
