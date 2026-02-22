import { createApp } from "vue";
import App from "@/App.vue";
import { createPinia } from 'pinia'
import router from "@/router";
import Toast from "vue-toastification";
import "@/assets/main.scss";
import "@/assets/toast.scss";
import { POSITION } from "vue-toastification";
import { useStore } from "@/store";
const options = {
    position:POSITION.BOTTOM_RIGHT
};

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(far,fas)

const pinia = createPinia()
const app = createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(pinia)
  .use(router)
  .use(Toast, options)

// init theme before mount to avoid flash
useStore().initTheme()

app.mount("#app");
