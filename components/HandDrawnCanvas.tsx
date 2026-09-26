import React, { useRef, useEffect } from 'react';
import { useVideoConfig } from 'remotion';

export interface HandDrawnCanvasProps {
  onDraw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
  backgroundColor?: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * HandDrawnCanvas 手绘专用 Canvas 2D 渲染容器
 * canvas 的像素尺寸直接锁定为合成分辨率 (useVideoConfig 的 width/height)，
 * 与 Remotion 出图分辨率 1:1 对应，无需 devicePixelRatio 缩放即可保证清晰。
 */
export const HandDrawnCanvas: React.FC<HandDrawnCanvasProps> = ({
  onDraw,
  backgroundColor = '#F6F3EB', // 温暖素描纸原色
  style,
  className,
}) => {
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空背景并涂底色
    ctx.save();
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // 执行当前帧绘制回调
    onDraw(ctx, width, height);
    ctx.restore();
  }, [onDraw, width, height, backgroundColor]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        ...style,
      }}
      className={className}
    />
  );
};
