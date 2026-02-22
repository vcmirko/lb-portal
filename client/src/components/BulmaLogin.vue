<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card" v-on:keyup.enter="authenticate">
      <header class="modal-card-head has-background-primary">
        <p class="modal-card-title has-text-dark">{{ title }}</p>
      </header>
      <section class="modal-card-body has-text-left">
        <BulmaInput icon="envelope" v-model="login.email" label="Email" placeholder="Email" :required="true" :hasError="v$.login.email.$invalid" :errors="v$.login.email.$silentErrors" />
        <BulmaInput icon="key" v-model="login.password" label="Password" placeholder="" type="password" :required="true" :hasError="v$.login.password.$invalid" :errors="v$.login.password.$silentErrors" />
      </section>
      <footer class="modal-card-foot" style="gap: 0.5rem">
        <BulmaButton icon="sign-in" type="is-success" :disabled="v$.login.$invalid" label="Login" @click="authenticate"></BulmaButton>
        <BulmaButton icon="key" type="is-warning" label="Wachtwoord vergeten" @click="lostPassword"></BulmaButton>
        <BulmaButton icon="pen-to-square" type="is-info" label="Maak nieuw wachtwoord" @click="register"></BulmaButton>
      </footer>
    </div>
  </div>
</template>
<script>

import BulmaButton from './../components/BulmaButton.vue'
import BulmaInput from './../components/BulmaInput.vue'
import useVuelidate from '@vuelidate/core'
import { required,email, helpers } from '@vuelidate/validators'

const mustContainUpper = (value) => {
  const regex = new RegExp('[A-Z]+'); /* eslint-disable-line */
  return !helpers.req(value) || regex.test(value)
}
const mustContainLower = (value) => {
  const regex = new RegExp('[a-z]+'); /* eslint-disable-line */
  return !helpers.req(value) || regex.test(value)
}
const mustContainNumber = (value) => {
  const regex = new RegExp('[0-9]+'); /* eslint-disable-line */
  return !helpers.req(value) || regex.test(value)
}
const mustContainSpecial = (value) => {
  const regex = new RegExp('[~`!@#$%^&*()_\\\\\\-+={}[\\]|:;<,>\\.?]+'); /* eslint-disable-line */
  return !helpers.req(value) || regex.test(value)
}
const mustBeEightLong = (value) => {
  const regex = new RegExp('.{8,}'); /* eslint-disable-line */
  return !helpers.req(value) || regex.test(value)
}

export default {
  name: "BulmaLogin",
  props: {
    title: {
      type: String,
      default:"Loonburo Portaal Login"
    }
  },
  components:{BulmaButton,BulmaInput},
  setup(){
    const v$ = useVuelidate();
    return {
      v$
    }
  },
  data() {
    return {
      login:{
        email:"",
        password:""
      }
    }
  },
  validations() {
    return {
      login: {
        email: {
           required: helpers.withMessage('', required),
           email: helpers.withMessage('Geen geldig email adres', email),
        },
        password: {
            required: helpers.withMessage('', required),
            mustContainLower: helpers.withMessage('Moet minstens 1 kleine letter bevatten', mustContainLower),
            mustContainUpper: helpers.withMessage('Moet minstens 1 grote letter bevatten', mustContainUpper),
            mustContainSpecial: helpers.withMessage('Moet minstens 1 speciaal teken bevatten', mustContainSpecial),
            mustContainNumber: helpers.withMessage('Moet minstens 1 getal bevatten', mustContainNumber),
            mustBeEightLong: helpers.withMessage('Moet minstens 8 lang zijn', mustBeEightLong)
        },
      },
    }
  },
  methods: {
    authenticate(){
      if(!this.v$.login.$invalid){
        this.$emit("authenticate",this.login)
      }
    },
    register(){
      this.$router.push({ name: "register", query: { type: 'newUser'} });
    },
    lostPassword(){
      this.$router.push({ name: "register", query: { type: 'lostPassword'} });
    }
  }
}
</script>
<style lang="scss">
</style>
