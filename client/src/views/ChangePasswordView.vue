<template>
  <BulmaChangePassword
    @changePassword="changePassword"
  />
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import axios from "axios";
import BulmaChangePassword from "@/components/BulmaChangePassword.vue"
import TokenStorage from "@/lib/TokenStorage"
import ErrorHandler from "@/lib/ErrorHandler"
import { useStore } from "@/store"
import { useToast } from "vue-toastification";

export default {
  name: "ChangePasswordView",
  components: {
    BulmaChangePassword
  },
  setup() {
    const store = useStore();
    const toast = useToast();

    return {
      store,
      toast
    }
  },
  data() {
    return {
      check:false
    };
  },
  computed: {
  },
  methods: {
    authenticate(login){
      var ref=this
      console.log("Authenticating")
      // console.log(login.email)
      // console.log(login.password)
      login.email=login.email.toLowerCase()
      axios.post(`/api/v1/auth/login`,login)
        .then((result)=>{
          if(result.data.accessToken){
            console.log("Login success, storing tokens")
            TokenStorage.storeAccessToken(result.data.accessToken)
            ref.$router.replace({name:"home"}).catch(err => {});
          }else{
            TokenStorage.clear()
            this.toast.error(result.data.messages)
          }

        }).catch(function (error) {
            ErrorHandler.toast(error)
            TokenStorage.clear()
        })
    },
    changePassword(login){
      var ref=this
      login.email=login.email.toLowerCase()
      axios.post(`/api/v1/auth/changePassword`,login)
        .then((result)=>{
          if(result.data.success){
            this.toast.success("Uw wachtwoord is gewijzigd")
            this.authenticate(login)
          }else{
            this.toast.error(result.data.messages)
          }

        }).catch(function (error) {
            ErrorHandler.toast(error)
        })
    },
  },
  mounted() {
  }
};
</script>
<style lang="scss">
</style>
