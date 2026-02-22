<template>
  <div class="field">
    <label v-if="label!=''" class="label">{{label}} <span v-if="required" class="has-text-danger">*</span></label>
    <p class="control" :class="{'has-icons-left':icon}">
      <input class="input" @keyup.enter="$emit('enterClicked')"  :readonly="readonly" :type="type" :value="modelValue" :class="{'is-danger':hasError}" @input="updateValue" :placeholder="placeholder">
      <span class="icon is-left" v-if="icon">
        <font-awesome-icon :icon="icon" />
      </span>
    </p>
    <p class="has-text-danger" v-for="e in errors" :key="e.$message">{{ e.$message }}</p>
  </div>
</template>
<script>

  export default{
    name:"BulmaInput",
    props:{
      focus:{type:String,default:""},
      modelValue:{type:[String,Number],default:""},
      required:{type:Boolean,default:false},
      type:{type:String,default:"text"},
      readonly:{type:Boolean,default:false},
      placeholder:{type:String,default:""},
      icon:{type:[String,Array],default:''},
      label:{type:String,default:""},
      hasError:{type:Boolean,default:false},
      errors:{type:Array},
    },
    data(){
      return{
      }
    },
    methods:{
      updateValue(event){
        this.$emit('update:modelValue', event.target.value);
      }
    }
  }
</script>
<style scoped>
  .select, .select select{
    width:100%;
  }
</style>
