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
 * 内部自动处理 Retina 2x/3x 高清设备像素比 (devicePixelRatio)，杜绝模糊
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
