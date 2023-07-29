import * as path from 'path';
import { join } from 'path';

export const PACKAGE_ROOT = path.join(__dirname, '..'); // 和path.resolve()相同

export const RUNTIME_PATH = join(PACKAGE_ROOT, 'src', 'runtime');

export const CLIENT_ENTRY_PATH = path.join(RUNTIME_PATH, 'client-entry.tsx');

export const SERVER_ENTRY_PATH = path.join(RUNTIME_PATH, 'ssr-entry.tsx');
console.log('PACKAGE_ROOT==================', PACKAGE_ROOT, '--------');

export const DEFAULT_TEMPLATE_PATH = path.join(PACKAGE_ROOT, 'template.html');
