import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/index.vue')
  },
  {
    path: '/010101',
    name: 'Cicopal Matriz',
    component: () => import('../views/pages/010101.vue')
  },
  {
    path: '/010103',
    name: 'Cicopal Uberlândia',
    component: () => import('../views/pages/010103.vue')
  },
  {
    path: '/010105',
    name: 'Cicopal Marabá',
    component: () => import('../views/pages/010105.vue')
  },
  {
    path: '/010201',
    name: 'Snacks Matriz',
    component: () => import('../views/pages/010201.vue')
  },
  {
    path: '/010401',
    name: 'Carper',
    component: () => import('../views/pages/010401.vue')
  },
  {
    path: '/060101',
    name: 'MA Distribuição',
    component: () => import('../views/pages/060101.vue')
  },
  {
    path: '/060102',
    name: 'MA Bacabal',
    component: () => import('../views/pages/060102.vue')
  },
  {
    path: '/070101',
    name: 'DF Distribuição',
    component: () => import('../views/pages/070101.vue')
  },
  {
    path: '/080101',
    name: 'Comercial TO',
    component: () => import('../views/pages/080101.vue')
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/erro404",
    component: () => import("../views/Erro404.vue")
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
