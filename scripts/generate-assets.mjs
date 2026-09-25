#!/usr/bin/env node
/**
 * 素材生成自动化脚本 (基于生图工具 CLI)
 * 当白板动画需要实物贴图、免抠手写笔、纸张纹理时，一键调度 CloseAI gpt-image-2 模型生成。
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// jasperio 技能 CLI 入口
const JASPERIO_CLI = '/Users/jyx/project/doudou-publish-skills/.agents/skills/doudou-image-jasperio/scripts/cli.js';
const ASSETS_DIR = path.resolve(__dirname, '../assets');

// 预设手绘白板核心素材提示词库
export const ASSET_PROMPTS = {
  // 1. 真实美术铅笔免抠图 (笔尖精准指朝左上方)
  pencil: {
    prompt: 'A premium professional black drawing pencil, angled at 45 degrees, sharp tip pointed at top-left, clean wooden cut, realistic lighting and reflections, isolated on pure white background, product cutout, high resolution',
    size: '1024x1024',
    quality: 'high',
    output: path.join(ASSETS_DIR, 'pencil_real.png'),
  },
  // 2. 真实白板马克笔
  marker: {
    prompt: 'A black whiteboard marker pen, clean corporate style, angled at 45 degrees, isolated on pure white background, professional product photography',
    size: '1024x1024',
    quality: 'high',
    output: path.join(ASSETS_DIR, 'marker_real.png'),
  },
  // 3. 复古高质感牛皮纸/素描纸纹理底图
  vintagePaper: {
    prompt: 'Seamless vintage watercolor sketchbook paper texture, warm creamy beige, subtle fibers and natural paper grain, top-down flat lay texture background, ultra detailed',
    size: '1920x1088',
    quality: 'high',
    output: path.join(ASSETS_DIR, 'vintage_paper.png'),
  },
  // 4. 复古金色机械怀表实物贴图
  pocketWatch: {
    prompt: 'An antique vintage golden pocket watch, open dial with roman numerals, clean studio lighting, isolated on transparent or plain background, high detail macro photography',
    size: '1024x1024',
    quality: 'high',
    output: path.join(ASSETS_DIR, 'pocket_watch.png'),
  },
};

export async function runGenerate(assetKey = 'pencil') {
  const target = ASSET_PROMPTS[assetKey];
  if (!target) {
    console.error(`未知素材类型: ${assetKey}，支持列表:`, Object.keys(ASSET_PROMPTS));
    process.exit(1);
  }

  console.log(`[doudou-remotion-whiteboard] 正在调用生图工具生成素材 [${assetKey}]...`);
  console.log(`提示词: ${target.prompt}`);

  const args = [
    JASPERIO_CLI,
    '-p', target.prompt,
    '-s', target.size,
    '-q', target.quality,
    '-o', target.output,
  ];

  const proc = spawn('node', args, { stdio: 'inherit' });
  return new Promise((resolve, reject) => {
    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`✓ 素材生成成功，保存在: ${target.output}`);
        resolve(target.output);
      } else {
        reject(new Error(`素材生成失败，进程退出码: ${code}`));
      }
    });
  });
}

// 命令行直接执行
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const type = process.argv[2] || 'pencil';
  runGenerate(type).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
