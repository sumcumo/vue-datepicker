<template>
  <div>
    <div class="example">
      <h5>{{ languages[language].language }} datepicker</h5>

      <Datepicker
        :language="languages[language]"
      ></Datepicker>
      <code>
        &lt;datepicker :language="languages.{{ language }}"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <select v-model="language">
          <option
            v-for="(language, key) in languages"
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
import * as lang from '../../../dist/locale'
import Datepicker from '../../../dist/vuejs-datepicker'

export default {
  name: 'Language',
  components: {
    Datepicker,
  },
  data() {
    return {
      languages: lang,
      language: 'en',
    }
  },
}
</script>

<style>
@import 'style.css';
</style>
