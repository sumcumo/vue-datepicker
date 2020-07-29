# Migration

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
