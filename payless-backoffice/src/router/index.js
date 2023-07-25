import { createRouter, createWebHistory } from 'vue-router'
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import AdminView from "../views/AdminView.vue";
import MerchantView from "../views/MerchantView.vue";
import authService from "../services/authService";
import Dashboard from "../components/Dashboard.vue";
import MerchantList from "../components/MerchantList.vue";
import TransactionList from "../components/TransactionList.vue";
import WaitingPage from "../views/WaitingPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
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
      meta: { showNavbar: true, requiresAuth : true},
    },
    {
      path: '/merchantlist',
      name: 'MerchantList',
      component: MerchantList,
      meta: { showNavbar: true, requiresAuth : true},
    },
    {
      path: '/transaction',
      name: 'Transaction',
      component: TransactionList,
      meta: { showNavbar: true, requiresAuth : true},
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
