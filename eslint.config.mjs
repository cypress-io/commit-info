import globals from 'globals'
import pluginJs from '@eslint/js'
import mochaPlugin from 'eslint-plugin-mocha'
import stylistic from '@stylistic/eslint-plugin'

export default [
  pluginJs.configs.recommended,
  mochaPlugin.configs.recommended,
  stylistic.configs.recommended,
  {
    ignores: ['__snapshots__/'],
  },
  {
    rules: {
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/space-before-function-paren': ['error', 'always'],
      'mocha/max-top-level-suites': 'off',
      'mocha/no-mocha-arrows': 'off',
      'mocha/no-setup-in-describe': 'off',
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]
