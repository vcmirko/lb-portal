<template>
  <div>
    <router-view />
  </div>
</template>
<script>
import { useStore } from '@/store'
export default {
  name: "App",
  setup() {
    const store = useStore()
    return { store }
  },
  data() {
    return {
    };
  },
  methods: {
  },
  mounted() {
  }
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

nav {
  padding: 30px;
}
</style>
