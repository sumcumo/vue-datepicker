module.exports = {
  root: true,
  parserOptions: {
    'parser': 'babel-eslint',
  },
  extends: [
    'airbnb-base',
    'plugin:compat/recommended',
    'plugin:vue/recommended',
    'plugin:jest/recommended',
  ],
  // required to lint *.vue files
  plugins: [
    'import',
    'html',
    'vue',
    'jest',
  ],
  settings: {
    'import/resolver': {
      'webpack': {
        'config': 'eslint-webpack-resolver.config.js',
      },
    },
    polyfills: [
      'Number.isNaN',
    ],
  },
  // add your custom rules here
  rules: {
    'import/extensions': [
      'error',
      'always',
      {
        'js': 'never',
        'vue': 'never',
      },
    ],
    'import/no-extraneous-dependencies': 'off',
    'no-restricted-imports': [
      'error',
      {
        'paths': [
          {
            'name': 'date-fns',
            'message': 'Please import functions from files for smaller bundle size.',
          },
        ],
      },
    ],
    'semi': [
      'error',
      'never',
    ],
    'no-console': [
      'error',
      {
        'allow': [
          'info',
          'warn',
          'error',
        ],
      },
    ],
    'no-unused-vars': [
      'error',
      {
        'argsIgnorePattern': '^_',
      },
    ],
    'complexity': [
      'error',
      20,
    ],
    'max-lines-per-function': [
      'warn',
      {
        'max': 100,
        'skipComments': true,
        'skipBlankLines': true,
      },
    ],

  },
  env: {
    'browser': true,
  },
}
