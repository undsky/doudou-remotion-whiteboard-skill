import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BlueprintGrid, BlueprintBox } from '../components/BlueprintGrid';

export interface BlueprintBridgeRecipeProps {
  title?: string;
  commandLog?: string[];
}

/**
 * 镜头配方 05: 蓝图工程与思维搭建 (Blueprint Bridge)
 * 复刻第 5 幕：深蓝网格图纸、手绘流程节点、悬崖架构跨越与代码终端
 */
export const BlueprintBridgeRecipe: React.FC<BlueprintBridgeRecipeProps> = ({
  title = 'Claude 3.7 Sonnet · thinks before it answers',
  commandLog = [
    '> build the bridge',
    '● read gap.json',
    '● write bridge/truss.ts',
    '✓ 12 tests passed',
  ],
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // 桁架桥搭建进度 (0 ~ 1)
  const bridgeProgress = interpolate(frame, [25, 90], [0, 1], { extrapolateRight: 'clamp' });

  // 终端打字机行数
  const logLineIndex = Math.min(commandLog.length, Math.floor(frame / 20));

  return (
    <BlueprintGrid>
      {/* 1. 左侧悬崖与右侧对岸 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: width * 0.3,
          height: height * 0.45,
          borderRight: '2px solid rgba(255,255,255,0.7)',
          backgroundColor: 'rgba(10, 25, 45, 0.7)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: width * 0.25,
          height: height * 0.45,
          borderLeft: '2px solid rgba(255,255,255,0.7)',
          backgroundColor: 'rgba(10, 25, 45, 0.7)',
        }}
      />

      {/* 2. 悬崖之间架起手绘桁架桥 (SVG 动画线段) */}
      <svg
        style={{
          position: 'absolute',
          left: width * 0.3,
          bottom: height * 0.45 - 35,
          width: width * 0.45,
          height: 40,
        }}
      >
        {/* 桥面横梁 */}
        <line
          x1="0"
          y1="5"
          x2={width * 0.45 * bridgeProgress}
          y2="5"
          stroke="#fff"
          strokeWidth="3"
        />
        {/* 三角形桁架支撑结构 */}
        {Array.from({ length: 12 }).map((_, idx) => {
          const stepX = (width * 0.45) / 12;
          const currentX = idx * stepX;
          if (currentX > width * 0.45 * bridgeProgress) return null;
          return (
            <g key={idx}>
              <line x1={currentX} y1="5" x2={currentX + stepX / 2} y2="35" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
              <line x1={currentX + stepX / 2} y1="35" x2={currentX + stepX} y2="5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
              <line x1={currentX} y1="35" x2={currentX + stepX} y2="35" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            </g>
          );
        })}
      </svg>

      {/* 3. 上方思维思考流程框 */}
      <BlueprintBox x={width * 0.32} y={height * 0.16} width={130} height={70} label="too short" delayFrame={10} />
      <BlueprintBox x={width * 0.46} y={height * 0.16} width={130} height={70} label="too risky" delayFrame={25} />
      <BlueprintBox x={width * 0.60} y={height * 0.16} width={130} height={70} label="yes!" delayFrame={40} />

      {/* 4. 右下角 Claude Code 终端命令行 */}
      <div
        style={{
          position: 'absolute',
          right: 32,
          bottom: 28,
          width: 320,
          backgroundColor: 'rgba(5, 15, 30, 0.85)',
          border: '1.5px solid rgba(255, 255, 255, 0.4)',
          borderRadius: 6,
          padding: '12px 16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          fontFamily: '"Fira Code", monospace',
          fontSize: 14,
        }}
      >
        <div style={{ color: '#7ee787', marginBottom: 8, fontWeight: 700 }}>Claude Code</div>
        {commandLog.slice(0, logLineIndex).map((line, i) => (
          <div key={i} style={{ color: line.startsWith('✓') ? '#7ee787' : '#e6edf3', lineHeight: 1.6 }}>
            {line}
          </div>
        ))}
      </div>

      {/* 5. 左下角标题 */}
      <div
        style={{
          position: 'absolute',
          left: 40,
          bottom: 30,
          fontSize: 24,
          fontFamily: '"Caveat", cursive',
          color: 'rgba(255,255,255,0.9)',
        }}
      >
        {title}
      </div>
    </BlueprintGrid>
  );
};
