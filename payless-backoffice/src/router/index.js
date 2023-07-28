import { createRouter, createWebHistory } from 'vue-router';
import TransactionList from "@/components/TransactionList.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import Dashboard from "@/components/Dashboard.vue";
import HomeView from "@/views/HomeView.vue";
import VueJwtDecode from "vue-jwt-decode"

const routes = [
  {
    path: '/login',
    component: LoginView,
    name: 'Login',
  },
  {
    path: '/register',
    component: RegisterView,
    name: 'Register',
  },
  {
    path: '/',
    component: HomeView,
    name: 'HomeView',
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token')
      if(token) {
        const decodedToken = VueJwtDecode.decode(token);
        if (decodedToken !== null) {
          next('/dashboard');
        }
      }
      else {
        next();
      }
    },
  },
  {
    path: '/transaction',
    component: TransactionList,
  },
  {
    path: '/dashboard',
    component: Dashboard,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
