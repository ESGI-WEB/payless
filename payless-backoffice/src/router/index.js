import { createRouter, createWebHistory } from 'vue-router'
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import AdminView from "../views/AdminView.vue";
import MerchantView from "../views/MerchantView.vue";
import authService from "../services/authService";
import Dashboard from "../components/Dashboard.vue";
import MerchantList from "../components/MerchantList.vue";
import TransactionList from "../components/TransactionList.vue";
import WaitingView from "../views/WaitingView.vue";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { showNavbar: true },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { showNavbar: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { showNavbar: true },
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminView,
      meta: { requiresAuth : true},
    },
    {
      path: '/merchant',
      name: 'Merchant',
      component: MerchantView,
      meta: { requiresAuth : true},
    },
    {
      path: '/waiting',
      name: 'Waiting',
      component: WaitingView,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth : true},
    },
    {
      path: '/merchantlist',
      name: 'MerchantList',
      component: MerchantList,
      meta: { requiresAuth : true},
    },
    {
      path: '/transaction',
      name: 'Transaction',
      component: TransactionList,
      meta: { requiresAuth : true },
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !authService.isLoggedIn()) {
    next('/login');
  } else if (to.path === '/admin' && !authService.isAdmin()) {
    next('/login');
  } else if (to.path === '/merchant' && !authService.isMerchant()) {
    next('/login');
  } else {
    next();
  }
});



export default router
