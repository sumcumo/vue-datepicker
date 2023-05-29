# Local Dates vs UTC Dates

As you are no doubt aware, all dates in JavaScript are held as an object which
contains a number that represents the number of milliseconds since **midnight
of 1<sup>st</sup> January 1970 UTC**.

By default, when you select a date, the datepicker emits a **local date** i.e.
a JavaScript object that represents the date at midnight **in the browser's
local timezone**. So, for example, depending on whether you're on daylight saving
time, if you're in central Europe, this may be one or two hours before UTC and
if you're in New York, this may be four or five hours after UTC.

::: tip NOTE
If you want the datepicker to emit a UTC date, you may set the `use-utc` prop to `true`:

```vue
<DatePicker :use-utc="true" />
```

:::

## Be consistent

If you are using local dates, be sure that any dates you _input_ into the datepicker
via the `value`, `open-date`, `disabled-dates`, or `highlighted`
[props](../Props/README.md) are also local dates. Likewise, if you are using UTC
dates, be sure to enter these values as UTC dates.

### Local dates

One way to create a local date in JavaScript is to use the
`new Date(year, monthIndex, day)` format:

```vue
<DatePicker :value="new Date(2000, 0, 1)" />
```

### UTC dates

To create a UTC date, you may use the `new Date('yyyy-mm-dd')` format:

```vue
<DatePicker :value="new Date('2000-01-01')" />
```

You may read more about the various ways in which you can
[instantiate a JavaScript date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date) here.
