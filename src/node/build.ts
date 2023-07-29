import * as path from 'path'
import * as fs from 'fs-extra'
import { build as viteBuild, InlineConfig } from 'vite'
import { CLIENT_ENTRY_PATH, PACKAGE_ROOT, SERVER_ENTRY_PATH } from './constant'
import type { RollupOutput } from 'rollup'

export async function bundle(root: string) {
  try {
    console.log('building client + server bundles...')
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
              format: isServer ? 'cjs' : 'esm',
            },
          },
        },
      }
    }
    const clientBuild = async () => {
      return viteBuild(resolveViteConfig(false))
    }
    const ServerBuild = async () => {
      return viteBuild(resolveViteConfig(true))
    }
    // 这样写会有阻塞性能的问题，优化 -> promise.all 会并行的执行不会有阻塞的问题
    // await clientBuild()
    // await ServerBuild()
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      ServerBuild(),
    ])
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput]
  } catch {}
}

export async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  const appHtml = render()
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
  `.trim()
  // 写到磁盘
  await fs.writeFile(path.join(root, 'build', 'index.html'), html)
  await fs.remove(path.join(root, '.temp'))
}

export async function build(root: string) {
  // 1.打包bundle - client端和server端
  const [clientBundle, serverBundle] = await bundle(root)
  debugger
  // 2.引入server-entry模块
  const serverEntryPath = path.join(PACKAGE_ROOT, root, '.temp', 'ssr-entry.js')
  // 3.服务端渲染，产出HTML成ssg产物
  const { render } = require(serverEntryPath)
  await renderPage(render, root, clientBundle)
}
