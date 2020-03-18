import { InbestRoute, AssetsVisibilityMode } from './../model/ui/SystemDefinitions';
import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/Home.vue'
import Registration from '../views/Registration.vue';
import Dashboard from '../views/Dashboard.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Registration,
    meta: {
      public: true
    }
  },
  {
    path: '/registration/:persona',
    name: 'registration',
    component: Registration,
    meta: {
      public: true
    }
  },
  {
    path: '/dashboard/:persona',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      public: false
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
