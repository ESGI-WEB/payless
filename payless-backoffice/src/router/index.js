import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from "../components/Dashboard.vue";
import MerchantList from "../components/MerchantList.vue";
import TransactionList from "../components/TransactionList.vue";
import VueJwtDecode from "vue-jwt-decode"
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import HomeView from "../views/HomeView.vue";

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
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token')
      if (token) {
        if (decodedToken !== null) {
          next('/');
        }
      } else {
        next()
      }
    }
  },
  {
    path: '/dashboard',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token')
      if (!token) {
        next('/');
      } else {
        next()
      }
    }
  },
  {
    path: '/merchantlist',
    name: 'MerchantList',
    component: MerchantList,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token')
      if (!token) {
        next('/');
      } else {
        next()
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
