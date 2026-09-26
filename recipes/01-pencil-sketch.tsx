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

  // 动画时间轴进度 (安全夹取 extrapolateLeft & extrapolateRight)
  const circleProgress = interpolate(frame, [0, 36], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const petalProgress = interpolate(frame, [40, 120], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const textProgress = interpolate(frame, [125, 160], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // 记录笔尖与布局基准
  const cx = width * 0.35;
  const cy = height * 0.5;
  const radius = 160;
  const pLen = 130;
  const textStartX = width * 0.58;
  const textStartY = height * 0.42 + 56;
  const textWidth = Math.max(120, title.length * 36);

  // 笔尖位置在渲染阶段按当前帧直接推导，具备真实的抬笔落笔动力学 (liftHeight)，
  // 杜绝 1-frame 滞后与转折点瞬移跳跃
  const tip = (() => {
    // 阶段 1：圆规打底 (0 ~ 36 帧)，跟随虚线圆末端落笔
    if (frame < 36) {
      const endAngle = circleProgress * Math.PI * 2;
      const jitter = getHandJitter(endAngle * 4, 1.2, 0.3, 10).dx;
      return {
        x: cx + (radius + jitter) * Math.cos(endAngle),
        y: cy + (radius + jitter) * Math.sin(endAngle),
        angle: (endAngle * 180) / Math.PI + 70,
        liftHeight: 0,
        isDrawing: true,
        opacity: 1,
      };
    }

    // 阶段 2：圆规画完，空中抬笔过渡回圆心 (36 ~ 40 帧)，消除 160px 瞬移
    if (frame < 40) {
      const t = interpolate(frame, [36, 40], [0, 1], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
      const startX = cx + radius;
      const startY = cy;
      return {
        x: interpolate(t, [0, 1], [startX, cx]),
        y: interpolate(t, [0, 1], [startY, cy]),
        angle: interpolate(t, [0, 1], [70, 40]),
        liftHeight: Math.sin(t * Math.PI) * 16,
        isDrawing: false,
        opacity: 1,
      };
    }

    // 阶段 3：十瓣花瓣绘制 (40 ~ 120 帧)，连续运笔与抬笔回心，消除每瓣瞬移
    if (frame < 120) {
      const totalPetals = 10;
      const currentDrawn = petalProgress * totalPetals;
      const i = Math.min(totalPetals - 1, Math.floor(currentDrawn));
      const localProg = Math.min(1, currentDrawn - i);
      const baseAngle = (i / totalPetals) * Math.PI * 2;

      // 前 70% 描画花瓣顶端，后 30% 抬笔平滑回撤至花心
      let dist = 0;
      let liftHeight = 0;
      let isDrawing = true;

      if (localProg <= 0.7) {
        dist = (localProg / 0.7) * pLen;
        liftHeight = 0;
        isDrawing = true;
      } else {
        const returnProg = (localProg - 0.7) / 0.3;
        dist = (1 - returnProg) * pLen;
        liftHeight = Math.sin(returnProg * Math.PI) * 8;
        isDrawing = false;
      }

      return {
        x: cx + Math.cos(baseAngle - Math.PI / 2) * dist,
        y: cy + Math.sin(baseAngle - Math.PI / 2) * dist,
        angle: (baseAngle * 180) / Math.PI + 40,
        liftHeight,
        isDrawing,
        opacity: 1,
      };
    }

    // 阶段 4：花朵绘制完成，抬笔飞跃至右侧手写文本起始点 (120 ~ 125 帧)
    if (frame < 125) {
      const t = interpolate(frame, [120, 125], [0, 1], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
      return {
        x: interpolate(t, [0, 1], [cx, textStartX]),
        y: interpolate(t, [0, 1], [cy, textStartY]),
        angle: interpolate(t, [0, 1], [40, 50]),
        liftHeight: Math.sin(t * Math.PI) * 22,
        isDrawing: false,
        opacity: 1,
      };
    }

    // 阶段 5：手写主标题跟随 (125 ~ 160 帧)
    if (frame < 160) {
      const jitterY = getHandJitter(frame * 2, 1.8, 0.4, 88).dy;
      return {
        x: textStartX + textProgress * textWidth,
        y: textStartY + jitterY,
        angle: 50 + getHandJitter(frame * 2, 2.5, 0.3, 77).dx,
        liftHeight: 0,
        isDrawing: true,
        opacity: 1,
      };
    }

    // 阶段 6：书写完毕，自然抬笔并平滑淡出 (160 ~ 175 帧)
    const t = interpolate(frame, [160, 175], [0, 1], {
      extrapolateRight: 'clamp',
      extrapolateLeft: 'clamp',
    });
    const finalX = textStartX + textWidth;
    return {
      x: finalX + t * 35,
      y: textStartY - t * 15,
      angle: 50 + t * 8,
      liftHeight: interpolate(t, [0, 1], [0, 30]),
      isDrawing: false,
      opacity: interpolate(frame, [168, 175], [1, 0], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      }),
    };
  })();

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
      }
      // 补全末端点，确保虚线圆与笔尖严丝合缝
      if (endAngle > 0) {
        const endJitter = getHandJitter(endAngle * 4, 1.2, 0.3, 10).dx;
        ctx.lineTo(
          cx + (radius + endJitter) * Math.cos(endAngle),
          cy + (radius + endJitter) * Math.sin(endAngle)
        );
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

        const pWidth = 20;

        // 花瓣轮廓
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-pWidth / 2, -pLen * 0.8 * localProg);
        ctx.arc(0, -pLen * localProg, pWidth / 2, Math.PI, 0, false);
        ctx.lineTo(pWidth / 2, 0);
        ctx.stroke();

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

      {/* 实时笔尖跟随铅笔 (包含 3D 抬笔动力学与落笔投影) */}
      <PencilFollower
        x={tip.x}
        y={tip.y}
        angleDeg={tip.angle}
        liftHeight={tip.liftHeight}
        isDrawing={tip.isDrawing}
        opacity={tip.opacity}
      />
    </div>
  );
};
