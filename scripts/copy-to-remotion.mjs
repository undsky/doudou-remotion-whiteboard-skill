#!/usr/bin/env node
/**
 * 组件同步脚本
 * 将本 skill 的通用组件与数学库复制到宿主 Remotion 项目中 (默认: ./src/components/whiteboard)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const TARGET_DIR = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.resolve('/Users/jyx/project/undsky/src/components/whiteboard');

console.log(`[doudou-remotion-whiteboard] 正在同步白板动画核心组件到: ${TARGET_DIR}`);

function copyFolderRecursive(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  for (const file of files) {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursive(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  }
}

// 同步 components 与 math
copyFolderRecursive(path.join(ROOT_DIR, 'components'), path.join(TARGET_DIR, 'components'));
copyFolderRecursive(path.join(ROOT_DIR, 'math'), path.join(TARGET_DIR, 'math'));
copyFolderRecursive(path.join(ROOT_DIR, 'recipes'), path.join(TARGET_DIR, 'recipes'));

console.log('✓ 白板组件库已成功安装到 Remotion 项目！可在代码中直接 import 引用。');
