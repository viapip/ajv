import config from '@sozdev/eslint-config'
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
      'no-use-before-define': ['error', { functions: false }],
      'no-param-reassign': ['error', { props: false }],
      'no-underscore-dangle': ['error', { allow: ['_id', '_count'] }],
      'no-shadow': ['error', { allow: ['_id', '_count'] }],
      'no-unused-expressions': ['error', { allowShortCircuit: true }],
      'no-shadow-restricted-names': ['error'],

      // Stylistic
      'curly': ['error', 'multi-line', 'consistent'],
      'newline-before-return': ['error'],
      'newline-per-chained-call': ['error', { ignoreChainWithDepth: 1 }],
      'multiline-ternary': ['error', 'always-multiline'],
      'brace-style': ['error', 'stroustrup'],
      'arrow-body-style': ['error', 'always'],
      'eqeqeq': ['error', 'smart'],
    },
  },
]

export default schema
