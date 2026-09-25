/**
 * 手绘线条微颤/手抖噪声扰动生成器
 * 赋予机械式的直线与贝塞尔曲线真实人类手绘的不规则质感
 */

// 轻量级一维/二维分形噪波实现，确保零外部依赖下也能百分之百运行
function pseudoNoise(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1; // 范围 [-1, 1]
}

function smoothNoise1D(x: number): number {
  const i = Math.floor(x);
  const f = x - i;
  // 余弦平滑插值
  const ft = f * Math.PI;
  const fSmooth = (1 - Math.cos(ft)) * 0.5;
  return pseudoNoise(i) * (1 - fSmooth) + pseudoNoise(i + 1) * fSmooth;
}

/**
 * 计算指定位置的手绘扰动偏移向量 (dx, dy)
 * @param t 沿路径的参数或时间 (0 ~ N)
 * @param amplitude 抖动振幅（像素，默认 1.5px）
 * @param frequency 抖动频率（默认 0.3）
 * @param seed 随机种子
 */
export function getHandJitter(
  t: number,
  amplitude = 1.5,
  frequency = 0.3,
  seed = 42
): { dx: number; dy: number } {
  const nx = smoothNoise1D(t * frequency + seed);
  const ny = smoothNoise1D(t * frequency + seed + 100.5);

  return {
    dx: nx * amplitude,
    dy: ny * amplitude,
  };
}

/**
 * 对一条折线点集施加手绘扰动，输出粗糙感点集
 */
export function jitterPoints(
  points: { x: number; y: number }[],
  amplitude = 1.5,
  frequency = 0.4,
  seed = 1
): { x: number; y: number }[] {
  return points.map((p, idx) => {
    // 端点处振幅通常衰减，使线段连接更自然
    const factor = Math.min(1, Math.min(idx, points.length - 1 - idx) / 2);
    const { dx, dy } = getHandJitter(idx, amplitude * factor, frequency, seed);
    return {
      x: p.x + dx,
      y: p.y + dy,
    };
  });
}
