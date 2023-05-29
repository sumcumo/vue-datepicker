<template>
  <div class="example">
    <DatePicker
      v-model="model"
      v-validate="'required'"
      :typeable="true"
      :format="format"
      :input-class="fields[name]"
      :name="name"
      placeholder="Type or select date"
      @blur="touched"
    />
    <div class="error">
      <span>{{ errors.first(name) }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VeeValidate',
  inject: ['$validator'],
  data() {
    return {
      model: '',
      name: 'datepicker',
      format: 'dd.MM.yyyy',
    }
  },
  methods: {
    touched() {
      this.$validator.flag(this.name, {
        untouched: false,
        touched: true,
      })
    },
  },
}
</script>
<style>
@import 'style.css';
</style>
