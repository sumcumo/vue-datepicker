# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [5.0.0](https://github.com/sumcumo/vue-datepicker/compare/v4.0.0...v5.0.0) (2023-05-06)


### Features

* **dateinput:** Emit `typed-date` event on keyup ([c14e718](https://github.com/sumcumo/vue-datepicker/commit/c14e71816f0d473d835e32eba5319a8c5224a223))
* **dateinput:** Remove deprecated icon props ([19f3dda](https://github.com/sumcumo/vue-datepicker/commit/19f3dda34ea132f5b3ba5c4f411d35bd87b96203))
* **dateinput:** Update typedDate when selectedDate changes ([9d227db](https://github.com/sumcumo/vue-datepicker/commit/9d227db62aa27b3a3138772ab8775b143ce31128))
* **datepicker:** Apply highlighted-start and -end to ranges ([1f6771f](https://github.com/sumcumo/vue-datepicker/commit/1f6771f6d7895e3e4f667ad1c67fe7dc260b2a32))
* **datepicker:** Don't select date on `typed-date` event ([fe7b189](https://github.com/sumcumo/vue-datepicker/commit/fe7b189dc51dfb8245d0de4b3cb1a5a6ba34c706))
* **datepicker:** Emit a `changed` event ([0e8712a](https://github.com/sumcumo/vue-datepicker/commit/0e8712a7439de2b10acd49fce6e8cbc70e45bdc2))
* **datepicker:** Emit input event on valid typedDate ([3ac6d5b](https://github.com/sumcumo/vue-datepicker/commit/3ac6d5bcf0fac3821c4ce93501a33c9b6fc983af))
* **datepicker:** Exclude non-tabbable slot elements from focus trap ([bedc3b8](https://github.com/sumcumo/vue-datepicker/commit/bedc3b8f273ba0ace5d382ae0114dc3b74a815ba))
* **datepicker:** Exclude non-tabbable slot elements from focus trap ([bf63a79](https://github.com/sumcumo/vue-datepicker/commit/bf63a798e843ac9421f66e0d292f711b49e8bcc4))
* **datepicker:** Handle scroll direction on typed-date ([889c4e9](https://github.com/sumcumo/vue-datepicker/commit/889c4e96ac9edd589979eed62f4c0e993e426b25))
* **datepicker:** Keep track of `latestValidTypedDate` ([a39a97c](https://github.com/sumcumo/vue-datepicker/commit/a39a97c7b1d35d405ee6dfe2b40dcc2b4aab7880))
* **datepicker:** Let invalid `open-date` default to today ([5c9fdf6](https://github.com/sumcumo/vue-datepicker/commit/5c9fdf6ed39409e30a04b20c71e04bf9fbd04005))
* **datepicker:** Make `focus` & `blur` events refer to entire datepicker ([1ea96fe](https://github.com/sumcumo/vue-datepicker/commit/1ea96fee96713affc3e42da70cd0e557221c21c8))
* **datepicker:** Select a date on pressing enter ([26ea7a1](https://github.com/sumcumo/vue-datepicker/commit/26ea7a11ce941007f0f69443935410ecb172a6b8))
* **datepicker:** Select a typed date on losing focus ([850006b](https://github.com/sumcumo/vue-datepicker/commit/850006be5f196db0af72a636aa90932b38705ebf))
* **datepicker:** Set `pageDate` when `latestValidTypedDate` changes ([7596aac](https://github.com/sumcumo/vue-datepicker/commit/7596aac04dc21d4fff79192f558d73b1df938149))
* **datepicker:** Watch for changes to `disabled-dates` ([3455f25](https://github.com/sumcumo/vue-datepicker/commit/3455f258e5b1fa1e76d374dffb462182a2b50ab8))
* **datepicker:** Watch for whether `value` date is disabled ([cbdde98](https://github.com/sumcumo/vue-datepicker/commit/cbdde98dd34ebacca73110d161245ff99a06f8ba))
* **demo:** Add a slots example to the demo page ([9c4d603](https://github.com/sumcumo/vue-datepicker/commit/9c4d60335681ab874e5a08181cfaf2c867f69116))
* **demo:** Add date-fns example ([1490a4f](https://github.com/sumcumo/vue-datepicker/commit/1490a4f0d259958432e7c3068a664669ad121240))
* **navMixin:** Update `tabbableCell` with `latestValidTypedDate` ([3478953](https://github.com/sumcumo/vue-datepicker/commit/34789539b0307b6a66bce090cacdd81a48145ce0))
* **project:** Update deps ([#167](https://github.com/sumcumo/vue-datepicker/issues/167)) ([a5fc7a2](https://github.com/sumcumo/vue-datepicker/commit/a5fc7a28775a996d3bfaf2ef0506883cc6a9b62c))
* **utils:** Extend `compareDates` method to allow nulls ([50b2a3d](https://github.com/sumcumo/vue-datepicker/commit/50b2a3da1eed13635eac1a6ba3c9caa0a9d2dc06))


### Bug Fixes

* **dateinput:** Display initial value of `typeable` calendar ([cc0acdf](https://github.com/sumcumo/vue-datepicker/commit/cc0acdf80dbe56fa5a16454ba657b1ca46551245))
* **dateinput:** Don't fire typed-date event on escape ([3b20fa4](https://github.com/sumcumo/vue-datepicker/commit/3b20fa4f16e988f0cd308d5035d7a5fb4cc61709))
* **dateinput:** Ignore keyup on Ctrl key ([90f1f41](https://github.com/sumcumo/vue-datepicker/commit/90f1f416c1d24ebe3ff58cf9c00be065de2a30f7))
* **datepicker:** `parseValue` method must return a date or null ([64460f2](https://github.com/sumcumo/vue-datepicker/commit/64460f2d751d1c3ba8e66f82c108fd233616c11c))
* **datepicker:** Allow multiple highlighted ranges ([81165c4](https://github.com/sumcumo/vue-datepicker/commit/81165c47237efcc67622378f2fa0733d14cb9d06))
* **datepicker:** Close on selecting date when `show-calendar-on-focus` and `typeable` are true ([91b035c](https://github.com/sumcumo/vue-datepicker/commit/91b035c5a777aefad6aa22c64ba5238e8b9042af))
* **datepicker:** Close on selecting date when `show-calendar-on-focus` and `typeable` are true ([556d2b3](https://github.com/sumcumo/vue-datepicker/commit/556d2b3ba283748abf7124ffe4e594b448b77ae7))
* **datepicker:** Don't emit `input` if `value` date is disabled ([dd9dd89](https://github.com/sumcumo/vue-datepicker/commit/dd9dd895193d654ecc26ca52e3d07aad705709a2))
* **datepicker:** JSDoc for setValue method ([a2c71fc](https://github.com/sumcumo/vue-datepicker/commit/a2c71fc664d0641f4834039ffa3d00d9342b0d91))
* **datepicker:** Keyboard navigation for web-components ([5a7be1e](https://github.com/sumcumo/vue-datepicker/commit/5a7be1e4a975535242a0826a0a0549db28358498))
* **datepicker:** Make highlighted to/from work like disabled-dates ([f801b8b](https://github.com/sumcumo/vue-datepicker/commit/f801b8bc484120c3beb783588283f6a481cfcefb))
* **datepicker:** One datepicker open at a time ([b4544d6](https://github.com/sumcumo/vue-datepicker/commit/b4544d6d345e350ea1d515edd729c3f72c86e209))
* **datepicker:** Only focus-trap buttons in `PickerHeader()` ([fc17a15](https://github.com/sumcumo/vue-datepicker/commit/fc17a15ef2627ca274dfb80a80a5f7ac47fca386))
* **datepicker:** Only focus-trap input field in `DateInput` ([2931c7b](https://github.com/sumcumo/vue-datepicker/commit/2931c7b87eaa42f93cc89247a1783c2dc612bee0))
* **datepicker:** Param for `selectTypedDate()` may be null, but not undefined ([5aefbfd](https://github.com/sumcumo/vue-datepicker/commit/5aefbfd2b4e6c6bfffa8d1bb04a2bac9a2d6a6cd))
* **datepicker:** Remove hours/minutes/(milli)seconds from pageDate ([abe95e5](https://github.com/sumcumo/vue-datepicker/commit/abe95e55a141a1cea573d5285678e771347db4e5))
* **datepicker:** Set `pageDate` to January for `year` view ([57520b4](https://github.com/sumcumo/vue-datepicker/commit/57520b4f0f955cd9735183a1a20916f393f9c33e))
* **datepicker:** Set initial value of `latestValidTypedDate` to `computedOpenDate` ([#161](https://github.com/sumcumo/vue-datepicker/issues/161)) ([f933715](https://github.com/sumcumo/vue-datepicker/commit/f9337157991fefb2129f8829bd10db4636270e21))
* **dateutils:** Require `format` function when using custom `parser` ([a1b70d2](https://github.com/sumcumo/vue-datepicker/commit/a1b70d2f126dcabb8b57b60820ede83f16eded5c))
* **dateutils:** Use 3rd party parser if provided ([963571b](https://github.com/sumcumo/vue-datepicker/commit/963571bf1341cf9a10fe92c7ec68063298ca1b6d))
* **dateutils:** Use correct UTC year when parsing dates ([1200975](https://github.com/sumcumo/vue-datepicker/commit/1200975f2963b7b126aec9c8e60284a4c425bb76))
* **demo:** Remove append-to-body ([514cfd0](https://github.com/sumcumo/vue-datepicker/commit/514cfd00576c6422bdb9d2139ba766f5fe0dba68))
* **demo:** Remove nbsp; ([aa7d6cc](https://github.com/sumcumo/vue-datepicker/commit/aa7d6ccecc22d617c19cadaf989cc1ff80603c0e))
* **demo:** Remove v-model from format datepicker ([3c46603](https://github.com/sumcumo/vue-datepicker/commit/3c466030df9c7bd82943f38e1af7466897686c2d))
* **pickerday:** Fix bug in `isPreviousDisabled` / `isNextDisabled` ([a9c9394](https://github.com/sumcumo/vue-datepicker/commit/a9c939475b16b927abb9585925ae4f4f07716c9d))
* **pickers:** Fix UTC issue with `isToday` flag ([662db4c](https://github.com/sumcumo/vue-datepicker/commit/662db4c05e0436317febac20737151356f1fbd33))
* **pickers:** Use a method, not computed prop, for today's date ([4206775](https://github.com/sumcumo/vue-datepicker/commit/42067758904a7f015b54a1167f283afcd3fc9cb0))
* **typeable:** Do emit `input` when `typedDate` is selected ([15335f7](https://github.com/sumcumo/vue-datepicker/commit/15335f7c6871dd1e0d24b663afc75b57c4d1ca45))
* **typeable:** Do not emit `input` when `typedDate` changes ([b558cf4](https://github.com/sumcumo/vue-datepicker/commit/b558cf4417f6c6508636b804028411400da74f4f))
* **typeable:** Set correct initial value of `latestValidTypedDate` ([054b0fe](https://github.com/sumcumo/vue-datepicker/commit/054b0fedb05ec279fb3b1a5ee2e397aceb4f5544))

## [4.0.0](https://github.com/sumcumo/vue-datepicker/compare/v3.2.3...v4.0.0) (2022-02-25)


### Features

* **datepicker:** Add keyboard support
* **datepicker:** add e2e tests
* **pickers:** Add slide transition on page change ([618e3d3](https://github.com/sumcumo/vue-datepicker/commit/618e3d39f90a893ada1677d4050ce70b0e5ad7dc))
* **datepicker:** Add transition on toggle ([aa6a95c](https://github.com/sumcumo/vue-datepicker/commit/aa6a95cd3a466de925d0f46e65352c9b295677f1))
* **datepicker:** Add transition on view change ([db98efb](https://github.com/sumcumo/vue-datepicker/commit/db98efbf4181a6414102c0956e8764fd075a209a))
* *css* renamed inline to vdp-datepicker__calendar--inline ([41c081](https://github.com/sumcumo/vue-datepicker/pull/96/commits/41c081a334cddce6a091576ab9ddfb1d5fc977b1))

### Bug Fixes
* **dateinput:** Don't fire `handleKeyup` unless typeable ([5e0a7c1](https://github.com/sumcumo/vue-datepicker/commit/5e0a7c103ff047f8881fdd22769c63cbab313e93))
* **datepicker:** Set typed date to null if zero length ([e483f0d](https://github.com/sumcumo/vue-datepicker/commit/e483f0df3cf2fc5f04ffc28f7184fff21e4346cc))
* **datepicker:** Update openDate with selectedDate ([a23d494](https://github.com/sumcumo/vue-datepicker/commit/a23d494ccae646e7f0403d7d52c7cea1e8de34be))
* **pickerday:** Only highlight selected edge date if shown ([f30b53f](https://github.com/sumcumo/vue-datepicker/commit/f30b53f70a8485b6dfc3f601db18bcfa97b0592b))
* **pickerday:** Only highlight today if edge dates shown ([e3eece1](https://github.com/sumcumo/vue-datepicker/commit/e3eece1885981214a0d22384a2c672be2883ac07))
* **pickerheader:** Prevent click on prev/next when disabled ([e52bb06](https://github.com/sumcumo/vue-datepicker/commit/e52bb064566d0dcd68016439071fbdef9e5ff600))
* **pickerheader:** Reorder prev/next buttons when rtl ([d4ab12c](https://github.com/sumcumo/vue-datepicker/commit/d4ab12c28a47fe39d9a1acdb1f55a8f265967bae))
* **pickerheader:** Stop disabled dates from closing calendar on next/prev ([d61647c](https://github.com/sumcumo/vue-datepicker/commit/d61647ce2cb6a3fd059ace1ecde55cfd6644a111))
* **pickeryear:** Emphasize the current year ([fbb29f6](https://github.com/sumcumo/vue-datepicker/commit/fbb29f63ab45ba5bac61bc2e5d6d9aeeaf037af8))
* **pickeryear:** Right position trailing cells ([e159622](https://github.com/sumcumo/vue-datepicker/commit/e1596223ee9c0f1e3d14d316aa83d17b94f70119))
* **style:** Inherit correct calendar width ([#116](https://github.com/sumcumo/vue-datepicker/issues/116)) ([021d4e6](https://github.com/sumcumo/vue-datepicker/commit/021d4e6d17fbf0eee24f075024d700fab6d274fb))
* **style:** Make focus outline pixel perfect ([9fc2a53](https://github.com/sumcumo/vue-datepicker/commit/9fc2a539002bbf804c431fa382a3a614eb6e74b0))

### [3.2.3](https://github.com/sumcumo/vue-datepicker/compare/v3.2.1...v3.2.3) (2021-08-04)


### Bug Fixes

* **project:** failed the release for 3.2.2 which has much more changes and breaking changes in it. This is a rerelease with only the correct change from 3.2.2

### [3.2.2](https://github.com/sumcumo/vue-datepicker/compare/v3.2.1...v3.2.2) (2021-07-29)


### Bug Fixes

* **style:** resolve styles in production ([84dc2af](https://github.com/sumcumo/vue-datepicker/commit/84dc2af1e26315ec5e5436c0d0103f8149d35a07))

### [3.2.1](https://github.com/sumcumo/vue-datepicker/compare/v3.2.0...v3.2.1) (2021-05-25)


### Bug Fixes

* **project:** make the commonjs bundle build correct again ([#99](https://github.com/sumcumo/vue-datepicker/issues/99)) ([677228d](https://github.com/sumcumo/vue-datepicker/commit/677228dac944c58c22fc682f33f3251cba2cfaeb))

## [3.2.0](https://github.com/sumcumo/vue-datepicker/compare/v3.1.0...v3.2.0) (2021-05-11)


### Features

* **picker-day:** add dayCelltContent slot ([#95](https://github.com/sumcumo/vue-datepicker/issues/95)) ([6e7c86f](https://github.com/sumcumo/vue-datepicker/commit/6e7c86ff1a9762c51a30d5a5547adf1eb0a2bd7e))


### Bug Fixes

* **datepicker:** reset typeable date ([#79](https://github.com/sumcumo/vue-datepicker/issues/79)) ([b828dfd](https://github.com/sumcumo/vue-datepicker/commit/b828dfd03da6348464e1d8f909909a5d81eda2e5))

## [3.1.0](https://github.com/sumcumo/vue-datepicker/compare/v3.0.1...v3.1.0) (2021-02-08)


### Features

* **input:** Add slot for calendar icons ([#75](https://github.com/sumcumo/vue-datepicker/issues/75)) ([6b9600a](https://github.com/sumcumo/vue-datepicker/commit/6b9600ad8e9c650a0980d34bbd21459072dc92b4))
* **style:** highlight today ([e45b92d](https://github.com/sumcumo/vue-datepicker/commit/e45b92d2684ffd945556d38e0a42aa222b66ae96))


### Bug Fixes

* **disableddates:** resolve all years are disabled for `from` ([252602b](https://github.com/sumcumo/vue-datepicker/commit/252602b5182632fa1a1419f4625b4b8cd4704539))
* **input:** resolve flicker on showCalendarByFocus ([#82](https://github.com/sumcumo/vue-datepicker/issues/82)) ([e10daab](https://github.com/sumcumo/vue-datepicker/commit/e10daab72cb6dcadcf72a721dcea8be9f2d89b22))

### [3.0.1](https://github.com/sumcumo/vue-datepicker/compare/v3.0.0...v3.0.1) (2021-01-18)


### Bug Fixes

* **dateutils:** issue with typeable date on dayless format ([3a69f2e](https://github.com/sumcumo/vue-datepicker/commit/3a69f2ea4ffddef1eaf3f617cf1b048ae84754dd))
* **picker:** isseu with default date in disabled range ([01a947d](https://github.com/sumcumo/vue-datepicker/commit/01a947d7cb5c5490ee6e0ed008c6ca11d63eecdb))

## [3.0.0](https://github.com/sumcumo/vue-datepicker/compare/v2.1.2...v3.0.0) (2020-12-16)

### Breaking Changes

* Checkout the [Migration Guide](https://sumcumo.github.io/vue-datepicker/guide/Migration/#_2-x-x-to-3-x-x)

### Features

* **dateinput:** format typeable inputs on blur ([#44](https://github.com/sumcumo/vue-datepicker/issues/44)) ([53f1e8f](https://github.com/sumcumo/vue-datepicker/commit/53f1e8fb9b429134e35676a01eabaf2bcfe667f8))
* **datepicker:** Add prop to append calendar to body ([#37](https://github.com/sumcumo/vue-datepicker/issues/37)) ([ca8d021](https://github.com/sumcumo/vue-datepicker/commit/ca8d0210522c06903c9f7c5ea3792403e5f1fec3))
* **datepicker:** Add prop to determine first-day-of-week ([#41](https://github.com/sumcumo/vue-datepicker/issues/41)) ([78abc56](https://github.com/sumcumo/vue-datepicker/commit/78abc562615eebac365d93c62be2175245b804f8))
* **picker:** Replace blank days with dates from previous / next months ([#46](https://github.com/sumcumo/vue-datepicker/issues/46)) ([b14b611](https://github.com/sumcumo/vue-datepicker/commit/b14b611b506665b67dfd85c3f258869256abd969))
* **pickeryear:** add yearPickerRange prop ([fe5d305](https://github.com/sumcumo/vue-datepicker/commit/fe5d305146f2cb98c7d985a1259104a32a0e9623))


### Bug Fixes

* **picker:** Make highlighted disabled text blue ([#62](https://github.com/sumcumo/vue-datepicker/issues/62)) ([feb32b1](https://github.com/sumcumo/vue-datepicker/commit/feb32b1f7932a466768f44c80148dedb8b6d2525))
* **picker:** Next decade button is disabled ([#52](https://github.com/sumcumo/vue-datepicker/issues/52)) ([ea6e793](https://github.com/sumcumo/vue-datepicker/commit/ea6e7939b6dcf08af781feb8bb64e63609f53a31))
* **picker:** Style/tweak stylesheet colours ([#47](https://github.com/sumcumo/vue-datepicker/issues/47)) ([78f331e](https://github.com/sumcumo/vue-datepicker/commit/78f331e95909ef4ad8703ff087af7468bcc986b9))

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
