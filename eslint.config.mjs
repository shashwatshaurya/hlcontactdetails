// ESLint v9 flat config for Vue 3 + TypeScript + Prettier
// https://eslint.org/docs/latest/use/configure/configuration-files-new

import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  // Ignore build artifacts and config/husky folders
  {
    ignores: ['dist/**', 'node_modules/**', '.husky/**', 'eslint.config.*', '.eslintrc.*'],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  // Global environments
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
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
      // Defer undefined checks to TypeScript
      'no-undef': 'off',
      // Use TS variant and relax strictness for DX
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-unused-expressions': [
        'warn',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
    },
  },
  // Use vue-eslint-parser for SFCs and let it delegate <script> to TS parser
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
    rules: {
      // Avoid blocking on component name collisions (e.g., Header)
      'vue/no-reserved-component-names': 'off',
      // Don't block commits on nextTick style, treat as warning
      'vue/valid-next-tick': 'warn',
    },
  },
  // Project-specific rule tweaks
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  // Disable formatting rules; leave to Prettier
  prettier,
]
