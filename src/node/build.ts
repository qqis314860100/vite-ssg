import ora from 'ora';
import { join } from 'path';
import fs from 'fs-extra';
import { pathToFileURL } from 'url';
import { build as viteBuild, InlineConfig } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constant';
import type { RollupOutput } from 'rollup';

// const dynamicImport = new Function('m', 'return import(m)')

export async function bundle(root: string) {
  const resolveViteConfig = (isServer: boolean): InlineConfig => {
    return {
      mode: 'production',
      root,
      build: {
        ssr: isServer,
        outDir: isServer ? '.temp' : 'build',
        rollupOptions: {
          input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
          output: {
            format: isServer ? 'cjs' : 'esm'
          }
        }
      }
    };
  };

  /**
   * @tsc打包
   * @仅这样子写tsc依然会将import打包成require的形式还是cjs不能引入ejs
   *  const { default: ora } = await import('ora')
   * @应该改成这样
   * const dynamicImport = new Function('m', 'return import(m)')
   * const { default: ora } = await dynamicImport('ora')
   *
   * @tsup打包上面的方法就不用了直接import
   */

  const spinner = ora();
  spinner.start('building client + server bundles...');

  try {
    const clientBuild = async () => {
      return viteBuild(resolveViteConfig(false));
    };
    const ServerBuild = async () => {
      return viteBuild(resolveViteConfig(true));
    };
    // 这样写会有阻塞性能的问题，优化 -> promise.all 会并行的执行不会有阻塞的问题
    // await clientBuild()
    // await ServerBuild()
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      ServerBuild()
    ]);
    spinner.stop();
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch {}
}

export async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  const appHtml = render();
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <meta name='description' content="xxx">
  </head>
  <body>
    <div id="root">${appHtml}</div>
  </body>
  </html>
  `.trim();
  // 写到磁盘
  await fs.writeFile(join(root, 'build/index.html'), html);
  await fs.remove(join(root, '.temp'));
  console.log(clientBundle);
}

export async function build(root: string) {
  // 1.打包bundle - client端和server端
  const [clientBundle] = await bundle(root);
  // 2.引入server-entry模块
  const serverEntryPath = join(root, '.temp', 'ssr-entry.js');

  // 3.服务端渲染，产出HTML成ssg产物
  // pathToFileURL 将path按绝对路径解析，并且转换为文件编码格式的网址 file:///F:/workspace/%E5%89%8.../ssr-entry.js
  const { render } = await import(pathToFileURL(serverEntryPath).toString());
  await renderPage(render, root, clientBundle);
}
