<template>
  <div>
    <div class="example">
      <h5>{{ $datepickerLocales[language].language }} datepicker</h5>

      <DatePicker
        :language="$datepickerLocales[language]"
        placeholder="Datepicker based on settings below..."
      />
      <code>
        &lt;datepicker :language="$datepickerLocales.{{ language }}"&gt;
        &lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <select v-model="language">
          <option
            v-for="(lang, key) in $datepickerLocales"
            :key="key"
            :value="key"
          >
            {{ lang.language }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DateLanguage',
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
