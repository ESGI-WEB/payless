import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from "../components/Dashboard.vue";
import MerchantList from "../components/MerchantList.vue";
import TransactionList from "../components/TransactionList.vue";
import VueJwtDecode from "vue-jwt-decode"
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import HomeView from "../views/HomeView.vue";
import MerchantView from "@/views/MerchantView.vue";
import WaitingView from "@/views/WaitingView.vue";

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
      const token = localStorage.getItem('authToken')
      if(token) {
        const decodedToken = VueJwtDecode.decode(token);
        if (decodedToken !== null && decodedToken.role === 'admin') {
          next('/dashboard');
          return;
        }
        if (decodedToken !== null && decodedToken.role === 'merchant') {
          next('/merchant');
          return;
        }
      }
      next();
    },
  },
  {
    path: '/transaction',
    component: TransactionList,
    name: 'transaction',
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('authToken')
      if(token) {
        const decodedToken = VueJwtDecode.decode(token);
        if (decodedToken !== null && decodedToken.role === 'merchant-to-validate') {
          next('/waiting-page');
          return;
        }
        if (decodedToken != null && decodedToken.role !== 'admin') {
          next('/')
          return;
        }
      }
      next()
    }
  },
  {
    path: '/dashboard',
    component: Dashboard,
    name: 'dashboard',
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('authToken')
      if(token) {
        const decodedToken = VueJwtDecode.decode(token);
        if (decodedToken !== null && decodedToken.role === 'merchant-to-validate') {
          next('/waiting-page');
          return;
        }
        if (decodedToken != null && decodedToken.role !== 'admin') {
          next('/')
          return;
        }
      }
      next()
    }
  },
  {
    path: '/merchant',
    component: MerchantView,
    name: 'merchant',
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('authToken')
      if(token) {
        const decodedToken = VueJwtDecode.decode(token);
        if (decodedToken !== null && decodedToken.role === 'merchant-to-validate') {
          next('/waiting-page');
          return;
        }
        if (decodedToken !== null && ["admin","merchant"].includes(decodedToken.role)) {
          next();
          return;
        }
      }
      next('/');
    },
  },
  {
    path: '/merchantlist',
    name: 'MerchantList',
    component: MerchantList,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('authToken')
      if(token) {
        const decodedToken = VueJwtDecode.decode(token);
        if (decodedToken !== null && decodedToken.role === 'merchant-to-validate') {
          next('/waiting-page');
          return;
        }
        if (decodedToken != null && decodedToken.role !== 'admin') {
          next('/')
          return;
        }
      }
      next()
    }
  },
  {
    path: '/waiting-page',
    name: 'waiting-page',
    component: WaitingView,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('authToken')
      if(token) {
        const decodedToken = VueJwtDecode.decode(token);
        if (token && decodedToken.role === 'merchant-to-validate') {
          next()
          return;
        }
      }
      next('/')
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
