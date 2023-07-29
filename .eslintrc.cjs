module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  // 相当于eslint-plugin-react
  plugins: ['react', '@typescript-eslint', 'react-hooks', 'prettier'],
  rules: {
    // prettier和当前代码不匹配时报错
    'prettier/prettier': 'error',
    // ['语法不一致时的表现','期望的标准']
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    // jsx文件是否需要引入react包
    'react/react-in-jsx-scope': 'off',
    "no-empty":"off"
  },
  // warning:React version not specified in eslint-plugin-react settings
  settings:{
    react:{
      version:'detect'
    }
  }
}
