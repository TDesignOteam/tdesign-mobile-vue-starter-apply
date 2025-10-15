import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },
  formatters: {
    css: true,
    html: true,
    markdown: 'prettier',
  },
  rules: {
    'no-console': 'off',
  },
  ignores: [
    'public/mockServiceWorker.js',
    '.vscode/*',
  ],
})
