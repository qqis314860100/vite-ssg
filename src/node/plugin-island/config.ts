import { SiteConfig } from 'shared/types';
import { Plugin /* ViteDevServer */ } from 'vite';
import path from 'path';

const SITE_DATA_ID = 'island:site-data';

// 虚拟模块，当项目引入 import islandSiteData from 'island:site-data'时会进入到vite的这个钩子,将模块内容以字符串的形式导出
export function pluginConfig(
  config: SiteConfig,
  restart: () => Promise<void>
): Plugin {
  // let server: ViteDevServer | null = null;
  return {
    name: 'island:site-data',
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        // 规则
        return '\0' + SITE_DATA_ID;
      }
    },
    load(id) {
      if (id === '\0' + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },
    // 获取server的实例
    // configureServer(s) {
    //   server = s;
    // },
    // 热更新
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [config.configPath];
      const include = (id: string) =>
        customWatchedFiles.some((file) => id.includes(file));
      if (include(ctx.file)) {
        console.log(
          `\n${path.relative(
            config.root,
            ctx.file
          )} changed,restarting server...`
        );
        // 重启dev server
        // 方案讨论： 1.插件内重启vite的dev server
        // ❌ 没有作用，因为并没有进行 island 框架配置的重新读取
        // await server.restart();

        // 方案2: 手动调用dev.ts的createServer
        await restart();
      }
    }
  };
}
