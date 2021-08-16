import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/010101',
    name: 'Cicopal Matriz',
    component: () => import('../views/pages/010101.vue')
  },
  {
    path: '/010105',
    name: 'Cicopal Marabá',
    component: () => import('../views/pages/010105.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
