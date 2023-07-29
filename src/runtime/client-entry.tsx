// 浏览器端的入口文件，渲染主题组件

import { createRoot } from 'react-dom/client'
import { App } from './App'

function renderInBrowser() {
  const containerEle = document.getElementById('root')
  if (!containerEle) {
    throw new Error('#root element not found')
  }
  createRoot(containerEle).render(<App />)
}

renderInBrowser()
