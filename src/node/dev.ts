import { createServer } from 'vite';
import { pluginIndexHtml } from './plugin-island/indexHtml';
import PluginReact from '@vitejs/plugin-react';
import { PACKAGE_ROOT } from './constant';

export function createDevServer(root: string) {
  return createServer({
    root,
    // PluginReact 热更新保存react状态的插件
    plugins: [pluginIndexHtml(), PluginReact()],
    server: {
      fs: {
        // 避免启动e2e时,因文件不在e2e目录中而报错The request url "F:/workspace/前端成长之路/vite-ssg/src/runtime/client-entry.tsx" is outside of Vite serving allow list.
        // 将项目中的所有文件都包含进去
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
