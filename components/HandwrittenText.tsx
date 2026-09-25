import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

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

  if (frame < startFrame) return null;

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const visibleLength = Math.floor(progress * text.length);
  const currentText = text.slice(0, visibleLength);

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
            animation: 'blink 0.6s infinite',
          }}
        />
      )}
    </div>
  );
};
