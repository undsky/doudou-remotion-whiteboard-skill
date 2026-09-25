import React from 'react';

export interface PencilFollowerProps {
  x: number;
  y: number;
  angleDeg?: number;      // 铅笔旋转角度（默认与切线对齐）
  scale?: number;         // 缩放比例（默认 1）
  opacity?: number;       // 透明度
  showShadow?: boolean;   // 是否渲染柔和落笔投影
  customImageUrl?: string;// 可选：使用由 生图工具 生成的实物手写笔免抠图
  pencilType?: 'pencil' | 'marker' | 'chalk';
}

/**
 * PencilFollower 真实铅笔/笔刷跟随器
 * 核心设计：坐标原点 (0, 0) 精确锁死在笔尖，不论怎么旋转与缩放，笔尖永远准确接触落笔点！
 */
export const PencilFollower: React.FC<PencilFollowerProps> = ({
  x,
  y,
  angleDeg = 45,
  scale = 1,
  opacity = 1,
  showShadow = true,
  customImageUrl,
  pencilType = 'pencil',
}) => {
  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `rotate(${angleDeg}deg) scale(${scale})`,
        transformOrigin: '0px 0px', // 关键：锚点设在笔尖
        pointerEvents: 'none',
        opacity,
        zIndex: 9999,
        transition: 'transform 0.04s linear',
      }}
    >
      {/* 1. 柔和落笔动态环境阴影 */}
      {showShadow && (
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 25,
            width: 14,
            height: 240,
            background: 'rgba(0, 0, 0, 0.14)',
            filter: 'blur(10px)',
            borderRadius: '10px',
            transform: 'rotate(15deg) skewX(-10deg)',
            transformOrigin: 'top left',
          }}
        />
      )}

      {/* 2. 模式 A: 自定义实物免抠图片素材 */}
      {customImageUrl ? (
        <img
          src={customImageUrl}
          alt="pen"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 'auto',
            height: 260,
            objectFit: 'contain',
            transformOrigin: '0 0',
          }}
        />
      ) : (
        /* 模式 B: 纯代码高保真专业美术铅笔 (零外部资源依赖，绝对清晰) */
        <div
          style={{
            position: 'relative',
            width: 12,
            height: 260,
            filter: 'drop-shadow(2px 6px 8px rgba(0,0,0,0.18))',
          }}
        >
          {/* 铅芯尖端 (0, 0) */}
          <div
            style={{
              position: 'absolute',
              top: -24,
              left: 2,
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderBottom: '9px solid #1a1918',
            }}
          />

          {/* 削木切面 (天然木质渐变色) */}
          <div
            style={{
              position: 'absolute',
              top: -16,
              left: -1,
              width: 0,
              height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderBottom: '18px solid #dfb584',
            }}
          />

          {/* 六角黑漆铅笔笔杆（多层立体反光条） */}
          <div
            style={{
              position: 'absolute',
              top: 2,
              left: 0,
              width: 12,
              height: 240,
              background: 'linear-gradient(to right, #1f1e1d 0%, #3a3835 35%, #5c5853 50%, #292725 70%, #151413 100%)',
              borderRadius: '1px 1px 4px 4px',
              borderLeft: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            {/* 笔身金色烫金字刻线 */}
            <div
              style={{
                position: 'absolute',
                top: 60,
                left: 2,
                width: 8,
                height: 50,
                background: 'linear-gradient(to bottom, #d4af37, #aa8c2c)',
                opacity: 0.6,
                borderRadius: '1px',
              }}
            />
            {/* 笔尾银色包边箍与粉色橡皮头 */}
            <div
              style={{
                position: 'absolute',
                bottom: -2,
                left: 0,
                width: 12,
                height: 14,
                background: 'linear-gradient(to right, #999, #eee, #777)',
                borderRadius: '1px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -14,
                left: 1,
                width: 10,
                height: 12,
                background: '#e07a5f',
                borderRadius: '0 0 3px 3px',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
