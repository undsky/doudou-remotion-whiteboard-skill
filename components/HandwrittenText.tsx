import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface HandwrittenTextProps {
  text: string;
  startFrame: number;
  durationFrames?: number;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  onPositionUpdate?: (x: number, y: number) => void;
  style?: React.CSSProperties;
}

/**
 * HandwrittenText 手写打字显现组件
 * 通过字符切片与平滑透明度渐进模拟手写书写过程
 */
export const HandwrittenText: React.FC<HandwrittenTextProps> = ({
  text,
  startFrame,
  durationFrames = 45,
  fontSize = 36,
  color = '#2b2621',
  fontFamily = '"Caveat", "Kalam", "Comic Sans MS", cursive, sans-serif',
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame) return null;

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const visibleLength = Math.floor(progress * text.length);
  const currentText = text.slice(0, visibleLength);

  // 逐帧驱动的光标闪烁（约 0.6s 一个周期），避免依赖不确定的 CSS animation
  const blinkPeriod = Math.max(1, Math.round(fps * 0.6));
  const cursorVisible = (frame - startFrame) % blinkPeriod < blinkPeriod / 2;

  return (
    <div
      style={{
        fontSize,
        color,
        fontFamily,
        lineHeight: 1.4,
        letterSpacing: 1,
        whiteSpace: 'pre-wrap',
        fontStyle: 'italic',
        userSelect: 'none',
        ...style,
      }}
    >
      {currentText}
      {progress < 1 && (
        <span
          style={{
            display: 'inline-block',
            width: 2,
            height: fontSize * 0.9,
            backgroundColor: color,
            marginLeft: 2,
            verticalAlign: 'middle',
            opacity: cursorVisible ? 1 : 0,
          }}
        />
      )}
    </div>
  );
};
