import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { HandDrawnGear } from '../components/MechanicalGears';

export interface MechanicalCollageRecipeProps {
  title?: string;
  subtitle?: string;
}

/**
 * 镜头配方 04: 机械齿轮啮合联动 (Mechanical Collage)
 * 复刻第 4 幕：多个手绘齿轮精确按齿数比反向咬合自转，卡片浮现
 */
export const MechanicalCollageRecipe: React.FC<MechanicalCollageRecipeProps> = ({
  title = 'Claude 3.5 Sonnet',
  subtitle = 'makes things · uses a computer',
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const card1 = spring({ frame: frame - 15, fps, config: { damping: 14 } });
  const card2 = spring({ frame: frame - 28, fps, config: { damping: 14 } });

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#e6edf2', // 浅蓝灰清爽底色
        overflow: 'hidden',
        fontFamily: '"Caveat", cursive, "Comic Sans MS", sans-serif',
      }}
    >
      {/* 1. 左侧浮现手绘图表卡片 */}
      <div
        style={{
          position: 'absolute',
          left: width * 0.12,
          top: height * 0.25,
          width: 130,
          height: 100,
          border: '2px solid #333',
          backgroundColor: '#fff',
          borderRadius: 4,
          padding: 8,
          boxShadow: '4px 6px 12px rgba(0,0,0,0.08)',
          transform: `scale(${interpolate(card1, [0, 1], [0.7, 1])}) rotate(-4deg)`,
          opacity: card1,
        }}
      >
        <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>📈 Performance</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: 50, gap: 8 }}>
          <div style={{ width: 16, height: '40%', backgroundColor: '#e76f51' }} />
          <div style={{ width: 16, height: '70%', backgroundColor: '#2a9d8f' }} />
          <div style={{ width: 16, height: '95%', backgroundColor: '#e9c46a' }} />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: width * 0.1,
          top: height * 0.5,
          width: 140,
          height: 90,
          border: '2px solid #333',
          backgroundColor: '#fff',
          borderRadius: 4,
          padding: 8,
          boxShadow: '4px 6px 12px rgba(0,0,0,0.08)',
          transform: `scale(${interpolate(card2, [0, 1], [0.7, 1])}) rotate(3deg)`,
          opacity: card2,
        }}
      >
        <div style={{ fontSize: 13, color: '#666' }}>{'</> code test'}</div>
        <div style={{ fontSize: 11, color: '#999', marginTop: 6 }}>✓ 48 tests passed</div>
      </div>

      {/* 2. 中央三联手绘咬合齿轮群（齿数比啮合反转） */}
      <div style={{ position: 'absolute', left: width * 0.65, top: height * 0.5 }}>
        {/* 主动轮 1 (半径 90, 16 齿, 角速度 0.8) */}
        <HandDrawnGear
          x={0}
          y={0}
          radius={90}
          teethCount={16}
          speed={0.8}
          color="#3a322d"
          fillColor="rgba(244, 211, 162, 0.45)"
        />
        {/* 从动轮 2 (半径 65, 12 齿, 角速度 -1.06 反向) */}
        <HandDrawnGear
          x={135}
          y={-75}
          radius={65}
          teethCount={12}
          speed={-1.06}
          color="#3a322d"
          fillColor="rgba(235, 175, 160, 0.45)"
        />
        {/* 从动轮 3 (半径 48, 8 齿, 角速度 -1.6 反向) */}
        <HandDrawnGear
          x={-115}
          y={70}
          radius={48}
          teethCount={8}
          speed={-1.6}
          color="#3a322d"
          fillColor="rgba(180, 210, 205, 0.45)"
        />
      </div>

      {/* 3. 底部文字 */}
      <div
        style={{
          position: 'absolute',
          left: width * 0.08,
          bottom: height * 0.1,
          color: '#2b2621',
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 24, opacity: 0.8, marginTop: 8 }}>{subtitle}</div>
      </div>
    </div>
  );
};
