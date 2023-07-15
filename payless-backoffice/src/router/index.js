import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from "../views/Dashboard.vue";
import CompteMarchand from "../views/CompteMarchand.vue";
import Transaction from "../views/Transaction.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/dashboard ',
      name: 'dash-admin',
      component: DashboardView
    },
    {
      path: '/comptes-marchands',
      name: 'comptes-marchand',
      component: CompteMarchand,
    },
    {
      path: '/transaction',
      name: 'transaction',
      component: Transaction,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
