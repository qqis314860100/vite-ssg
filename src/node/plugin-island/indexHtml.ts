import { Plugin } from 'vite';
import { readFile } from 'fs/promises';
import { CLIENT_ENTRY_PATH, DEFAULT_TEMPLATE_PATH } from '../constant';

// 读取模版页面
export function pluginIndexHtml(): Plugin {
  return {
    name: 'island:index-html',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            //@fs VITE约定绝对路径需要这样加
            attrs: { type: 'module', src: `/@fs/${CLIENT_ENTRY_PATH}` },
            injectTo: 'body'
          }
        ]
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res) => {
          // 1.读取template.html的内容
          let content = await readFile(DEFAULT_TEMPLATE_PATH, 'utf-8');
          /**
           * @vite热更新方法
           * @会把所有插件的transformIndexHtml 钩子执行一遍
           * https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#middleware-mode
           * */
          content = await server.transformIndexHtml(
            req.url,
            content,
            req.originalUrl
          );
          // 2.响应HTML内容给浏览器
          res.setHeader('Content-Type', 'text/html');
          res.end(content);
        });
      };
    }
  };
}
