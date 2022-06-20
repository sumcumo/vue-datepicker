# Slots

Slots will help you customize content.<br>

N.B. If your slot content contains any links, you'll need to add `tabindex="0"` to your `a` tags in order for the links to be tabbable:
```html
<DatePicker>
  <template #beforeCalendarHeaderDay>
    <div>
      You must add tabindex="0" to <a href="#" tabindex="0">this link</a>
      so that users can tab to it.
    </div>
  </template>
</DatePicker>
```

## beforeCalendarHeader

Sometimes you need to show custom content before the calendar header. For such cases you can use the named slot `beforeCalendarHeader`, `beforeCalendarHeaderDay`, `beforeCalendarHeaderMonth` or `beforeCalendarHeaderYear`.

An example would be to use bootstrap's `input-group-prepend` and `input-group-append`
to show some custom text:

```html
<DatePicker :bootstrap-styling="true">
  <template #beforeCalendarHeaderDay>
    <div class="calendar-header">Choose a Date</div>
  </template>
</DatePicker>
```

## calendarFooter

Sometimes you need to show a calendar footer. For such cases you can use the named slot `calendarFooter`,`calendarFooterDay`, `calendarFooterMonth` or `calendarFooterYear`.

An example would be to use bootstrap's `input-group-prepend` and `input-group-append`
to show some custom text:

```html
<DatePicker :bootstrap-styling="true">
  <template #calendarFooterMonth>
    <div>
      <button>Select all Months</button>
    </div>
  </template>
</DatePicker>
```

## afterDateInput

To implement some custom styling (for instance to add an animated placeholder) on DateInput, you might need to add elements as DateInput siblings. Slot named
`afterDateInput` allows you to do that:

```html
<DatePicker>
  <template #afterDateInput>
    <span class="animated-placeholder">Choose a Date</span>
  </template>
</DatePicker>
```

## beforeDateInput

To implement some custom styling (for instance to add an custom icon) on DateInput. Slot named `beforeDateInput`
allows you to do that:

```html
<DatePicker>
  <template #beforeDateInput>
    <CustomIcon />
  </template>
</DatePicker>
```

## prevIntervalBtn / nextIntervalBtn

To provide custom content for buttons that rotate intervals in calendar header `prevIntervalBtn` and `nextIntervalBtn` slots may be used:

```html
<DatePicker>
  <template #prevIntervalBtn>
    <CustomIcon />
  </template>
  <template #nextIntervalBtn>
    <CustomIcon />
  </template>
</DatePicker>
```

## calendarBtn

To provide custom content for the calendar button, the `calendarBtn` slot may be used:

```html
<DatePicker :calendar-button="true">
  <template #calendarBtn>
    <CustomIcon />
  </template>
</DatePicker>
```

## clearBtn

To provide custom content for the clear button, the `clearBtn` slot may be used:

```html
<DatePicker :clear-button="true">
  <template #clearBtn>
    <CustomIcon />
  </template>
</DatePicker>
```


## dayCellContent

To provide custom content for the dayCellContent, the `dayCellContent` slot may be used:

```html
<DatePicker :clear-button="true">
  <template #dayCellContent="{ cell }">
    <span>{{ cell.date }}</span>
  </template>
</DatePicker>
```
