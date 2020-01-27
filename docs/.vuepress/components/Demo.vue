<template>
  <div>
    <div class="example">
      <h3>Default datepicker...</h3>
      <Datepicker placeholder="Select Date" />
      <code>
        &lt;datepicker placeholder="Select Date"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>v-model datepicker</h3>
      <Datepicker
        v-model="vModelExample"
        placeholder="Select Date"
      />
      <div class="coding">
        <code>
          &lt;datepicker placeholder="Select Date" v-model="vmodelexample"&gt;&lt;/datepicker&gt;
        </code>
        <hr />
        <p>{{ vModelExample }}</p>
      </div>
    </div>

    <div class="example">
      <h3>With default open date</h3>
      <Datepicker :open-date="openDate"/>
      <code>
        &lt;datepicker :disabled="disabled"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Open date:</label>
          <Datepicker v-model="openDate"/>
        </div>
        <pre>openDate: {{ openDate }}</pre>
      </div>
    </div>

    <div class="example">
      <h3>Inline datepicker</h3>
      <Datepicker :inline="true"/>
      <code>
        &lt;datepicker :inline="true"&gt;&lt;/datepicker&gt;
      </code>
    </div>
    <div class="example">
      <h3>RTL datepicker</h3>
      <Datepicker :language="$datepickerLocals.he"/>
      <code>
        &lt;datepicker :language="$datepickerLocals.he"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Day view only</h3>
      <Datepicker
        :minimum-view="'day'"
        :maximum-view="'day'"
      />
      <code>
        &lt;datepicker :minimumView="'day'" :maximumView="'day'"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Day view only RTL</h3>
      <Datepicker
        :minimum-view="'day'"
        :maximum-view="'day'"
        :language="$datepickerLocals.he"
      />
      <code>
        &lt;datepicker :minimumView="'day'" :maximumView="'day'"
        language="$datepickerLocals.he"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Month view only</h3>
      <Datepicker
        :minimum-view="'month'"
        :maximum-view="'month'"
      />
      <code>
        &lt;datepicker :minimumView="'month'" :maximumView="'month'"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Day and month view only</h3>
      <Datepicker
        :minimum-view="'day'"
        :maximum-view="'month'"
        :initial-view="'month'"
      />
      <code>
        &lt;datepicker :minimumView="'day'" :maximumView="'month'"
        :initialView="'month'"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Year and month view only</h3>
      <Datepicker
        :minimum-view="'month'"
        :maximum-view="'year'"
        :initial-view="'year'"
      />
      <code>
        &lt;datepicker :minimumView="'month'" :maximumView="'year'"
        :initialView="'year'"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>With Button</h3>
      <Datepicker
        :calendar-button="true"
        :show-calendar-on-button-click="true"
      />
      <code>
        &lt;datepicker :calendar-button="true" :show-calendar-on-button="true"&gt;&lt;/datepicker&gt;
      </code>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Demo',
  data() {
    return {
      format: 'd MMMM yyyy',
      openDate: null,
      vModelExample: null,
    }
  },
}
</script>

<style>
  @import 'style.css';
</style>

