import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BlueprintBoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  delayFrame?: number;
}

export const BlueprintGrid: React.FC<{
  children?: React.ReactNode;
  gridSize?: number;
  subGridSize?: number;
}> = ({ children, gridSize = 80, subGridSize = 16 }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#0c2340', // 经典深蓝图纸色
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
          linear-gradient(to right, rgba(255, 255, 255, 0.22) 1.5px, transparent 1.5px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.22) 1.5px, transparent 1.5px)
        `,
        backgroundSize: `
          ${subGridSize}px ${subGridSize}px,
          ${subGridSize}px ${subGridSize}px,
          ${gridSize}px ${gridSize}px,
          ${gridSize}px ${gridSize}px
        `,
        overflow: 'hidden',
        color: '#e6edf3',
        fontFamily: '"Fira Code", monospace, "SF Pro SC"',
      }}
    >
      {/* 蓝图边框刻度标尺 */}
      <div
        style={{
          position: 'absolute',
          inset: 12,
          border: '1.5px solid rgba(255, 255, 255, 0.3)',
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  );
};

/**
 * 蓝图手绘粉笔线框组件
 */
export const BlueprintBox: React.FC<BlueprintBoxProps> = ({
  x,
  y,
  width,
  height,
  label,
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim = spring({
    frame: frame - delayFrame,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  if (frame < delayFrame) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        border: '2px solid rgba(255, 255, 255, 0.85)',
        backgroundColor: 'rgba(12, 35, 64, 0.65)',
        backdropFilter: 'blur(2px)',
        borderRadius: '3px',
        padding: '12px',
        boxSizing: 'border-box',
        transform: `scale(${interpolate(anim, [0, 1], [0.85, 1])})`,
        opacity: interpolate(anim, [0, 1], [0, 1]),
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
      }}
    >
      {label && (
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: 1.5,
            borderBottom: '1px dashed rgba(255, 255, 255, 0.4)',
            paddingBottom: 6,
            marginBottom: 8,
            color: '#a5d6ff',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
