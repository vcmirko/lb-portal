import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ChangePasswordView from "@/views/ChangePasswordView.vue";
import TokenStorage from "@/lib/TokenStorage";
import {useStore} from "@/store";

// this is middleware to check if menu is available
const checkLoggedIn=(to, from, next) => {
  var payload = TokenStorage.getPayload()
  const store=useStore()
  if(payload && payload.email){
    next()
  }else{
    console.log("You are not logged on")
    return next('/login')
  }
}

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    beforeEnter: (to, from, next) => {
      checkLoggedIn(to, from, next);
    }
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/changePassword",
    name: "changePassword",
    component: ChangePasswordView,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
