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
| **知识科普与原理解析** | 概念草图勾勒、排线阴影填充、公式手写推导、齿轮联动传动 | 米白素描纸 (Sketchbook) + 美术素描黑铅笔 / 真实人手 |
| **产品功能与演进长卷** | 历史版本演进、核心指标柱状/折线图手绘、3D纸雕立体书翻页弹出 | 复古牛皮纸 (Kraft) + 钢笔/铅笔 |
| **商业解说与商业模式** | 人物线稿、痛点场景勾画、金钱/增长图标手绘、大字手写重点划线 | 纯白磁性白板 (Whiteboard) + 粗头白板马克笔 / 真实人手 |
| **学术讲座与黑板推演** | 课堂板书风格、手绘坐标轴、波形图绘制、粉笔字与局部板擦擦除 | 深绿/碳灰黑板 (Chalkboard) + 真实白色粉笔 |

---

## 二、 六大通用手绘能力模块

### 1. 物理笔刷与真实人手跟随系统 (`BrushFollower / RealHandFollower`)
真实笔刷或真人握笔沿轨迹自动运笔的核心组件，彻底告别笔尖脱节或方向生硬的问题：
- **笔尖原点对齐 (Anchor (0,0))**：组件原点严丝合缝对齐在笔尖物理触点，旋转或缩放时笔尖绝不偏位。
- **自动切线平滑转向**：内置微分插值，根据路径行进方向自动计算最佳倾斜角与握笔切线。
- **抬笔/落笔高度动力学 (`liftHeight`)**：支持 `isDrawing` 与 `liftHeight` 状态，未画线时笔尖稍稍抬起并随高度扩散柔化投影，落笔时下压并紧密贴合板面。
- **多笔型与真人手开箱即用**：
  - `PencilFollower`：纯矢量高精度黑漆木质美术铅笔（零外部资源依赖，绝对清晰）
  - `RealHandFollower`：高保真真人右手握笔组件（包含防变形保护与 3D 深度投影扩散）
  - `customImageUrl`：支持传入由生图工具生成的实物免抠笔刷或手部贴图

### 2. 手绘几何图形与架构图连接器 (`HandDrawnShapes`)
参数化手绘几何组件，赋予规整图形手工绘制的微小抖动与粗糙度：
- **基础图形**：手绘矩形、手绘圆形/椭圆、多边形、星形。
- **流程连线**：手绘直线、圆弧曲线、折线连接符（Elbow Connector）、带先后双翼笔画的手绘箭头 (`HandDrawnArrow`)。
- **手绘强调标记**：手绘椭圆画圈高亮 (`CircleHighlight`)、手绘下划线、删除涂抹线 (`ScratchOut`)。

### 3. 素描排线与阴影填充算法 (`CrossHatchFill`)
解决手绘图形内部“上色”的机械感，通过几何多边形扫描线算法实现逼真的阴影效果：
- 支持 **单向斜排线 (Hachure)** 与 **双向十字交叉排线 (Cross-Hatch)**。
- 拟人化运笔节律：排线时模拟“68% 下压斜扫 + 32% 快速提笔回弹至下一行”的真实素描大师手法。

### 4. 手写文本与代码打字显现 (`HandwrittenText`)
- 字符流逐笔切片显现，平滑透明度衰减，模拟真实墨水渗透。
- 动态回传当前正在书写的字符末端坐标，供 `BrushFollower` 或 `RealHandFollower` 实时悬停书写。
- 支持手写英文字体（如 Caveat）、手写中文字体与等宽代码终端字体。

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

## 三、 手部防变形与真实运笔动效工程准则（重要）

在构建真实人手握笔（`RealHandFollower`）或笔刷（`PencilFollower`）动效时，必须严格执行以下工程铁律：

### 1. 【防拉伸变形铁律】Tailwind Preflight 样式穿透与强制 1:1 保护
- **根因分析**：现代前端框架（Tailwind CSS / CSS Reset / Preflight）普遍包含全局注入规则：
  ```css
  img, video { max-width: 100%; height: auto; }
  ```
  当人手素材图片放置在 `left/top` 绝对定位、自身尺寸为 0 的父容器内部时，图片的 `width` 会被 Tailwind 强制压缩为 0 或受限于父级，而 `height` 依然维持原图尺寸，导致人手出现**极其严重的横向挤扁、纵向非等比拉伸变形**。
- **强制解决方案**：
  1. 父容器必须显式声明固定像素宽高（如 `width: 1254px, height: 1254px`）；
  2. 子级 `<img>` 标签必须显式设置：
     ```tsx
     style={{
       position: 'absolute',
       left: 0,
       top: 0,
       width: 1254,
       height: 1254,
       minWidth: 1254,
       minHeight: 1254,
       maxWidth: 'none',   // 彻底击穿 Tailwind 的 max-width: 100%
       maxHeight: 'none',
       objectFit: 'contain',
       display: 'block',
       transform: `translate(-${tipOriginalX}px, -${tipOriginalY}px)`, // 笔尖对齐原点
     }}
     ```

### 2. 【划线平稳无抖动原则】杜绝人工高频抽搐
- **常见误区**：在运笔绘制直线、下划线或矩形边框时，滥用高频正弦波或随机噪波（如 `getHandJitter`）直接附加在笔尖或手部坐标上，会导致人手像“患有帕金森”或“电动牙刷”般剧烈晃动，极其失真。
- **规范标准**：
  - **直线与下划线**：手部轨迹坐标保持**绝对平稳顺畅**（如 `handY = height * 0.83`，`handAngle = 5°`），完全不加坐标抖动；
  - **几何矩形边框**：四条边沿直线匀速/缓动平推，拐角处使用 `smoothstep (t * t * (3 - 2 * t))` 减速停顿后平滑转向；
  - **纸面线条微质感**：纸面笔迹本身的微弱手绘纹理交由底层 Canvas/SVG 静态保留，**手部作为刚体动力学系统绝不跟着抖动**。

### 3. 【手腕生理迎角自适应】
真人握笔并非永远固定一个角度滑动，手腕会根据行笔方向产生生理倾角响应：
- **向右行笔（如绘制顶边、下划线）**：手腕自然外展，产生 `+4° ~ +7°` 的正迎角；
- **向左行笔（如绘制底边、文字回钩）**：手腕自然向内收屈，产生 `-5° ~ -8°` 的负倾角；
- **环形/椭圆运笔（如划圈划重点）**：手腕角度随运动切线与所在象限动态旋转（如 `handAngle = -Math.sin(angle) * 10°`），生动呈现手腕环形自转。

### 4. 【空中悬停与 3D 深度投影扩散】
- 引入精确抬笔高度变量 `liftHeight`（`0` 为落笔板面书写，`8~25px` 为换行/位移时的空中悬停）；
- **笔尖仰角动态**：空中移动时笔尖因手腕自然轻微上扬（`pitchUpAngle = liftHeight * 0.32°`）；
- **动态物理环境阴影**：
  - **落笔贴纸时**：投影清晰深敛（`blur: 14px`，`offsetY: 20px`，透明度适中）；
  - **空中悬停时**：投影随高度增大发生物理漫反射（`blur: 28~36px`，`offsetY: 35~45px`，透明度自然衰减），赋予画面震撼的 3D 白板纵深感。

### 5. 【Remotion 纯帧驱动与禁用 CSS Transition】
- Remotion 是基于 Frame 的确定性逐帧光栅化系统。严禁在组件中使用 CSS `transition`（如 `transition: transform 0.15s`），CSS Transition 在时间轴拖拽与跳帧渲染时会导致不可控的时钟漂移与穿模脱节；
- 所有的位移、旋转与滤镜必须直接通过 `useCurrentFrame()` 及 Remotion 的 `interpolate` / `spring` 进行纯数学计算。

---

## 四、 标准使用范式与代码示例

### 示例 1: 真实人手跟随画框、排线与下划线 (`WhiteboardVideo`)

```tsx
import React, { useRef, useEffect } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { RealHandFollower, HandDrawnArrow, CircleHighlight } from 'doudou-remotion-whiteboard/components';

export const WhiteboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // 时序控制
  const boxProgress = interpolate(frame, [10, 60], [0, 1], { extrapolateRight: 'clamp' });
  const underlineProgress = interpolate(frame, [120, 140], [0, 1], { extrapolateRight: 'clamp' });

  let handX = 200;
  let handY = 200;
  let handAngle = 0;
  let liftHeight = 0;
  let isDrawing = true;

  if (frame < 10) {
    // 悬停进场
    handX = interpolate(frame, [0, 10], [width + 100, 200]);
    handY = 200;
    liftHeight = interpolate(frame, [0, 10], [30, 0]);
    handAngle = 4;
    isDrawing = false;
  } else if (frame <= 60) {
    // 平稳画框，拐角减速
    const t = boxProgress;
    handX = 200 + 400 * t;
    handY = 200;
    handAngle = 5; // 向右平稳运笔，绝无多余高频抖动
    liftHeight = 0;
    isDrawing = true;
  } else if (frame < 120) {
    // 提笔移动到下划线位置，3D 投影扩散
    const p = (frame - 60) / 60;
    handX = interpolate(p, [0, 1], [600, 300]);
    handY = interpolate(p, [0, 1], [200, 600]);
    liftHeight = Math.sin(p * Math.PI) * 20; // 空中弧线跃迁
    handAngle = interpolate(p, [0, 1], [5, 2]);
    isDrawing = false;
  } else {
    // 沉稳画下划线
    handX = 300 + 500 * underlineProgress;
    handY = 600;
    handAngle = 5;
    liftHeight = 0;
    isDrawing = true;
  }

  return (
    <div style={{ position: 'relative', width, height, background: '#F8F6F0' }}>
      {/* 顶层真人握笔跟随 */}
      <RealHandFollower
        x={handX}
        y={handY}
        angleDeg={handAngle}
        liftHeight={liftHeight}
        isDrawing={isDrawing}
        handImageUrl={require('./assets/hand_pencil_cutout.png')}
      />
    </div>
  );
};
```

---

## 五、 与生图工具的素材扩展机制

技能全面支持纯代码原生渲染（零外部依赖）。当视频需要**高拟物实物免抠贴图**或**特定定制质感底纹**时，可直接调用当前环境的生图工具生成素材并引入使用：

- **真实右手持笔免抠图**：提示词建议包含 `A first-person top-down view of a real human right hand naturally holding a pencil/pen, drawing downwards on a flat surface, isolated on clean pure transparent/white background, realistic skin texture, high resolution`，生成后传给 `<RealHandFollower handImageUrl="..." />`；
- **真实美术铅笔/白板笔免抠图**：提示词建议包含 `angled at 45 degrees, sharp tip pointed at top-left, clean cutout, isolated on pure white/transparent background, high resolution`，生成后传给 `<PencilFollower customImageUrl="..." />`；
- **复古糙纸/牛皮纸纹理底图**：提示词建议包含 `Seamless vintage watercolor sketchbook paper texture, warm creamy beige, subtle fibers and natural paper grain, top-down flat lay`，作为背景层贴图。

---

## 六、 推荐声音设计 (Foley & Audio Sync)

手绘视频的沉浸感高度依赖精准的音画对位，推荐在 Remotion 中使用 `<Audio>` 标签在以下关键帧对齐音效：
- **运笔阶段**：低音量循环播放铅笔沙沙声（Pencil ASMR）或白板笔滑行微鸣；
- **转折/落笔拐角**：微弱的笔尖轻点顿笔声（Tap）；
- **强调划圈/下划线**：稍快速的书写刮擦声；
- **翻页/立体弹出**：硬卡纸翻动声（Page Flip）；
- **齿轮转动**：轻柔清脆的机械秒针滴答声（Clockwork Ticking）。
