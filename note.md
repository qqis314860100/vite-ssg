## MVP版本
  ### 最小复用版本
  #### 1.cli脚手架搭建
    - 例子:NPM、yarn、PNPM、vite
      - 主要功能:
        - 1.信息展示，如vite-help、vite-version
        - 2.子命令分发，如vite server、vite build
        - 3.参数解析，如vite --port=8080
        - 4.信息交互，如实现多选框、输入框
      - 社区经典CLI方案:
        - 1.commander.js(NODE.j CLI元老方案)
        - 2.yargs(功能齐全，但相对复杂)
        - 3.cac(vite内置方案，社区新秀，轻量、简洁)
  #### 2.基于vite的devServer封装
    - 什么是devServer
      - 概念
        - 开发阶段的服务器
        - 本质是一个nodejs开发的http server
      - 作用
        - 资源编译
        - 模块热更新(hmr)
        - 静态资源服务
      - 举例
        - webpack-dev-server
        - vite
      - 为什么基于vite来实现dev server?
        - 项目基于vite进行构建
        - vite dev server 拥有完整的中间件机制，易于扩展
  #### 3.项目基本目录结构搭建
  #### 4.react主题组件的前端渲染
  #### 5.服务端渲染，产出HTML

## CSR、SSR、SSG
  - CSR client side render 客户端渲染
     - 没有HTML具体内容，依靠js执行完成页面渲染，依靠网络请求浏览器拿到js文件去渲染
     - 问题:
        - 1.首屏加载速度慢
        - 2.对SEO（搜索引擎优化）不友好
  - SSR Server side render 服务端渲染
     - 服务端返回完整的HTML内容
        -问题：
          - SSR页面无法进行交互事件的绑定
        - 方案：
          - SSR页面中加入CSR的脚本（同构），完成事件绑定--hydration
  - SSG Static sit Generation 静态站点生成
    - 构建阶段的SSR，build过程产出完整的HTML
      - 优点：
        - 1.服务器压力小
        - 2.继承SSR首屏性能及SEO的优势
      - 局限性：
        - 不适用于数据经常变化的场景

## 接入库构建工具
  ### 对模块格式的思考
    - 主要是ESM和CJS，还有UMD（AMD和CJS的兼容方案，AMD用的非常少了），应该产出哪种模块格式呢
    - CJS commonjs 同步加载 CJS的require方法是没有办法去引入异步加载的包
    - 在CJS中引入EJS的包可以通过将一个异步函数import EJS的包，这种办法必须要支持当前环境能够支持异步加载的 const {default : xxx} = import('xxx')
    - 1.异步环境 2.绕开工具对import的编译
    - EJS ESModule 异步加载 EJS可以兼容CJS机制的包
  
  ### 社区库构建
    - vite/rollup 底层使用rollup进行库打包
    - tsup esbuild打包代码，rollup+rollup-plugins-dts打包类型 既有代码也有类型 √
    - unbuild 原理同tsup，另外包含bundleless模式
```ts
  //在mjs机制中怎么获取__dirname
  // fileURLToPath 将文件编码格式的网址地址转换为 path
  // path.dirname(getFilename()) 读取该文件path的文件夹路径
    var getFilename = () => fileURLToPath(import.meta.url)
    var getDirname = () => path.dirname(getFilename())
    var __dirname = /* @__PURE__ */ getDirname()
```