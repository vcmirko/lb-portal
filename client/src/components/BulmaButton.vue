<template>
    <button class="button" :class="type" @click="click" :disabled="disabled">
      <span class="icon" v-if="message==''"><font-awesome-icon :icon="icon" /></span>
      <span class="icon" v-if="message!=''"><font-awesome-icon icon="spinner" spin /></span>
      <span v-if="message==''">{{ label }}</span>
      <span v-if="message!=''">{{ message }}</span>
    </button>
</template>
<script>
  export default{
    name:"BulmaButton",
    inheritAttrs: false,
    props:{
      type:{type:String,default:'is-info'},
      icon:{type:String,default:'fa-user'},
      label:{type:String,required:true},
      message:{type:String,default:''},
      disabled:{type:Boolean,default:false}
    },
    data(){
      return  {

      }
    },methods:{
      click(event){
        this.$emit('click','bye')
      }
    }
  }
</script>
