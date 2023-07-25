import { createRouter, createWebHistory } from 'vue-router'
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import AdminView from "../views/AdminView.vue";
import MerchantView from "../views/MerchantView.vue";
import authService from "../services/authService";
import Dashboard from "../components/Dashboard.vue";
import MerchantList from "../components/MerchantList.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminView,
    },
    {
      path: '/merchant',
      name: 'Merchant',
      component: MerchantView,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { showNavbar: true },
    },
    {
      path: '/merchantlist',
      name: 'MerchantList',
      component: MerchantList,
      meta: { showNavbar: true },
    },
  ]
})


export default router
