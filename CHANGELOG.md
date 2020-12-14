# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.1.3](https://github.com/sumcumo/vue-datepicker/compare/v2.1.2...v2.1.3) (2020-11-16)

### Bug Fixes

- **date:** resolve typeable date time ([96d5b8e](https://github.com/sumcumo/vue-datepicker/commit/68998cc1ad9a565fc4ea5413fe3c617062f3a89c))

### [2.1.2](https://github.com/sumcumo/vue-datepicker/compare/v2.1.1...v2.1.2) (2020-10-05)

### Bug Fixes

- **format:** resolve formatDate replacements overlapping ([79eafa5](https://github.com/sumcumo/vue-datepicker/commit/79eafa5b76548c5c39cb0366b55d09ca90a78bf4))
- **html:** move inline styles into classes to fix csp issue ([23e78f9](https://github.com/sumcumo/vue-datepicker/commit/23e78f99fdfa11dd9d99d036f998ddaecdd532a4))

### [2.1.1](https://github.com/sumcumo/vue-datepicker/compare/v2.1.0...v2.1.1) (2020-08-12)

### Bug Fixes

- **project:** add polyfills and use ie11 compatible function ([#25](https://github.com/sumcumo/vue-datepicker/issues/25)) ([523bccd](https://github.com/sumcumo/vue-datepicker/commit/523bccd588e40c9f37a43344eb9ce1640714b78e))

## [2.1.0](https://github.com/sumcumo/vue-datepicker/compare/v2.0.0...v2.1.0) (2020-07-09)

### Features

- **input:** add html input attributes autofocus/maxlength/pattern ([3dee8ee](https://github.com/sumcumo/vue-datepicker/commit/3dee8ee2da2a5be1df0fd2cd608fe7ce56acf46c))

## [2.0.0](https://github.com/sumcumo/vue-datepicker/compare/v1.1.1...v2.0.0) (2020-04-27)

### Breaking changes

The default formatter should now be more reliable but comes with a few changes:

- The property `format` as a function now requires an additional property `parser` which handles the exact opposite check out the updated [documentation](https://sumcumo.github.io/vue-datepicker/guide/DateFormatting/#function-formatter)
- The default formatting has slightly changed to match the formatting rules of other formatters like date-fns

`su` -> `o` for st, rd, nd, th additions

`D` -> `E` for the day of the week

### Features

- **format:** change overall formatting rules to match date-fns ([ebc2792](https://github.com/sumcumo/vue-datepicker/commit/ebc2792d3b68fa154d2d26c72c82f92c87a2ae95))
- **project:** add custom parser ([bcdc8ce](https://github.com/sumcumo/vue-datepicker/commit/bcdc8ce25dc75932fb3d8c471671e775f7875915))

### Bug Fixes

- **dateinput:** get keycode more reliable ([9d790da](https://github.com/sumcumo/vue-datepicker/commit/9d790da769718ec98f436b34ffd3fb52d5c36bee))
- **utils:** resolve issue with formatting ([ab2e54a](https://github.com/sumcumo/vue-datepicker/commit/ab2e54a5cca9d9bf6ae78616c0d599f73301a5b2))

### [1.1.1](https://github.com/sumcumo/vue-datepicker/compare/v1.1.0...v1.1.1) (2020-03-19)

### Bug Fixes

- **docu:** resolve wrong docu for show-calendar-on-button-click ([3c0a8cb](https://github.com/sumcumo/vue-datepicker/commit/3c0a8cb4842411bbb9280174533c2423d2897399))
- **formatting:** resolve custom formatting fn error ([a1197be](https://github.com/sumcumo/vue-datepicker/commit/a1197be3dfe23b6ece15a74e0c91cab2d53e9092))
- **project:** use null value to prevent empty attributes ([7964c88](https://github.com/sumcumo/vue-datepicker/commit/7964c888c31037452c157be2213f44c36706a5b6))

## [1.1.0](https://github.com/sumcumo/vue-datepicker/compare/v1.0.3...v1.1.0) (2020-01-27)

### Features

- **input:** add prop to only open on button click ([fb6fc85](https://github.com/sumcumo/vue-datepicker/commit/fb6fc8539f1f5850cc24ed7974d41b89f15d5b85))

### Bug Fixes

- **input:** remove console warn if id is not set ([fdc03b5](https://github.com/sumcumo/vue-datepicker/commit/fdc03b5a4611397564868a1a3dd90125190db38b))

### [1.0.3](https://github.com/sumcumo/vue-datepicker/compare/v1.0.2...v1.0.3) (2020-01-13)

### Bug Fixes

- **project:** resolve vue-runtime issue ([34ad34d](https://github.com/sumcumo/vue-datepicker/commit/34ad34d50fac92b5bef71761fbee2e788d51c7e7))

### [1.0.2](https://github.com/sumcumo/vue-datepicker/compare/v1.0.1...v1.0.2) (2019-12-05)

### 1.0.1 (2019-12-05)

### Bug Fixes

- **doc:** resolve components not build for doc ([d8f06f9](https://github.com/sumcumo/vue-datepicker/commit/d8f06f9bba4e0769f3ca72150d15f0ea49dfe71e))
- **view:** resolve layout error for rtl languages ([4f6be9e](https://github.com/sumcumo/vue-datepicker/commit/4f6be9e19fe742ad9d8391e2c4f1affb696c6184))

## [1.0.0](https://github.com/sumcumo/vue-states/releases/tag/v1.0.0) (2019-08-16)

### Bug Fixes

- **project:** use umd file format for languages
- **input:** resolve wrong date model for typeable
- **project:** remove not used event listener
- **picker:** resolve issues with incorrect time
- **picker:** highlight dates without time

### Features

- **project:** adjust coding style to company styles
- **project:** add standard-version
- **project:** update dependencies
- **project:** use disable utils
- **project:** extract css in own file (Breaking-change)
- **picker:** add auto-alignment
- **picker:** add fixed picker position
- **picker:** add show-header prop to hide the header if necessary
- **picker:** add tabIndex
- **picker:** use kebab-case event names (Breaking-change)
- **slot:** add footer slot
- **slot:** customize picker header icons
- **slot:** add before dateInput
- **languages:** add new languages
- **doc:** use vuepress for documentation and demo site
