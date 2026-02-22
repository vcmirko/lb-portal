<template>
  <BulmaRegister
    @register="register"
    @lostPassword="lostPassword"
  />
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import axios from "axios";
import BulmaRegister from "@/components/BulmaRegister.vue"
import ErrorHandler from "@/lib/ErrorHandler"
import { useStore } from "@/store"
import { useToast } from "vue-toastification";

export default {
  name: "RegisterView",
  components: {
    BulmaRegister
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
    };
  },
  computed: {
  },
  methods: {
    register(login){
      var ref=this
      login.email=login.email.toLowerCase()
      axios.post(`/api/v1/auth/register`,login)
        .then((result)=>{
          if(result.data.success){
            this.toast.success("Een mail is verstuurd met een code")
            this.$router.push({name:'changePassword',query:{email:login.email}})
          }else{
            this.toast.error(result.data.messages)
          }
        }).catch(function (error) {
            ErrorHandler.toast(error)
        })
    },
    lostPassword(login){
      var ref=this
      login.email=login.email.toLowerCase()
      axios.post(`/api/v1/auth/lostPassword`,login)
        .then((result)=>{
          if(result.data.success){
            this.toast.success("Een mail is verstuurd met een code")
            this.$router.push({name:'changePassword',query:{email:login.email}})
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
