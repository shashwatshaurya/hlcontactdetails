// ESLint v9 flat config
// Docs: https://eslint.org/docs/latest/use/configure/configuration-files-new

import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'
import prettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  // TypeScript support
  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },
  // Use vue-eslint-parser for SFCs and let it delegate <script> blocks to TS parser
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
  },
  // Project-specific rule tweaks
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  // Disable formatting-related rules; use Prettier
  prettier,
]
