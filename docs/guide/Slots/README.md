# Slots

Slots will help you customize content.

## beforeCalendarHeader

Sometimes you need to show custom content before the calendar header. For such cases you can use the named slot `beforeCalendarHeader`, `beforeCalendarHeaderDay`, `beforeCalendarHeaderMonth` or `beforeCalendarHeaderYear`.

An example would be to use bootstrap's `input-group-prepend` and `input-group-append`
to show some custom text:

```html
<DatePicker :bootstrap-styling="true">
  <div slot="beforeCalendarHeaderDay" class="calendar-header">
    Choose a Date
  </div>
</DatePicker>
```

## calendarFooter

Sometimes you need to show a calendar footer. For such cases you can use the named slot `calendarFooter`,`calendarFooterDay`, `calendarFooterMonth` or `calendarFooterYear`.

An example would be to use bootstrap's `input-group-prepend` and `input-group-append`
to show some custom text:

```html
<DatePicker :bootstrap-styling="true">
  <div slot="calendarFooterMonth">
    <button>Select all Months</button>
  </div>
</DatePicker>
```

## afterDateInput

To implement some custom styling (for instance to add an animated placeholder) on DateInput, you might need to add elements as DateInput siblings. Slot named
`afterDateInput` allows you to do that:

```html
<DatePicker>
  <span slot="afterDateInput" class="animated-placeholder">Choose a Date</span>
</DatePicker>
```

## beforeDateInput

To implement some custom styling (for instance to add an custom icon) on DateInput. Slot named `beforeDateInput`
allows you to do that:

```html
<DatePicker>
  <span slot="beforeDateInput">
    <CustomIcon />
  </span>
</DatePicker>
```

## prevIntervalBtn / nextIntervalBtn

To provide custom content for buttons that rotate intervals in calendar header `prevIntervalBtn` and `nextIntervalBtn` slots may be used:

```html
<DatePicker>
  <span slot="prevIntervalBtn">
    <CustomIcon />
  </span>
  <span slot="nextIntervalBtn">
    <CustomIcon />
  </span>
</DatePicker>
```
