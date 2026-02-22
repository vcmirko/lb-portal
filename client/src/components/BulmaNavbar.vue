<template>
  <nav class="navbar is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a @click="$emit('resetSelected')" class="navbar-item is-size-3 is-family-primary has-text-primary">
        <img :src="store.theme === 'dark' ? '/logo_dark.png' : '/logo_light.png'" class="mr-2" />
      </a>

      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
        @click="menuOpen=!menuOpen"
        :class="{'is-active':menuOpen}"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div class="navbar-menu" :class="{'is-active':menuOpen}">
      <div class="navbar-start">
        <!-- <router-link class="navbar-item" to="/organisation">
          <span class="icon"><font-awesome-icon icon="edit" /></span><span>Organisation</span>
        </router-link> -->
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <span class="icon"><font-awesome-icon icon="user" /></span>
          <span class="mr-3 has-text-weight-bold">{{ email }}</span>
          <button class="button is-ghost mr-2" @click="store.toggleTheme()" :title="store.theme === 'dark' ? 'Schakel naar licht' : 'Schakel naar donker'">
            <span class="icon"><font-awesome-icon :icon="store.theme === 'dark' ? 'sun' : 'moon'" /></span>
          </button>
          <button class="button is-danger is-rounded" @click="$emit('logout')">
            <span class="icon"><font-awesome-icon icon="right-from-bracket" /></span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
import { useStore } from '@/store'
export default {
  name:"BulmaNavbar",
  setup() {
    const store = useStore()
    return { store }
  },
  props: {
    email:{
      type:String,
      default:""
    },
    isAdmin:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      freetextValue:"",
      menuOpen:false
    }
  },
  methods: {
  }
}
</script>
<style lang="scss">

</style>
