import path from 'path';
import fs from 'fs-extra';
import { loadConfigFromFile } from 'vite';
import { UserConfig } from '../shared/types';

type RawConfig =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>);

function getUserConfigPath(root: string) {
  try {
    const supportConfigFiles = ['config.ts', 'config.js'];
    const configPath = supportConfigFiles
      .map((file) => path.resolve(root, file))
      .find(fs.pathExistsSync);
    return configPath;
  } catch (e) {
    console.log('Failed to load user config.');
    throw e;
  }
}

export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'production' | 'development'
) {
  // 1.获取配置文件路径,支持js,ts格式
  const configPath = getUserConfigPath(root);
  // 2.解析配置文件
  const result = await loadConfigFromFile({ command, mode }, configPath);
  if (result) {
    // 类型断言
    const { config: rawConfig = {} as RawConfig } = result;
    // 1.object
    // 2.promise
    // 3.function
    const useConfig = await (typeof rawConfig === 'function'
      ? rawConfig()
      : rawConfig);
    // as const 类型断言 告诉编译器,将这个表达式推断为最具体的类型
    return [configPath, useConfig] as const;
  } else {
    return [configPath, {} as UserConfig] as const;
  }
}
