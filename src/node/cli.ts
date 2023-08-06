import cac from 'cac';
import { build } from './build';

const cli = cac('island').version('0.0.1').help();

// 1.bin字段
// 2.npm link
// 3.island

cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  const createServer = async () => {
    // 从dist构建产物中获取
    const { createDevServer } = await import('./dev');
    const server = await createDevServer(root, async () => {
      await server.close();
      await createServer();
    });
    await server.listen();
    // 打印服务器的地址
    server.printUrls();
  };
  await createServer();
});

cli
  .command('build [root]', 'build in production')
  .action(async (root: string) => {
    console.log('build', root);
    build(root);
  });

cli.parse();
