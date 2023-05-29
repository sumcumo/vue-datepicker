<template>
  <div>
    <h1>Datepicker Integration Tests</h1>
    <div class="example">
      <h3>Default datepicker...</h3>
      <DatePicker
        :id="id"
        :append-to-body="appendToBody"
        :autofocus="autofocus"
        :bootstrap-styling="bootstrapStyling"
        :calendar-button="calendarButton"
        :calendar-class="calendarClass"
        :clear-button="clearButton"
        :day-cell-content="dayCellContent"
        :disabled="disabled"
        :disabled-dates="disabledDates"
        :first-day-of-week="firstDayOfWeek"
        :fixed-position="fixedPosition"
        :format="format"
        :full-month-name="fullMonthName"
        :initial-view="initialView"
        :inline="inline"
        :input-class="inputClass"
        :language="languages[language]"
        :maxlength="maxLength"
        :maximum-view="maximumView"
        :minimum-view="minimumView"
        :name="name"
        :open-date="openDate"
        :pattern="pattern"
        :placeholder="placeholder"
        :required="required"
        :ref-name="refName"
        :show-edge-dates="showEdgeDates"
        :show-header="showHeader"
        :show-calendar-on-focus="showCalendarOnFocus"
        :show-calendar-on-button-click="showCalendarOnButtonClick"
        :tabindex="tabindex"
        :typeable="typeable"
        :use-utc="useUtc"
        :model-value="modelValue"
        :wrapper-class="wrapperClass"
        :year-picker-range="yearPickerRange"
      />
      <code>
        &lt;datepicker placeholder="Select Date"&gt;&lt;/datepicker&gt;
      </code>
    </div>
  </div>
</template>

<script>
import * as lang from '~/locale/index'
import DatePicker from '~/components/DatePicker.vue'

export default {
  name: 'App',
  components: {
    DatePicker,
  },
  data() {
    return {
      languages: lang,
    }
  },
  computed: {
    appendToBody() {
      return this.$store.state.appendToBody
    },
    autofocus() {
      return this.$store.state.autofocus
    },
    bootstrapStyling() {
      return this.$store.state.bootstrapStyling
    },
    calendarButton() {
      return this.$store.state.calendarButton
    },
    calendarClass() {
      return this.$store.state.calendarClass
    },
    clearButton() {
      return this.$store.state.clearButton
    },
    dayCellContent() {
      return this.$store.state.dayCellContent
    },
    disabled() {
      return this.$store.state.disabled
    },
    disabledDates() {
      return this.$store.state.disabledDates
    },
    firstDayOfWeek() {
      return this.$store.state.firstDayOfWeek
    },
    fixedPosition() {
      return this.$store.state.fixedPosition
    },
    format() {
      return this.$store.state.format
    },
    fullMonthName() {
      return this.$store.state.fullMonthName
    },
    id() {
      return this.$store.state.id
    },
    initialView() {
      return this.$store.state.initialView
    },
    inline() {
      return this.$store.state.inline
    },
    inputClass() {
      return this.$store.state.inputClass
    },
    language() {
      return this.$store.state.language
    },
    maxLength() {
      return this.$store.state.maxLength
    },
    maximumView() {
      return this.$store.state.maximumView
    },
    minimumView() {
      return this.$store.state.minimumView
    },
    modelValue() {
      return this.$store.state.modelValue
    },
    name() {
      return this.$store.state.name
    },
    openDate() {
      return this.$store.state.openDate
    },
    pattern() {
      return this.$store.state.pattern
    },
    placeholder() {
      return this.$store.state.placeholder
    },
    required() {
      return this.$store.state.required
    },
    refName() {
      return this.$store.state.refName
    },
    showEdgeDates() {
      return this.$store.state.showEdgeDates
    },
    showHeader() {
      return this.$store.state.showHeader
    },
    showCalendarOnFocus() {
      return this.$store.state.showCalendarOnFocus
    },
    showCalendarOnButtonClick() {
      return this.$store.state.showCalendarOnButtonClick
    },
    tabindex() {
      return this.$store.state.tabindex
    },
    typeable() {
      return this.$store.state.typeable
    },
    useUtc() {
      return this.$store.state.useUtc
    },
    wrapperClass() {
      return this.$store.state.wrapperClass
    },
    yearPickerRange() {
      return this.$store.state.yearPickerRange
    },
  },
}
</script>

<style>
@import url('https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css');

body {
  font-family: 'Helvetica Neue Light', Helvetica, sans-serif;
  padding: 1em 2em 2em;
}

input,
select {
  padding: 0.75em 0.5em;
  font-size: 100%;
  border: 1px solid #ccc;
  width: 100%;
}

.example {
  background: #f2f2f2;
  border: 1px solid #ddd;
  padding: 0 1em 1em;
  margin-bottom: 2em;
}

code,
pre {
  margin: 1em 0;
  padding: 1em;
  border: 1px solid #bbb;
  display: block;
  background: #ddd;
  border-radius: 3px;
}

h5 {
  font-size: 100%;
  padding: 0;
}

h3 {
  margin-top: 20px;
}

.form-group label {
  font-size: 80%;
  display: block;
}
</style>
