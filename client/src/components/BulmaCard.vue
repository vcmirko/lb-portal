<template>
  <div class="card" :class="cssClass">
    <div class="card-image">
      <figure class="image is-4by3" v-if="!noResize">
        <img :src="image" :alt="title">
      </figure>
      <img :src="image" :alt="title" v-else>
    </div>
    <div class="card-content">
      <div class="content">
        <h2 class="subtitle is-family-sans-serif has-text-success is-size-7">{{ title }}</h2>
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    cssClass: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default:""
    },
    image: {
      type: String,
      default:""
    },
    noResize: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="scss">
  .image img {
    height: 100%;
    object-fit: cover;
  }
</style>
