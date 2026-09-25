import React from 'react';

export interface RealHandFollowerProps {
  x: number;
  y: number;
  angleDeg?: number;            // 整体微调角度（建议随切线与朝向自适应）
  scale?: number;               // 缩放比例（默认 0.38）
  opacity?: number;             // 不透明度
  isDrawing?: boolean;          // 是否处于落笔书写状态
  liftHeight?: number;          // 空中抬笔悬停高度 (px, 0 为贴合板面)
  handImageUrl?: string;        // 握笔手部免抠图片路径
  tipOriginalX?: number;        // 原始素材笔尖 X 坐标（默认 284）
  tipOriginalY?: number;        // 原始素材笔尖 Y 坐标（默认 1046）
  imageWidth?: number;          // 原始素材宽度（默认 1254）
  imageHeight?: number;         // 原始素材高度（默认 1254）
}

/**
 * RealHandFollower 真实人手握笔跟随组件
 *
 * 核心设计准则：
 * 1. 【防拉伸变形保护】：锁定容器绝对像素与 maxWidth: 'none'、minWidth、minHeight，
 *    彻底抵御 Tailwind CSS / CSS Reset 中 `img { max-width: 100% }` 对零宽绝对定位父容器图片的横向挤压变形。
 * 2. 【笔尖绝对原点 (0, 0)】：通过精准负向平移，将笔尖像素对齐至 (0, 0)，无论如何旋转与缩放，笔尖永远紧密贴合落笔点。
 * 3. 【真实生理运笔动力学】：运笔平稳沉着，严禁滥用高频正弦噪波导致人手抽搐；支持随运笔方向手腕生理自适应偏角。
 * 4. 【空中悬停与 3D 深度投影扩散】：通过 liftHeight 动态驱动投影扩散模糊半径与衰减，营造超强纸面空间感。
 */
export const RealHandFollower: React.FC<RealHandFollowerProps> = ({
  x,
  y,
  angleDeg = 0,
  scale = 0.38,
  opacity = 1,
  isDrawing = true,
  liftHeight,
  handImageUrl,
  tipOriginalX = 284,
  tipOriginalY = 1046,
  imageWidth = 1254,
  imageHeight = 1254,
}) => {
  if (opacity <= 0) return null;

  // 1. 精确悬空高度计算 (默认落笔为 0，抬笔为 16px)
  const effectiveLift = liftHeight !== undefined
    ? Math.max(0, liftHeight)
    : (isDrawing ? 0 : 16);

  // 2. 笔尖仰角动态 (抬起时笔尖因手腕自然轻微上扬，落笔时贴合板面，平稳无晃动)
  const pitchUpAngle = effectiveLift > 0 ? Math.min(6.5, effectiveLift * 0.32) : 0;
  const dynamicAngle = angleDeg + pitchUpAngle;

  // 3. 真实物理投影扩散与强度随高度动态衰减
  const shadowBlur = Math.round(14 + effectiveLift * 0.9);
  const shadowOffsetY = Math.round(20 + effectiveLift * 1.1);
  const shadowOpacity = Math.max(0.06, 0.22 - effectiveLift * 0.005);
  const shadowFilter = `drop-shadow(14px ${shadowOffsetY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity.toFixed(3)}))`;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y - effectiveLift,
        width: 0,
        height: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        opacity,
      }}
    >
      {/* 缩放与旋转层：以 (0, 0) 即笔尖为绝对旋转锚点 */}
      <div
        style={{
          width: imageWidth,
          height: imageHeight,
          position: 'relative',
          transform: `scale(${scale}) rotate(${dynamicAngle}deg)`,
          transformOrigin: '0px 0px',
          filter: shadowFilter,
        }}
      >
        {handImageUrl && (
          /* 贴图平移层：将笔尖像素负向归零到 (0, 0)，严格强制 1:1 等比防止变形 */
          <img
            src={handImageUrl}
            alt="Hand holding pen"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: imageWidth,
              height: imageHeight,
              minWidth: imageWidth,
              minHeight: imageHeight,
              maxWidth: 'none',
              maxHeight: 'none',
              objectFit: 'contain',
              transform: `translate(-${tipOriginalX}px, -${tipOriginalY}px)`,
              display: 'block',
              userSelect: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
};
