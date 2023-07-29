import { createServer } from 'vite';
import { pluginIndexHtml } from './plugin-island/indexHtml';
import PluginReact from '@vitejs/plugin-react';

export function createDevServer(root: string) {
  return createServer({
    root,
    // PluginReact 热更新保存react状态的插件
    plugins: [pluginIndexHtml(), PluginReact()]
  });
}
