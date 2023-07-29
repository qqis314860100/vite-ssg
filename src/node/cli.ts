import cac from 'cac'
import { createDevServer } from './dev'

const cli = cac('island').version('0.0.1').help()

// 1.bin字段
// 2.npm link
// 3.island

cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  console.log('dev2222', root)
  const server = await createDevServer(root)
  await server.listen()
  // 打印服务器的地址
  server.printUrls()
})

cli
  .command('build [root]', 'build in production')
  .action(async (root: string) => {
    console.log('build', root)
  })

cli.parse()
