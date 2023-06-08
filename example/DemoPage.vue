<template>
  <div>
    <div class="heading">
      <h1>Datepicker Examples</h1>
      <DarkModeButton
        v-model="isDark"
        @click="toggleDarkMode"
      />
    </div>
    <div class="example">
      <h3>Default datepicker...</h3>
      <DatePicker placeholder="Select Date" />
      <code>&lt;DatePicker /&gt;</code>
    </div>

    <div class="example">
      <h3>Custom first-day-of-week datepicker</h3>
      <DatePicker
        placeholder="Select date"
        first-day-of-week="mon"
      />
      <code>&lt;DatePicker first-day-of-week="mon" /&gt;</code>
    </div>

    <div class="example">
      <h3>Typeable datepicker</h3>
      <DatePicker
        placeholder="Type or select date"
        :typeable="true"
      />
      <code>&lt;DatePicker :typeable="true" /&gt;</code>
    </div>

    <div class="example">
      <h3>Only show dates from current month datepicker</h3>
      <DatePicker
        placeholder="Select date"
        :show-edge-dates="false"
      />
      <code>&lt;DatePicker :show-edge-dates="false" /&gt;</code>
    </div>

    <div class="example">
      <h3>Datepicker with slots</h3>
      <DatePicker placeholder="Select date">
        <template #beforeCalendarHeader>
          <div class="slot">
            Read all about:
            <a
              href="https://sumcumo.github.io/vue-datepicker/guide/Slots/"
              tabindex="0"
              target="_blank"
            >
              available slots
            </a>
          </div>
        </template>

        <template #calendarFooter>
          <div class="slot">
            They're very flexible. Here's that link again:
            <a
              href="https://sumcumo.github.io/vue-datepicker/guide/Slots/"
              tabindex="0"
              target="_blank"
            >
              available slots
            </a>
          </div>
        </template>
      </DatePicker>
      <pre>
&lt;DatePicker&gt;
  &lt;template #beforeCalendarHeader&gt;
    &lt;div&gt;
      Read all about: &lt;a href="https://sumcumo.github.io/vue-datepicker/guide/Slots/"
      tabindex="0"&gt;available slots&lt;/a&gt;
    &lt;/div&gt;
  &lt;/template&gt;

  &lt;template #calendarFooter&gt;
    &lt;div&gt;
      They're very flexible. Here's that link again:
      &lt;a href="https://sumcumo.github.io/vue-datepicker/guide/Slots/"
      tabindex="0"&gt;available slots&lt;/a&gt;
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/DatePicker&gt;
      </pre>
    </div>

    <div class="example">
      <h3>Bootstrap styled datepicker</h3>
      <DatePicker
        :bootstrap-styling="true"
        :calendar-button="true"
        :clear-button="true"
        placeholder="Select date"
      />
      <code>
        &lt;DatePicker :bootstrap-styling="true" :calendar-button="true"
        :clear-button="true" /&gt;
      </code>
    </div>

    <div class="example">
      <h3>v-model datepicker</h3>
      <DatePicker
        v-model="vModelExample"
        placeholder="Select date"
      />
      <code>
        &lt;datepicker placeholder="Select Date"
        v-model="vModelExample"&gt;&lt;/datepicker&gt;
      </code>
      <hr />
      <p>{{ vModelExample }}</p>
    </div>

    <div class="example overflow-scroll">
      <h3>Don't append datepicker to body</h3>
      <DatePicker placeholder="Select date" />
      <br />

      <h3>Append datepicker to body</h3>
      <DatePicker
        :append-to-body="true"
        placeholder="Select date"
      />
      <code>&lt;DatePicker :append-to-body="true" /&gt;</code>
    </div>

    <div class="example">
      <h3>Format datepicker</h3>
      <DatePicker
        :format="format"
        placeholder="Select date"
      />
      <code>&lt;DatePicker format="format" /&gt;</code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Format</label>
          <select v-model="format">
            <option value="MMMM d, yyyy">
              MMMM d, yyyy e.g. February 6, 2022
            </option>
            <option value="do MMM yyyy">do MMM yyyy e.g. 6th Feb 2022</option>
            <option value="yyyy-MM-dd">yyyy-MM-dd e.g. 2022-02-06</option>
            <option value="E do MMM yyyy">
              E do MMM yyyy e.g. Sun 6th Feb 2022
            </option>
            <option value="dd/MM/yy">dd/MM/yy e.g. 06/02/22</option>
            <option value="dd.MM.yyyy">dd.MM.yyyy e.g. 06.02.2022</option>
            <option value="M/d/yyyy">M/d/yyyy e.g. 2/6/2022</option>
          </select>
        </div>
      </div>
    </div>

    <div class="example">
      <h3>Format a date with the date-fns library</h3>
      <DatePicker
        v-model="state"
        :format="customFormatter"
      />
      <code>&lt;DatePicker :format="customFormatter" /&gt;</code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Format</label>
          <select v-model="formatDateFns">
            <option value="qqq yyyy">qqq yyyy e.g. Q1 2022</option>
            <option value="EEEE do MMMM yyyy">
              EEEE do MMMM yyyy e.g. Sunday 6th February 2022
            </option>
            <option value="MMMM d, yyyy">
              MMMM d, yyyy e.g. February 6, 2022
            </option>
            <option value="do MMM yyyy">do MMM yyyy e.g. 6th Feb 2022</option>
            <option value="yyyy-MM-dd">yyyy-MM-dd e.g. 2022-02-06</option>
            <option value="E do MMM yyyy">
              E do MMM yyyy e.g. Sun 6th Feb 2022
            </option>
            <option value="dd/MM/yy">dd/MM/yy e.g. 06/02/22</option>
            <option value="dd.MM.yyyy">dd.MM.yyyy e.g. 06.02.2022</option>
            <option value="M/d/yyyy">M/d/yyyy e.g. 2/6/2022</option>
          </select>
        </div>
      </div>
    </div>

    <div class="example">
      <h3>With minimum and maximum date range</h3>
      <DatePicker
        :disabled-dates="disabledDates"
        placeholder="Datepicker based on settings below..."
      />
      <code>&lt;DatePicker :disabled-dates="disabledDates" /&gt;</code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Disabled to:</label>
          <DatePicker
            placeholder="Select date"
            @selected="disableTo"
          />
        </div>
        <div class="form-group">
          <label>Disabled from:</label>
          <DatePicker
            placeholder="Select date"
            @selected="disableFrom"
          />
        </div>
        <div class="form-group">
          <label>Disabled Days of Month:</label>
          <input
            type="text"
            value=""
            placeholder="e.g. 5, 6, 12, 13"
            @change="setDisabledDays"
          />
        </div>
        <pre>disabledDates: {{ disabledDates }}</pre>
      </div>
    </div>

    <div class="example">
      <h3>Disabled dates</h3>
      <DatePicker
        :disabled-dates="disabledFn"
        placeholder="Datepicker based on settings below..."
      />
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Disabled Function:</label>
        </div>
        <pre
          >{{ disabledFnContent }}
        </pre>
      </div>
    </div>

    <div class="example">
      <h3>Highlighting Dates Matching Given Function</h3>
      <DatePicker
        :highlighted="highlightedFn"
        placeholder="Datepicker based on settings below..."
      />
      <code>&lt;DatePicker :highlighted="highlighted" /&gt;</code>
      <div class="settings">
        <h5>Settings</h5>
        <pre>
highlighted: {
  customPredictor: function (date) {
    // highlights every day of a month which is a multiple of 4
    return date.getDate() % 4 === 0
  }
}
        </pre>
      </div>
    </div>

    <div class="example">
      <h3>Highlighting Dates</h3>
      <DatePicker
        :highlighted="highlighted"
        placeholder="Datepicker based on settings below..."
      />
      <code>&lt;DatePicker :highlighted="highlighted" /&gt;</code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Highlight from:</label>
          <DatePicker
            placeholder="Select date"
            @selected="highlightFrom"
          />
        </div>
        <div class="form-group">
          <label>Highlight to:</label>
          <DatePicker
            placeholder="Select date"
            @selected="highlightTo"
          />
        </div>
        <div class="form-group">
          <label>Highlight Days of Month:</label>
          <input
            type="text"
            placeholder="e.g. 5, 6, 12, 13"
            @change="setHighlightedDays"
          />
        </div>
        <pre>highlighted: {{ highlighted }}</pre>
      </div>
    </div>

    <div class="example">
      <h3>With default open date</h3>
      <DatePicker
        :open-date="openDate"
        placeholder="Datepicker based on settings below..."
      />
      <code>&lt;DatePicker :open-date="{{ openDateFormatted }}" /&gt;</code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Open date:</label>
          <DatePicker v-model="openDate" />
        </div>
      </div>
    </div>

    <div class="example">
      <h3>Translations</h3>
      <h5>{{ languages[language].language }} datepicker</h5>

      <DatePicker
        :language="languages[language]"
        placeholder="Datepicker based on settings below..."
        format="d MMMM yyyy"
      />
      <code>&lt;DatePicker :language="languages.{{ language }}" /&gt;</code>
      <div class="settings">
        <h5>Settings</h5>
        <select v-model="language">
          <option
            v-for="(lang, key) in languages"
            :key="key"
            :value="key"
          >
            {{ lang.language }}
          </option>
        </select>
      </div>
    </div>

    <div class="example">
      <h3>Inline datepicker</h3>
      <DatePicker :inline="true" />
      <code>&lt;DatePicker :inline="true" /&gt;</code>
    </div>

    <div class="example">
      <h3>RTL datepicker</h3>
      <DatePicker
        :language="languages.he"
        placeholder="Select date"
      />
      <code>&lt;DatePicker :language="languages.he" /&gt;</code>
    </div>

    <div class="example">
      <h3>Day view only</h3>
      <DatePicker
        minimum-view="day"
        maximum-view="day"
        placeholder="Select date"
      />
      <code>&lt;DatePicker minimum-view="day" maximum-view="day" /&gt;</code>
    </div>

    <div class="example">
      <h3>Day view only RTL</h3>
      <DatePicker
        minimum-view="day"
        maximum-view="day"
        :language="languages.he"
        placeholder="Select date"
      />
      <code>
        &lt;DatePicker minimum-view="day" maximum-view="day"
        language="languages.he" /&gt;
      </code>
    </div>

    <div class="example">
      <h3>Month view only</h3>
      <DatePicker
        minimum-view="month"
        maximum-view="month"
        placeholder="Select date"
      />
      <code>
        &lt;DatePicker minimum-view="month" maximum-view="month" /&gt;
      </code>
    </div>

    <div class="example">
      <h3>Day and month view only</h3>
      <DatePicker
        minimum-view="day"
        maximum-view="month"
        initial-view="month"
        placeholder="Select date"
      />
      <code>
        &lt;DatePicker minimum-view="day" maximum-view="month"
        initial-view="month" /&gt;
      </code>
    </div>

    <div class="example">
      <h3>Year and month view only</h3>
      <DatePicker
        minimum-view="month"
        maximum-view="year"
        initial-view="year"
        placeholder="Select date"
      />
      <code>
        &lt;DatePicker minimum-view="month" maximum-view="year"
        initial-view="year" /&gt;
      </code>
    </div>

    <div class="example">
      <h3>Year picker range</h3>
      <DatePicker
        :year-picker-range="yearPickerRange"
        placeholder="Select date"
      />
      <code>&lt;DatePicker :year-picker-range="yearPickerRange" /&gt;</code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Year picker range:</label>
          <input
            v-model.number="yearPickerRange"
            type="number"
          />
        </div>
        <pre>yearPickerRange: {{ yearPickerRange }}</pre>
      </div>
    </div>

    <div class="example">
      <h3>Fixed positions</h3>
      <DatePicker
        :fixed-position="fixedPosition"
        placeholder="Select date"
      />
      <code>&lt;DatePicker :fixed-position="fixedPosition" /&gt;</code>
      <div class="settings">
        <h5>Settings</h5>
        <select v-model="fixedPosition">
          <option
            v-for="position in fixedPositions"
            :key="position"
            :value="position"
          >
            {{ position }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from '~/components/DatePicker.vue'
import { format, parse } from 'date-fns'
import * as lang from '~/locale/index'
import DarkModeButton from './DarkModeButton.vue'

export default {
  name: 'DemoPage',
  components: {
    DatePicker,
    DarkModeButton,
  },
  data() {
    return {
      disabledDates: {},
      disabledFn: {
        customPredictor(date) {
          const year = date.getFullYear()
          const month = date.getMonth()
          const day = date.getDate()
          // disable every year that is a multiple of 2
          if (year % 2 === 0) {
            return true
          }
          // disable every month that is a multiple of 3
          if (month % 3 === 0) {
            return true
          }
          // disable first half of the month when it is a multiple of 2
          return month % 2 !== 0 && day < 15
        },
      },
      disabledFnContent: `disabledDates: {
  customPredictor: function (date) {
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    // disable every year that is a multiple of 2
    if (year % 2 === 0) {
      return true
    }
    // disable every month that is a multiple of 3
    if (month % 3 === 0) {
      return true
    }
    // disable first half of the month when it is a multiple of 2
    return month % 2 !== 0 && day < 15
  }
}`,
      eventMsg: null,
      fixedPosition: 'bottom',
      fixedPositions: [
        'bottom',
        'bottom-left',
        'bottom-right',
        'top',
        'top-left',
        'top-right',
      ],
      format: 'MMMM d, yyyy',
      formatDateFns: 'MMMM d, yyyy',
      highlighted: {},
      highlightedFn: {
        customPredictor(date) {
          return date.getDate() % 4 === 0
        },
      },
      isDark: localStorage.theme === 'dark',
      language: 'en',
      languages: lang,
      openDate: null,
      state: new Date(),
      styleInput: null,
      vModelExample: null,
      yearPickerRange: 10,
    }
  },
  computed: {
    getInputStyle() {
      return this.styleInput
    },
    openDateFormatted() {
      if (!this.openDate) return ''
      return `new Date(${this.openDate.getFullYear()}, ${this.openDate.getMonth()}, ${this.openDate.getDate()})`
    },
  },
  methods: {
    customFormatter(date) {
      return format(date, this.formatDateFns)
    },
    customParser(date) {
      return parse(date, this.formatDateFns, new Date())
    },
    disableTo(val) {
      if (typeof this.disabledDates.to === 'undefined') {
        this.disabledDates = {
          to: null,
          daysOfMonth: this.disabledDates.daysOfMonth,
          from: this.disabledDates.from,
        }
      }
      this.disabledDates.to = val
    },
    disableFrom(val) {
      if (typeof this.disabledDates.from === 'undefined') {
        this.disabledDates = {
          to: this.disabledDates.to,
          daysOfMonth: this.disabledDates.daysOfMonth,
          from: null,
        }
      }
      this.disabledDates.from = val
    },
    highlightTo(val) {
      if (typeof this.highlighted.to === 'undefined') {
        this.highlighted = {
          to: null,
          daysOfMonth: this.highlighted.daysOfMonth,
          from: this.highlighted.from,
        }
      }
      this.highlighted.to = val
    },
    highlightFrom(val) {
      if (typeof this.highlighted.from === 'undefined') {
        this.highlighted = {
          to: this.highlighted.to,
          daysOfMonth: this.highlighted.daysOfMonth,
          from: null,
        }
      }
      this.highlighted.from = val
    },
    setDisabledDays(elem) {
      if (elem.target.value === 'undefined') {
        return
      }
      const disabledDays = elem.target.value
        .split(',')
        .map((day) => parseInt(day, 10))
      this.disabledDates = {
        from: this.disabledDates.from,
        to: this.disabledDates.to,
        daysOfMonth: disabledDays,
      }
    },
    setHighlightedDays(elem) {
      if (elem.target.value === 'undefined') {
        return
      }
      const highlightedDays = elem.target.value
        .split(',')
        .map((day) => parseInt(day, 10))
      this.highlighted = {
        from: this.highlighted.from,
        to: this.highlighted.to,
        daysOfMonth: highlightedDays,
      }
    },
    toggleDarkMode() {
      this.isDark = !this.isDark
      if (this.isDark) {
        document.documentElement.style.setProperty('--theme', 'dark')
        document.documentElement.classList.add('dark')
        localStorage.theme = 'dark'
        return
      }

      document.documentElement.style.setProperty('--theme', 'light')
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    },
  },
}
</script>

<style lang="scss">
@import url('https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css');

:root {
  --theme: 'light';
  color-scheme: var(--theme);

  --vdp-bg-dark: #f9f9f9;
  --vdp-bg-darker: #eee;
  --vdp-bg-darkest: #ddd;
  --vdp-border: #ddd;
  --vdp-border-darker: #ccc;
  --vdp-border-darkest: #bbb;
  --vdp-slot-link: #176982;
  --vdp-text-code: #e83e8c;
}

html.dark {
  --vdp-bg-dark: #191919;
  --vdp-bg-darker: #222;
  --vdp-bg-darkest: #333;
  --vdp-border: #222;
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

.example {
  background: var(--vdp-bg-dark);
  border: 1px solid var(--vdp-border);
  padding: 1em;
  margin-bottom: 2em;

  h3 {
    margin-bottom: 0.5em;
  }
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
  color: var(--vdp-text);
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
  margin: 1em 0 0;
  padding: 1em;
}

.overflow-scroll {
  overflow: scroll;
}
</style>
