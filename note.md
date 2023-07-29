## MVP版本
  最小复用版本
  1.cli脚手架搭建
    例子:NPM、yarn、PNPM、vite
    主要功能:
      1.信息展示，如vite-help、vite-version
      2.子命令分发，如vite server、vite build
      3.参数解析，如vite --port=8080
      4.信息交互，如实现多选框、输入框
    社区经典CLI方案:
      1.commander.js(NODE.j CLI元老方案)
      2.yargs(功能齐全，但相对复杂)
      3.cac(vite内置方案，社区新秀，轻量、简洁)
  2.基于vite的devServer封装
    什么是devServer
      概念
        开发阶段的服务器
        本质是一个nodejs开发的http server
      作用
        资源编译
        模块热更新(hmr)
        静态资源服务
      举例
        webpack-dev-server
        vite
    为什么基于vite来实现dev server?
      项目基于vite进行构建
      vite dev server 拥有完整的中间件机制，易于扩展
  3.项目基本目录结构搭建
  4.react主题组件的前端渲染
  5.服务端渲染，产出HTML
