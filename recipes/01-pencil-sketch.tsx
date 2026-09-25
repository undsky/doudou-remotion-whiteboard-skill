import React, { useRef, useEffect } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { PencilFollower } from '../components/PencilFollower';
import { getHandJitter } from '../math/hand-jitter';

export interface PencilSketchRecipeProps {
  title?: string;
  subtitle?: string;
}

/**
 * 镜头配方 01: 铅笔素描与草图生长 (Pencil Sketch & Cross-hatching)
 * 完美复刻 Claude Spark 视频第 1 幕：圆规打底、十瓣花生长、排线阴影与铅笔跟随
 */
export const PencilSketchRecipe: React.FC<PencilSketchRecipeProps> = ({
  title = 'Hello',
  subtitle = 'Claude · March 2023',
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 动画时间轴进度
  const circleProgress = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: 'clamp' });
  const petalProgress = interpolate(frame, [40, 120], [0, 1], { extrapolateRight: 'clamp' });
  const textProgress = interpolate(frame, [120, 160], [0, 1], { extrapolateRight: 'clamp' });

  // 记录笔尖位置
  const tipRef = useRef({ x: width / 2, y: height / 2, angle: 45, visible: true });

  const cx = width * 0.35;
  const cy = height * 0.5;
  const radius = 160;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // 1. 暖米色纸张底色
    ctx.fillStyle = '#F5F2E9';
    ctx.fillRect(0, 0, width, height);

    // 2. 绘制圆规打底辅助虚线
    if (circleProgress > 0) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(140, 130, 120, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 6]);

      const endAngle = circleProgress * Math.PI * 2;
      for (let a = 0; a <= endAngle; a += 0.05) {
        const jitter = getHandJitter(a * 4, 1.2, 0.3, 10).dx;
        const x = cx + (radius + jitter) * Math.cos(a);
        const y = cy + (radius + jitter) * Math.sin(a);
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        if (frame < 40) {
          tipRef.current = { x, y, angle: (a * 180) / Math.PI + 70, visible: true };
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 3. 绘制十瓣花花瓣轮廓与素描排线
    if (petalProgress > 0) {
      const totalPetals = 10;
      const currentDrawn = petalProgress * totalPetals;

      ctx.strokeStyle = '#2b2621';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 0; i < totalPetals; i++) {
        if (i > currentDrawn) break;
        const localProg = Math.min(1, currentDrawn - i);
        const baseAngle = (i / totalPetals) * Math.PI * 2;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(baseAngle);

        const pLen = 130;
        const pWidth = 20;

        // 花瓣轮廓
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-pWidth / 2, -pLen * 0.8 * localProg);
        ctx.arc(0, -pLen * localProg, pWidth / 2, Math.PI, 0, false);
        ctx.lineTo(pWidth / 2, 0);
        ctx.stroke();

        // 笔尖跟随当前正在画的花瓣顶端
        if (i === Math.floor(currentDrawn) && frame >= 40 && frame < 120) {
          const curTipX = cx + Math.cos(baseAngle - Math.PI / 2) * pLen * localProg;
          const curTipY = cy + Math.sin(baseAngle - Math.PI / 2) * pLen * localProg;
          tipRef.current = {
            x: curTipX,
            y: curTipY,
            angle: (baseAngle * 180) / Math.PI + 40,
            visible: true,
          };
        }

        // 素描排线 (Cross-hatching 阴影填充)
        if (localProg > 0.4) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(65, 55, 45, 0.55)';
          ctx.lineWidth = 1.0;
          for (let y = -15; y > -pLen * localProg + 12; y -= 7) {
            const jitterY = getHandJitter(i * 10 + y, 1.2, 0.5, 99).dy;
            ctx.moveTo(-pWidth / 3, y + jitterY);
            ctx.lineTo(pWidth / 3, y - 5 + jitterY);
          }
          ctx.stroke();
        }

        ctx.restore();
      }

      // 花蕊中心
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#2b2621';
      ctx.fill();
    }
  }, [frame, width, height, circleProgress, petalProgress, cx, cy]);

  return (
    <div style={{ position: 'relative', width, height, overflow: 'hidden' }}>
      <canvas ref={canvasRef} width={width} height={height} />

      {/* 右侧手写标题 */}
      <div
        style={{
          position: 'absolute',
          left: width * 0.58,
          top: height * 0.42,
          fontFamily: '"Caveat", cursive, "Comic Sans MS", sans-serif',
          color: '#2b2621',
          userSelect: 'none',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, fontStyle: 'italic' }}>
          {textProgress > 0 ? title.slice(0, Math.floor(textProgress * title.length)) : ''}
        </div>
        <div style={{ fontSize: 26, marginTop: 32, opacity: textProgress }}>
          {subtitle}
        </div>
      </div>

      {/* 实时笔尖跟随铅笔 */}
      <PencilFollower
        x={tipRef.current.x}
        y={tipRef.current.y}
        angleDeg={tipRef.current.angle}
        opacity={frame < 170 ? 1 : 0}
      />
    </div>
  );
};
