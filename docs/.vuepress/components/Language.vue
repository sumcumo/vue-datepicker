<template>
  <div>
    <div class="example">
      <h5>{{ $datepickerLocals[language].language }} datepicker</h5>

      <Datepicker
        :language="$datepickerLocals[language]"
      />
      <code>
        &lt;datepicker :language="$datepickerLocals.{{ language }}"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <select v-model="language">
          <option
            v-for="(language, key) in $datepickerLocals"
            :key="key"
            :value="key"
          >
            {{ language.language }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Language',
  data() {
    return {
      language: 'en',
    }
  },
}
</script>

<style>
@import 'style.css';
</style>
