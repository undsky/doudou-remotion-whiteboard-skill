import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface HandDrawnArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  startFrame?: number;
  durationFrames?: number;
  color?: string;
  strokeWidth?: number;
  curvature?: number; // 弧度曲率
}

/**
 * 手绘动态箭头连接线
 * 顺滑贝塞尔主弧线 + 箭头尖端两翼分步显现（配合真实运笔节奏）
 */
export const HandDrawnArrow: React.FC<HandDrawnArrowProps> = ({
  x1,
  y1,
  x2,
  y2,
  startFrame = 0,
  durationFrames = 35,
  color = '#2b2621',
  strokeWidth = 2.5,
  curvature = 0,
}) => {
  const frame = useCurrentFrame();

  if (frame < startFrame) return null;

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  // 贝塞尔控制点
  const mx = (x1 + x2) / 2 - (y2 - y1) * curvature;
  const my = (y1 + y2) / 2 + (x2 - x1) * curvature;

  // 根据进度生成采样点（平滑贝塞尔，无机械锯齿）
  const steps = 30;
  const currentSteps = Math.floor(steps * progress);
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i <= currentSteps; i++) {
    const t = i / steps;
    // 二阶贝塞尔
    const bx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2;
    const by = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2;
    points.push({ x: bx, y: by });
  }

  if (points.length < 2) return null;

  const d = `M ${points[0].x} ${points[0].y} L ${points.slice(1).map(p => `${p.x} ${p.y}`).join(' L ')}`;

  // 箭头尖端
  const last = points[points.length - 1];
  const prev = points[Math.max(0, points.length - 3)];
  const angle = Math.atan2(last.y - prev.y, last.x - prev.x);
  const headLen = 14;

  const a1x = last.x - headLen * Math.cos(angle - Math.PI / 6);
  const a1y = last.y - headLen * Math.sin(angle - Math.PI / 6);
  const a2x = last.x - headLen * Math.cos(angle + Math.PI / 6);
  const a2y = last.y - headLen * Math.sin(angle + Math.PI / 6);

  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {/* 箭头尖端两翼分步渲染：先撇上翼，再撇下翼，配合人手运笔真实节奏 */}
      {frame >= startFrame + durationFrames - 7 && (
        <path
          d={`M ${a1x} ${a1y} L ${last.x} ${last.y}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {frame >= startFrame + durationFrames - 3 && (
        <path
          d={`M ${last.x} ${last.y} L ${a2x} ${a2y}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};

export interface CircleHighlightProps {
  x: number;
  y: number;
  rx: number;
  ry: number;
  startFrame?: number;
  durationFrames?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * 手绘椭圆划圈划重点组件
 * 平滑无抖动，笔触紧密贴合笔尖轨迹
 */
export const CircleHighlight: React.FC<CircleHighlightProps> = ({
  x,
  y,
  rx,
  ry,
  startFrame = 0,
  durationFrames = 30,
  color = '#e76f51', // 醒目强调红橙色
  strokeWidth = 3,
}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const endAngle = progress * Math.PI * 2.15; // 稍微多绕一点点重合，真实手绘感
  const points: { x: number; y: number }[] = [];
  const steps = 40;
  const curSteps = Math.floor(steps * progress);

  for (let i = 0; i <= curSteps; i++) {
    const a = (i / steps) * Math.PI * 2.15;
    points.push({
      x: x + rx * Math.cos(a),
      y: y + ry * Math.sin(a),
    });
  }

  if (points.length < 2) return null;
  const d = `M ${points[0].x} ${points[0].y} L ${points.slice(1).map(p => `${p.x} ${p.y}`).join(' L ')}`;

  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
