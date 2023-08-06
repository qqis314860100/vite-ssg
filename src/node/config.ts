import path from 'path';
import fs from 'fs-extra';
import { loadConfigFromFile } from 'vite';
import { SiteConfig, UserConfig } from '../shared/types';

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

export function resolveSiteData(userConfig: UserConfig): UserConfig {
  return {
    title: userConfig.title || 'Island.js',
    description: userConfig.description || 'SSG Framework',
    themeConfig: userConfig.themeConfig || {},
    vite: userConfig.vite || {}
  };
}

export async function resolveUserConfig(
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

export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'production' | 'development'
): Promise<SiteConfig> {
  const [configPath, userConfig] = await resolveUserConfig(root, command, mode);
  const siteConfig: SiteConfig = {
    root,
    configPath,
    siteData: resolveSiteData(userConfig as UserConfig)
  };
  return siteConfig;
}

export function defineConfig(config: UserConfig) {
  return config;
}
