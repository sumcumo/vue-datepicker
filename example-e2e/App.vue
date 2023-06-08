<template>
  <div>
    <div class="heading">
      <h1>Datepicker Integration Tests</h1>
      <DarkModeButton
        v-model="isDark"
        @click="toggleDarkMode"
      />
    </div>
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
        :dark="isDark"
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
    </div>
  </div>
</template>

<script>
import * as lang from '~/locale/index'
import DatePicker from '~/components/DatePicker.vue'
import DarkModeButton from '../example/DarkModeButton.vue'

export default {
  name: 'App',
  components: {
    DatePicker,
    DarkModeButton,
  },
  data() {
    return {
      languages: lang,
      isDark: true,
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
  methods: {
    toggleDarkMode() {
      this.isDark = !this.isDark
      if (this.isDark) {
        document.documentElement.style.setProperty('--theme', 'dark')
        document.documentElement.classList.add('dark')
        return
      }

      document.documentElement.style.setProperty('--theme', 'light')
      document.documentElement.classList.remove('dark')
    },
  },
}
</script>

<style lang="scss">
@import url('https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css');

:root {
  --theme: 'dark';
  color-scheme: var(--theme);

  --vdp-bg-dark: #f9f9f9;
  --vdp-bg-darker: #eee;
  --vdp-bg-darkest: #ddd;
  --vdp-border-darker: #ddd;
  --vdp-border-darkest: #bbb;
  --vdp-slot-link: #176982;
  --vdp-text-code: #e83e8c;
}

html.dark {
  --vdp-bg-dark: #191919;
  --vdp-bg-darker: #222;
  --vdp-bg-darkest: #333;
  --vdp-border-darker: #333;
  --vdp-border-darkest: #444;
  --vdp-slot-link: #4bd;
  --vdp-text-code: #ed65a3;
}

body {
  background: var(--vdp-bg);
  color: var(--vdp--text);
  font-family: 'Helvetica Neue Light', Helvetica, sans-serif;
  padding: 1em 2em 2em;
}

.heading {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 2em;
}

input,
select {
  background-color: var(--vdp-bg);
  border: 1px solid var(--vdp-border);
  padding: 0.75em 0.5em;
  width: 100%;
}

h3 {
  margin-bottom: 0.5em;
}

.example {
  background: var(--vdp-bg-dark);
  border: 1px solid var(--vdp-border);
  padding: 1em;
  margin-bottom: 2em;
}

.slot {
  background-color: var(--vdp-cell-highlighted-bg);
  padding: 0.5em;

  > a {
    color: var(--vdp-slot-link);
    border-radius: 0.1em;
    padding: 0.1em;
  }
}

.settings {
  background: var(--vdp-bg-darker);
  border: 1px solid var(--vdp-border-darker);
  border-radius: 0.5em;
  margin: 1em 0;
  padding: 1em;

  h5 {
    font-size: 100%;
    margin-bottom: 1em;
  }
}

.form-group label {
  display: block;
  font-size: 80%;
  margin-bottom: 0.5em;
}

code,
pre {
  background: var(--vdp-bg-darkest);
  border: 1px solid var(--vdp-border-darkest);
  border-radius: 0.5em;
  color: var(--vdp-text-code);
  display: block;
  margin: 1em 0;
  padding: 1em;
}

.overflow-scroll {
  overflow: scroll;
}
</style>
