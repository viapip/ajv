import config from '@regioni/eslint-config'
import eslintPluginStylisticTs from '@stylistic/eslint-plugin-ts'

/** @type {import('eslint').Linter.FlatConfig} */
const schema = [
  ...config,
  {
    plugins: {
      '@stylistic/ts': eslintPluginStylisticTs,
    },
    rules: {
      // General
      'eslint-comments/no-unlimited-disable': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['warn', { args: 'none' }],
      'no-param-reassign': ['error', { props: false }],
      // 'no-underscore-dangle': ['error', { allow: ['_id', '_count'] }],
      // 'no-shadow': ['error', { allow: ['_id', '_count'] }],
      'no-unused-expressions': ['error', { allowShortCircuit: true }],
      'no-shadow-restricted-names': ['error'],

      // Stylistic
      'curly': ['error', 'all'],
      'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
      'newline-before-return': ['error'],
      'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
      'multiline-ternary': ['error', 'always'],
      // 'brace-style': ['error', '1tbs'],
      'arrow-body-style': ['error', 'as-needed'],
      'eqeqeq': ['error', 'always'],
    },
  },
]

export default schema
