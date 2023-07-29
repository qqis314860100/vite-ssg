import * as path from 'path'

export const PACKAGE_ROOT = path.join(__dirname, '..', '..', '..') // 和path.resolve()相同

export const CLIENT_ENTRY_PATH = path.join(
  PACKAGE_ROOT,
  'src',
  'runtime',
  'client-entry.tsx'
)

export const SERVER_ENTRY_PATH = path.join(
  PACKAGE_ROOT,
  'src',
  'runtime',
  'ssr-entry.tsx'
)
// console.log(
//   'PACKAGE_ROOT==================',
//   path.resolve(__dirname, '..', 'runtime'), // F:\workspace\前端成长之路\vite-ssg\dist\node\runtime
//   path.resolve(), // F:\workspace\前端成长之路\vite-ssg
//   __dirname, // F:\workspace\前端成长之路\vite-ssg\dist\node\constant
//   PACKAGE_ROOT, //  F:\workspace\前端成长之路\vite-ssg
//   SERVER_ENTRY_PATH, //F:\workspace\前端成长之路\vite-ssg\src\runtime\client-entry.tsx
//   '--------'
// )

export const DEFAULT_TEMPLATE_PATH = path.join(PACKAGE_ROOT, 'template.html')
