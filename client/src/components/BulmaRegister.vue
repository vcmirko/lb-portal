<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card" v-on:keyup.enter="submit">
      <header class="modal-card-head has-background-primary">
        <p class="modal-card-title has-text-dark">{{ myTitle }}</p>
      </header>
      <section class="modal-card-body has-text-left">
        <BulmaInput icon="envelope" v-model="login.email" label="Email" placeholder="Email" :required="true" :hasError="v$.login.email.$invalid" :errors="v$.login.email.$silentErrors" />
      </section>
      <footer class="modal-card-foot" style="gap: 0.5rem">
        <BulmaButton v-if="$route.query.type=='newUser'" icon="key" type="is-success" :disabled="v$.login.$invalid" label="Registreer" @click="register"></BulmaButton>
        <BulmaButton v-if="$route.query.type=='lostPassword'" icon="key" type="is-success" :disabled="v$.login.$invalid" label="Reset Wachtwoord" @click="lostPassword"></BulmaButton>
        <BulmaButton icon="sign-in" type="is-info" label="Terug naar login" @click="back"></BulmaButton>
      </footer>
    </div>
  </div>
</template>
<script>

import BulmaButton from './../components/BulmaButton.vue'
import BulmaInput from './../components/BulmaInput.vue'
import useVuelidate from '@vuelidate/core'
import { required,email, helpers } from '@vuelidate/validators'

export default {
  name: "BulmaRegister",
  props: {
    title: {
      type: String,
      default:"Loonburo Portaal Nieuwe Gebruiker"
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
        email:""
      },
      myTitle:this.title
    }
  },
  validations() {
    return {
      login: {
        email: {
           required: helpers.withMessage('', required),
           email: helpers.withMessage('Geen geldig email adres', email),
        }
      },
    }
  },
  methods: {
    submit(){
      if(this.$route.query.type === 'lostPassword') this.lostPassword()
      else this.register()
    },
    register(){
      if(!this.v$.login.$invalid){
        this.$emit("register",this.login)
      }
    },
    lostPassword(){
      if(!this.v$.login.$invalid){
        this.$emit("lostPassword",this.login)
      }
    },
    back(){
      this.$router.push({ name:'login' })
    }
  },
  mounted(){
    if(this.$route.query?.type=='lostPassword'){
      this.myTitle="Loonburo Webportal Nieuw Wachtwoord"
    }
  }
}
</script>
<style lang="scss">
</style>
