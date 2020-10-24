import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/contas',
    name: 'Contas',
    component: () => import('../views/Contas.vue')
  },
  {
    path: '/relatorios',
    name: 'Relatórios',
    component: () => import('../views/Relatorios.vue')
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import('../views/Usuarios.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
