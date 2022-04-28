const prettierConfig = require('./prettier')

module.exports = {
  env: {
    browser: true,
  },
  extends: [
    'plugin:vue/recommended',
    'plugin:vue-types/strongly-recommended',
    'airbnb-base',
    'plugin:compat/recommended',
    'prettier',
    'plugin:cypress/recommended',
    'plugin:jest/recommended',
    '@vue/typescript',
  ],
  plugins: ['import', 'prettier', 'sort-class-members', '@typescript-eslint'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  rules: {
    'vue/valid-v-slot': ['error', { allowModifiers: true }],
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: false,
        ignores: ['i18n'],
      },
    ],
    'vue/no-deprecated-scope-attribute': 'error',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'lodash',
            message:
              'Please import functions from files for smaller bundle size.',
          },
        ],
      },
    ],
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          /**
           * `array: false` avoids false positives like
           * let someValue
           * someValue = someArray[1]
           *
           * must otherwise be written as
           * const [_unused, value] = someArray
           * someValue = value
           *
           * https://mattermost.sumcumo.net/sumcumo/pl/ujjzahusn7gfppm3g8ocn7qnwa
           */
          array: false,
          object: true,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'no-underscore-dangle': [
      'error',
      {
        allow: ['__typename'],
      },
    ],
    'prettier/prettier': ['error', prettierConfig],
    'import/prefer-default-export': 'off',
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
    'arrow-body-style': 'off',
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
    'no-param-reassign': 'off',
    'class-methods-use-this': 'off',
    'sort-class-members/sort-class-members': [
      2,
      {
        order: [
          '[static-properties]',
          '[static-methods]',
          '[properties]',
          'constructor',
          '[getters]',
          '[everything-else]',
        ],
      },
    ],
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        ts: 'never',
      },
    ],
    // Disabling eslint rule and enabling typescript specific to support TS features
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    // false positives with testing-library
    'jest/expect-expect': 'off',
  },
  settings: {
    // https://github.com/johvin/eslint-import-resolver-alias#readme
    'import/resolver': {
      alias: {
        map: [['~', './src']],
        extensions: ['.js', '.ts', '.d.ts'],
      },
    },
  },
  overrides: [
    {
      files: ['*.spec.ts', '*.spec.js', '*.config.js'],
      rules: {
        'max-lines-per-function': 'off',
        'max-statements': 'off',
        'max-nested-callbacks': 'off',
        'complexity': 'off',
      },
    },
  ],
}
