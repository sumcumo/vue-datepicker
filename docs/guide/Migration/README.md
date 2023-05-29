# Migration

## 4.x.x to 5.x.x

- the `selected` event has been deprecated in favour of `input`. You should therefore listen to `input` events on the datepicker, or simply bind your date via v-model: `<DatePicker v-model="myDate" />`
- a `typeable` datepicker no longer selects the date each time the input string can be parsed to a date. Instead, a typed date is only selected - and an `input` event fired - when the input field is focused and the `enter` key is pressed, or when the datepicker loses focus entirely.
- a new `changed` event is emitted whenever the selected date deviates from its previous value.
- the `focus` and `blur` events now refer to the whole datepicker, not just the input field.
- the `disabled-dates` prop is now watched for changes with the value of any selected date being nullified if that date is disabled.
- the previously deprecated `calendar-button-icon`, `calendar-button-icon-content` and `clear-button-icon` props have been removed. Use [slots](../Slots/README.md) instead.

## 3.x.x to 4.x.x

- the html changed due to the new keyboard support. If you have any custom css it might break.
- an additional transition element was wrapped around the picker
- inline css class changed from `inline` to `vdp-datepicker__calendar--inline` to avoid any conflict with css class libraries

## 2.x.x to 3.x.x

- removed `monday-first` in favor of `first-day-of-week`. If you had `<DatePicker :monday-first="true"/>` you need to change it to `<DatePicker first-day-of-week="mon"/>`
- The build process was redone. The filenames inside the dist folder changed from `vuejs-datepicker.js` to `Datepicker.js`. Same goes with the css file.
  The umd and cjs build are now going through babel and will include needed polyfills automatically while the esm build is free of any polyfills.
  Same with the locale files which now have a esm and cjs build, too.

## From `vuejs-datepicker 1.6.2` to `@sum.cumo/vue-datepicker 2.x.x`

This is a fork from the project [vuejs-datepicker](https://github.com/charliekassel/vuejs-datepicker) with some changes.
To migrate from `vuejs-datepicker 1.6.2` to `@sum.cumo/vue-datepicker 2.x.x` there are only a few breaking changes that you need to consider:

1. Events are changed to be always `kebab-case`.
2. The CSS is extracted to its own file. You can check it out in the [documentation](https://sumcumo.github.io/vue-datepicker/guide/#usage).
3. The custom formatter now requires a custom parser. An example is in the [documentation](https://sumcumo.github.io/vue-datepicker/guide/DateFormatting/#function-formatter).
   If you are using a third party library to format the dates like date-fns this is just as easy as adding the custom formatter function.
4. The default formatter had undergone some changes

- su -> o for st, rd, nd, th additions
- D -> E for the day of the week

The rest should be the same. Checkout the [changelog](https://github.com/sumcumo/vue-datepicker/blob/master/CHANGELOG.md) for all other changes.
