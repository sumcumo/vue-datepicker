const prettierConfig = require('./prettier')

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    'airbnb-base',
    'plugin:compat/recommended',
    'prettier',
    'prettier/babel',
    'plugin:jest/recommended',
    'plugin:vue/recommended',
    'prettier/vue',
  ],
  plugins: ['import', 'prettier', 'html', 'vue', 'jest'],
  settings: {
    'import/resolver': {
      webpack: {
        config: 'eslint-webpack-resolver.config.js',
      },
    },
  },
  rules: {
    'prettier/prettier': ['error', prettierConfig],
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
      },
    ],
    'import/no-extraneous-dependencies': 'off',
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
      },
    ],
    'max-nested-callbacks': ['error', { max: 3 }],
    'max-statements': [
      'error',
      {
        max: 10,
      },
      {
        ignoreTopLevelFunctions: false,
      },
    ],
    'complexity': [
      'error',
      {
        max: 5,
      },
    ],
    'max-depth': [
      'error',
      {
        max: 2,
      },
    ],
    'max-params': [
      'error',
      {
        max: 3,
      },
    ],
    'max-lines-per-function': [
      'warn',
      {
        max: 100,
        skipComments: true,
        skipBlankLines: true,
      },
    ],
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      { registeredComponentsOnly: false },
    ],
    'vue/no-deprecated-scope-attribute': 'error',
  },
  overrides: [
    {
      files: ['*.spec.js', '*.config.js'],
      rules: {
        'max-lines-per-function': 'off',
        'max-statements': 'off',
        'max-nested-callbacks': 'off',
        'complexity': 'off',
      },
    },
  ],
  env: {
    browser: true,
  },
}
