/**
 * 半色调 (Halftone / Risograph) 网点点阵计算
 * 模拟复古报刊凸版网点、波点印刷与点彩派艺术效果
 */

export interface HalftoneDot {
  x: number;
  y: number;
  radius: number;
  color: string;
}

export interface HalftoneGridOptions {
  width: number;
  height: number;
  dotSpacing?: number;    // 网格点间距（默认 10 像素）
  maxRadius?: number;     // 最大圆点半径（默认 dotSpacing * 0.6）
  angleDeg?: number;      // 网点排布旋转角（印刷分色屏角，默认 45 度）
}

/**
 * 根据中心辐射距离或亮度生成扩散生长的网点阵列
 */
export function generateRadialHalftone(
  centerX: number,
  centerY: number,
  maxDistance: number,
  progress: number,
  color = '#e76f51',
  options: HalftoneGridOptions = { width: 1920, height: 1080 }
): HalftoneDot[] {
  const {
    width,
    height,
    dotSpacing = 12,
    maxRadius = 6,
  } = options;

  const dots: HalftoneDot[] = [];
  const currentRadius = maxDistance * progress;

  for (let y = 0; y < height; y += dotSpacing) {
    for (let x = 0; x < width; x += dotSpacing) {
      const dist = Math.hypot(x - centerX, y - centerY);
      if (dist <= currentRadius) {
        // 越靠近中心，点越大；边缘处随进度柔和羽化
        const edgeFactor = Math.max(0, 1 - dist / Math.max(1, currentRadius));
        const r = maxRadius * Math.pow(edgeFactor, 0.7);
        if (r > 0.4) {
          dots.push({
            x,
            y,
            radius: r,
            color,
          });
        }
      }
    }
  }

  return dots;
}
