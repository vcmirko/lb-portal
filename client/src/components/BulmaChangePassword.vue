<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card" v-on:keyup.enter="changePassword">
      <header class="modal-card-head has-background-primary">
        <p class="modal-card-title has-text-dark">{{ title }}</p>
      </header>
      <section class="modal-card-body has-text-left">
        <BulmaInput icon="envelope" v-model="login.email" label="Email" placeholder="Email" :required="true" :hasError="v$.login.email.$invalid" :errors="v$.login.email.$silentErrors" />
        <BulmaInput icon="key" v-model="login.password" label="Wachtwoord" placeholder="" type="password" :required="true" :hasError="v$.login.password.$invalid" :errors="v$.login.password.$silentErrors" />
        <BulmaInput icon="key" v-model="login.password2" label="Herhaal wachtwoord" placeholder="" type="password" :required="true" :hasError="v$.login.password.$invalid" :errors="v$.login.password2.$silentErrors" />
        <BulmaInput icon="key" v-model="login.check" label="Code (ontvangen per email)" placeholder="123456" type="password" :required="true" :hasError="v$.login.check.$invalid" :errors="v$.login.check.$silentErrors" />
      </section>
      <footer class="modal-card-foot" style="gap: 0.5rem">
        <BulmaButton icon="key" type="is-success" :disabled="v$.login.$invalid" label="Wijzig wachtwoord" @click="changePassword"></BulmaButton>
        <BulmaButton icon="circle-exclamation" type="is-warning" label="Geen code ontvangen" @click="resend"></BulmaButton>
        <BulmaButton icon="sign-in" type="is-info" label="Terug naar login" @click="back"></BulmaButton>
      </footer>
    </div>
  </div>
</template>
<script>

import BulmaButton from './../components/BulmaButton.vue'
import BulmaInput from './../components/BulmaInput.vue'
import useVuelidate from '@vuelidate/core'
import { required,email, sameAs, helpers } from '@vuelidate/validators'

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

const mustBeCode = (value) => {
  const regex = new RegExp('[0-9]{6}'); /* eslint-disable-line */
  return !helpers.req(value) || regex.test(value)
}

export default {
  name: "BulmaLogin",
  props: {
    title: {
      type: String,
      default:"Loonburo Portaal wijzig wachtwoord"
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
        password:"",
        password2:"",
        check:undefined
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
        password2:{
            required: helpers.withMessage('', required),
            sameAs: helpers.withMessage('Wachtwoord zijn niet gelijk', sameAs(this.login.password))
        },
        check:{
          required: helpers.withMessage('', required),
          mustBeCode: helpers.withMessage('De code is 6 cijfers lang', mustBeCode)
        }
      },
    }
  },
  methods: {
    back(){
      this.$router.push({name:'login'})
    },
    resend(){
      this.$router.back()
    },
    changePassword(){
      this.$emit('changePassword',this.login)
    }
  },
  mounted(){
    this.login.email = this.$route.query.email
  }
}
</script>
<style lang="scss">
</style>
