/**
 * 素描排线 (Hachure & Cross-Hatch) 算法
 * 针对矩形或多边形区域生成均匀/自然的斜线条与交叉排线阴影
 */

export interface LineSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface HachureOptions {
  angleDeg?: number;      // 排线倾斜角（默认 -45 度）
  gap?: number;           // 线条间距（默认 8 像素）
  crossHatch?: boolean;   // 是否生成双向十字交叉排线
  jitterAmp?: number;     // 线条微抖振幅（默认 1.0）
}

/**
 * 在一个限定的局部边界盒 [minX, minY, maxX, maxY] 内生成穿透整个区域的斜线条集合
 */
export function generateHachureLines(
  bounds: { minX: number; minY: number; maxX: number; maxY: number },
  options: HachureOptions = {}
): LineSegment[] {
  const {
    angleDeg = -45,
    gap = 8,
    crossHatch = false,
  } = options;

  const lines: LineSegment[] = [];
  const angles = crossHatch ? [angleDeg, angleDeg + 90] : [angleDeg];

  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const cx = bounds.minX + width / 2;
  const cy = bounds.minY + height / 2;
  const diagonal = Math.hypot(width, height);

  for (const angle of angles) {
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // 扫描线沿垂直方向步进
    const halfDiag = diagonal / 2;
    for (let offset = -halfDiag; offset <= halfDiag; offset += gap) {
      // 局部未旋转空间：水平穿过的线段
      const lx1 = -halfDiag;
      const ly1 = offset;
      const lx2 = halfDiag;
      const ly2 = offset;

      // 旋转并平移到中心点
      const x1 = cx + (lx1 * cos - ly1 * sin);
      const y1 = cy + (lx1 * sin + ly1 * cos);
      const x2 = cx + (lx2 * cos - ly2 * sin);
      const y2 = cy + (lx2 * sin + ly2 * cos);

      lines.push({ x1, y1, x2, y2 });
    }
  }

  return lines;
}
