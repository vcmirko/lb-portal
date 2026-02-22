<template>
  <div class="field">
    <label class="checkbox">
      <input type="checkbox" :value="val" v-model="checked">
      <span class="has-text-weight-bold"> {{ label }}</span>
    </label>
  </div>
</template>
<script>
  export default{
    name:"BulmaCheckbox",
    props: ['modelValue', 'val','label'],
    computed: {
      checked: {
        get() {
          return this.modelValue
        },
        set(value) {
          this.$emit('update:modelValue', value)
        }
      }
    }
  }
</script>
