import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface GearProps {
  x: number;
  y: number;
  radius: number;
  teethCount?: number;
  speed?: number;         // 旋转角速度（正为顺时针，负为逆时针）
  color?: string;
  fillColor?: string;
}

/**
 * 单个手绘机械齿轮组件
 */
export const HandDrawnGear: React.FC<GearProps> = ({
  x,
  y,
  radius,
  teethCount = 12,
  speed = 1,
  color = '#443b35',
  fillColor = 'rgba(235, 215, 185, 0.4)',
}) => {
  const frame = useCurrentFrame();
  const rotationDeg = frame * speed;

  // 生成齿轮路径
  const points: string[] = [];
  const toothDepth = radius * 0.18;
  const angleStep = (Math.PI * 2) / teethCount;

  for (let i = 0; i < teethCount; i++) {
    const a1 = i * angleStep;
    const a2 = a1 + angleStep * 0.3;
    const a3 = a1 + angleStep * 0.7;
    const a4 = (i + 1) * angleStep;

    const rOuter = radius + toothDepth;
    const rInner = radius;

    // 齿根到齿顶四段关键点
    points.push(`${rInner * Math.cos(a1)},${rInner * Math.sin(a1)}`);
    points.push(`${rOuter * Math.cos(a2)},${rOuter * Math.sin(a2)}`);
    points.push(`${rOuter * Math.cos(a3)},${rOuter * Math.sin(a3)}`);
    points.push(`${rInner * Math.cos(a4)},${rInner * Math.sin(a4)}`);
  }

  const d = `M ${points[0]} L ${points.slice(1).join(' L ')} Z`;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rotationDeg}deg)`,
        transformOrigin: 'center center',
      }}
    >
      <svg
        width={(radius + toothDepth) * 2 + 10}
        height={(radius + toothDepth) * 2 + 10}
        viewBox={`${-(radius + toothDepth + 5)} ${-(radius + toothDepth + 5)} ${(radius + toothDepth) * 2 + 10} ${(radius + toothDepth) * 2 + 10}`}
      >
        {/* 齿轮轮廓 */}
        <path
          d={d}
          fill={fillColor}
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 齿轮中心孔与轴心装饰 */}
        <circle cx="0" cy="0" r={radius * 0.28} fill="#fff" stroke={color} strokeWidth="2" />
        <circle cx="0" cy="0" r={radius * 0.08} fill={color} />
        {/* 镂空减重孔（机械美感） */}
        {[0, 120, 240].map((deg) => (
          <circle
            key={deg}
            cx={radius * 0.6 * Math.cos((deg * Math.PI) / 180)}
            cy={radius * 0.6 * Math.sin((deg * Math.PI) / 180)}
            r={radius * 0.14}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
        ))}
      </svg>
    </div>
  );
};
