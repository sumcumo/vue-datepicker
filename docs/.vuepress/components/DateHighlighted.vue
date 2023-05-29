<template>
  <div>
    <div class="example">
      <h3>Highlighting Dates</h3>
      <DatePicker :highlighted="highlighted" />

      <code>
        &lt;datepicker :highlighted="highlighted"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Highlight from:</label>
          <DatePicker @selected="highlightFrom" />
        </div>
        <div class="form-group">
          <label>Highlight to:</label>
          <DatePicker @selected="highlightTo" />
        </div>
        <div class="form-group">
          <label>Highlight Days of Month:</label>
          <input type="text" value="" @change="setHighlightedDays" />
        </div>
        <pre>highlighted: {{ highlighted }}</pre>
      </div>
    </div>

    <div class="example">
      <h3>Highlighting Dates Matching Given Function</h3>
      <DatePicker :highlighted="highlightedFn" />
      <code>
        &lt;datepicker :highlighted="highlightedFn"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <pre>
  highlightedFn: {
    customPredictor: function (date) {
      // highlights every day of a month which is a multiple of 4
      if (date.getDate() % 4 === 0) {
        return true
      }
    }
  }
        </pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DateHighlighted',
  data() {
    return {
      highlightedFn: {
        customPredictor(date) {
          return date.getDate() % 4 === 0
        },
      },
      highlighted: {},
    }
  },
  methods: {
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
  },
}
</script>

<style>
@import 'style.css';
</style>
