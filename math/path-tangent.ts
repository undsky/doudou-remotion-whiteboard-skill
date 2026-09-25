/**
 * 路径切线与角度计算工具
 * 专门用于让铅笔、钢笔或手写笔的笔尖精确贴合路径并跟随运笔方向旋转
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface TangentInfo {
  point: Point2D;
  tangent: Point2D;
  angleRad: number;
  angleDeg: number;
}

/**
 * 在 Canvas 离散采样点数组中，计算给定进度 progress (0~1) 处的点位和切线方向
 */
export function getSampledTangent(
  points: Point2D[],
  progress: number
): TangentInfo {
  if (!points || points.length === 0) {
    return {
      point: { x: 0, y: 0 },
      tangent: { x: 1, y: 0 },
      angleRad: 0,
      angleDeg: 0,
    };
  }

  const clampedProgress = Math.max(0, Math.min(1, progress));
  const totalSegments = points.length - 1;
  const targetIndex = clampedProgress * totalSegments;
  const index = Math.floor(targetIndex);
  const fraction = targetIndex - index;

  const p0 = points[index];
  const p1 = points[Math.min(index + 1, totalSegments)];

  // 插值当前点
  const x = p0.x + (p1.x - p0.x) * fraction;
  const y = p0.y + (p1.y - p0.y) * fraction;

  // 切线向量（取相邻前后点或微元向量）
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;

  let angleRad = Math.atan2(dy, dx);
  if (dx === 0 && dy === 0 && index > 0) {
    const prev = points[index - 1];
    angleRad = Math.atan2(p0.y - prev.y, p0.x - prev.x);
  }

  const angleDeg = (angleRad * 180) / Math.PI;

  return {
    point: { x, y },
    tangent: { x: dx, y: dy },
    angleRad,
    angleDeg,
  };
}

/**
 * 针对圆弧/圆形运动轨迹，计算切线方向与当前位置
 */
export function getCircleTangent(
  cx: number,
  cy: number,
  radius: number,
  angleRad: number,
  clockwise = true
): TangentInfo {
  const x = cx + radius * Math.cos(angleRad);
  const y = cy + radius * Math.sin(angleRad);

  // 切线为法线的垂直向量
  const tangentAngle = angleRad + (clockwise ? Math.PI / 2 : -Math.PI / 2);

  return {
    point: { x, y },
    tangent: {
      x: Math.cos(tangentAngle),
      y: Math.sin(tangentAngle),
    },
    angleRad: tangentAngle,
    angleDeg: (tangentAngle * 180) / Math.PI,
  };
}
