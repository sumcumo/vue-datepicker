<template>
  <div class="example">
    <Datepicker
      v-model="model"
      v-validate="'required'"
      :typeable="true"
      :format="format"
      :input-class="fields[name]"
      :name="name"
      @blur="touched"
      placeholder="Type or select date"
    />
    <div class="error">
      <span>{{ errors.first(name) }}</span>
    </div>
  </div>
</template>

<script>
// export component
export default {
  name: 'VeeValidate',
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
  inject: ['$validator'],
}
</script>
<style>
@import 'style.css';
</style>
